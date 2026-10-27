'use client';
import { useState } from 'react';
import { Collection } from '@/components/Collection';
import { PageHead, Tabs } from '@/components/ui';
import { isoToday } from '@/lib/dates';

export default function Growth() {
  const [tab, setTab] = useState('skills');
  return (
    <div className="page">
      <PageHead eyebrow="Personal development" title="Growth" sub="Skills you are building, what you are reading and studying, and what you are learning along the way." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'skills', label: 'Skills' }, { id: 'reading', label: 'Reading' }, { id: 'courses', label: 'Courses' }, { id: 'interests', label: 'Interests' }, { id: 'log', label: 'Learning log' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'skills' && <Collection storeKey="growth:skills" title="Skills" noun="skill" activityHref="/growth" fields={[{ key: 'name', label: 'Skill', required: true }, { key: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Developing', 'Competent', 'Strong'], defaultValue: 'Beginner' }, { key: 'practice', label: 'How I practise' }, { key: 'goal', label: 'Goal', type: 'textarea', hideInTable: true }]} inlineSelect={['level']} emptyTitle="No skills yet" emptyHint="List the skills you want to build and how you will practise them." />}
        {tab === 'reading' && <Collection storeKey="growth:reading" title="Reading list" noun="book" activityHref="/growth" fields={[{ key: 'title', label: 'Title', required: true }, { key: 'author', label: 'Author' }, { key: 'status', label: 'Status', type: 'select', options: ['Want to read', 'Reading', 'Finished'], defaultValue: 'Want to read' }, { key: 'rating', label: 'Rating', type: 'rating' }, { key: 'notes', label: 'Notes and highlights', type: 'textarea', hideInTable: true }]} inlineSelect={['status']} emptyTitle="No books yet" />}
        {tab === 'courses' && <Collection storeKey="growth:courses" title="Courses" noun="course" activityHref="/growth" fields={[{ key: 'title', label: 'Course', required: true }, { key: 'provider', label: 'Provider' }, { key: 'status', label: 'Status', type: 'select', options: ['Planned', 'In progress', 'Completed'], defaultValue: 'Planned' }, { key: 'url', label: 'Link', type: 'url' }, { key: 'due', label: 'Target finish', type: 'date', warn: true }]} inlineSelect={['status']} emptyTitle="No courses yet" />}
        {tab === 'interests' && <Collection storeKey="growth:interests" title="Interests" noun="interest" activityHref="/growth" fields={[{ key: 'name', label: 'Interest', required: true }, { key: 'notes', label: 'What draws you to it', type: 'textarea' }]} emptyTitle="No interests listed" />}
        {tab === 'log' && <Collection storeKey="growth:log" title="Learning log" noun="entry" activityHref="/growth" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[{ key: 'learned', label: 'What I learned', type: 'textarea', required: true }, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday() }, { key: 'source', label: 'Source' }]} emptyTitle="Nothing logged" emptyHint="A line or two each week compounds." />}
      </div>
    </div>
  );
}
