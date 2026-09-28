import { Sparkle, MagnifyingGlass, Coffee, type Icon } from '@/components/slab'
import { profile } from '@/data/profile'

export type StackStatus = 'Live' | 'Internal' | 'Beta'
export type StackLogo = { src: string; name: string }
export type StackNode = {
  id: string; name: string; what: string; stack?: string; status?: StackStatus
  Icon: Icon; logos?: StackLogo[]; children?: StackNode[]
}

export const aiStack: StackNode = {
  id: 'root',
  Icon: Sparkle,
  name: profile.name,
  what: 'Operations experience paired with practical automation and AI projects.',
  stack: 'Operations · Automation',
  children: [
    {
      id: 'receiptiq',
      Icon: Coffee,
      name: 'ReceiptIQ',
      what: 'Turns receipt photos into organized expense records and shareable reports.',
      stack: 'Lovable · Gemini AI',
      status: 'Internal',
    },
    {
      id: 'job-tracker',
      Icon: MagnifyingGlass,
      name: 'Job Listing Tracker',
      what: 'Collects job listings, checks for existing records, and scores how well each matches.',
      stack: 'n8n · Airtable · Gemini',
      status: 'Internal',
    },
  ],
}
