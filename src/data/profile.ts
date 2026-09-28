import { Briefcase, SealCheck, Clock, type Icon } from '@/components/slab'

export type SocialLink = { label: string; href: string; iconPath: string }
export type Stat = { value: string; label: string; Icon: Icon }
export type Profile = {
  name: string; firstName: string; handle: string; role: string; avatarSrc: string
  verifiedLabel: string; email: string; location: string; stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: { body: string; portraitSrc: string; portraitAlt: string }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'JM Manuel',
  firstName: 'JM',
  handle: '@jmanueltechai',
  role: 'Operations Leader & AI Automation Specialist',
  avatarSrc: 'https://jmtechautomation.lovable.app/assets/profile-photo-I-q3nXZ3.jpg',
  verifiedLabel: 'Portfolio owner',
  email: 'jmanueltechai@gmail.com',
  location: 'Remote collaboration',
  stats: [
    { value: 'Ops', label: 'Leadership', Icon: Briefcase },
    { value: 'AI', label: 'Automation', Icon: SealCheck },
    { value: 'Remote', label: 'Collaboration', Icon: Clock },
  ],
  displayName: { line1: 'JM Manuel', line2: 'Operations & Automation' },
  hero: {
    body: 'Helping businesses work smarter through clear processes, thoughtful automation, and practical AI.',
    portraitSrc: 'https://jmtechautomation.lovable.app/assets/profile-photo-I-q3nXZ3.jpg',
    portraitAlt: 'JM Manuel',
  },
  socials: [
    { label: 'LinkedIn profile', href: 'https://linkedin.com/in/john-michael-manuel/', iconPath: '/icons/linkedin.svg' },
  ],
}