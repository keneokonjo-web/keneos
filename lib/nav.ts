import { VENTURES } from './themes';

export type NavItem = { href: string; label: string; icon: string; children?: { href: string; label: string }[]; badge?: 'tasks' | 'activity' };
export const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: 'General',
    items: [
      { href: '/', label: 'Home', icon: 'Home' },
      { href: '/plan', label: 'Plan', icon: 'CalendarCheck', badge: 'tasks' },
      { href: '/goals', label: 'Goals and life plan', icon: 'Target' },
      { href: '/activity', label: 'Activity', icon: 'Bell', badge: 'activity' },
    ],
  },
  {
    label: 'Work',
    items: [
      { href: '/businesses', label: 'Businesses', icon: 'Briefcase', children: VENTURES.map((v) => ({ href: `/businesses/${v.slug}`, label: v.name })) },
      { href: '/files', label: 'Files', icon: 'Folder' },
    ],
  },
  {
    label: 'Money',
    items: [
      { href: '/finance', label: 'Personal finance', icon: 'Wallet' },
      { href: '/investments', label: 'Investments', icon: 'TrendingUp' },
    ],
  },
  {
    label: 'Life',
    items: [
      { href: '/education', label: 'Education', icon: 'GraduationCap' },
      { href: '/health', label: 'Health and routine', icon: 'HeartPulse' },
      { href: '/growth', label: 'Personal development', icon: 'Sprout' },
      { href: '/lifestyle', label: 'Lifestyle', icon: 'Sparkles' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/waiting', label: 'Waiting room', icon: 'Hourglass' },
      { href: '/reviews', label: 'Reviews and reports', icon: 'BarChart3' },
      { href: '/jarvis', label: 'Assistant', icon: 'Bot' },
      { href: '/settings', label: 'Settings', icon: 'Settings' },
    ],
  },
];
