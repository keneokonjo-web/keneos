'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore, uid } from '@/lib/store';
import { buildContext } from '@/lib/context';
import { useSettings } from '@/lib/settings';
import type { OrbState } from './Orb';

export type Msg = { id: string; role: 'user' | 'assistant'; content: string; error?: boolean; at: string };

type SR = { start(): void; stop(): void; abort(): void; lang: string; interimResults: boolean; continuous: boolean; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null };

export function useAssistant() {
  const [settings] = useSettings();
  const [msgs, setMsgs] = useStore<Msg[]>('jarvis:chat', []);
  const [state, setState] = useState<OrbState>('idle');
  const [level, setLevel] = useState(0);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const rec = useRef<SR | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const msgsRef = useRef(msgs);
  msgsRef.current = msgs;

  const stopMic = useCallback(() => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setLevel(0);
  }, []);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return;
    setDraft('');
    setNotice('');
    const user: Msg = { id: uid(), role: 'user', content, at: new Date().toISOString() };
    const history = [...msgsRef.current, user];
    setMsgs(history.slice(-60));
    setState('thinking');
    try {
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12).map((m) => ({ role: m.role, content: m.content })), context: buildContext(), name: settings.assistantName }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) throw new Error(data.error || 'Something went wrong.');
      setMsgs((p) => [...p, { id: uid(), role: 'assistant' as const, content: data.reply!, at: new Date().toISOString() }].slice(-60));
      if (settings.voiceReplies && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(data.reply);
        u.onstart = () => setState('speaking');
        u.onend = () => setState('idle');
        u.onerror = () => setState('idle');
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } else setState('idle');
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Something went wrong.';
      setMsgs((p) => [...p, { id: uid(), role: 'assistant' as const, content: m, error: true, at: new Date().toISOString() }].slice(-60));
      setState('error');
      setTimeout(() => setState('idle'), 2500);
    }
  }, [setMsgs, settings.assistantName, settings.voiceReplies]);

  const listen = useCallback(async () => {
    if (state === 'listening') { rec.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) { setNotice('Voice input is not supported in this browser. Use Chrome, Edge or Safari, or type instead.'); return; }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setNotice('Microphone access was blocked. Allow it in your browser to talk to the assistant.');
      return;
    }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new AC();
      ctxRef.current = ac;
      const an = ac.createAnalyser();
      an.fftSize = 256;
      ac.createMediaStreamSource(stream.current).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const loop = () => {
        an.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        setLevel(Math.min(1, sum / buf.length / 90));
        raf.current = requestAnimationFrame(loop);
      };
      loop();
    } catch { /* orb simply won't react to level */ }
    const r = new Ctor();
    rec.current = r;
    r.lang = 'en-GB';
    r.interimResults = true;
    r.continuous = false;
    let finalText = '';
    r.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      finalText = t;
      setDraft(t);
    };
    r.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') setNotice(`Voice input error: ${e.error}.`); };
    r.onend = () => {
      stopMic();
      if (finalText.trim()) send(finalText); else setState('idle');
    };
    setState('listening');
    r.start();
  }, [state, send, stopMic]);

  useEffect(() => () => { rec.current?.abort(); stopMic(); if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, [stopMic]);

  const clear = () => setMsgs([]);
  return { msgs, state, level, draft, setDraft, send, listen, notice, clear, name: settings.assistantName };
}
