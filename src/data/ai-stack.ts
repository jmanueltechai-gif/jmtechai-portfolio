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
  what: 'Operations experience paired with practical automation and real project work.',
  stack: 'Operations · Automation',
  children: [
    {
      id: 'receiptiq',
      Icon: Coffee,
      name: 'ReceiptIQ',
      what: 'Turns receipt photos into organized expenses, spending insights, and downloadable reports.',
      stack: 'Lovable · Gemini AI',
    },
    {
      id: 'job-tracker',
      Icon: MagnifyingGlass,
      name: 'Job Listing Tracker',
      what: 'Finds new remote job listings, checks for duplicates, and scores matches.',
      stack: 'n8n · Airtable · Gemini',
    },
    {
      id: 'lead-enrichment',
      Icon: MagnifyingGlass,
      name: 'Lead Enrichment & Scoring',
      what: 'Adds context to incoming leads, scores fit, and routes follow-up.',
      stack: 'Zapier · Apollo.io · Google Sheets · Slack',
    },
    {
      id: 'financial-reconciliation',
      Icon: Coffee,
      name: 'Financial Reconciliation',
      what: 'Moves transaction details from project tracking toward accounting.',
      stack: 'Make · Asana · Xero · Google Sheets',
    },
    {
      id: 'healthcare-hiring',
      Icon: Coffee,
      name: 'Healthcare Hiring Pipeline',
      what: 'Organizes candidate steps from application through status updates.',
      stack: 'Make · Google Forms · Gmail · Slack',
    },
    {
      id: 'crm-engagement',
      Icon: MagnifyingGlass,
      name: 'CRM Lead Engagement',
      what: 'Keeps lead follow-up and pipeline updates organized.',
      stack: 'Zapier · Asana · Gmail · Google Drive',
    },
    {
      id: 'lead-booking',
      Icon: Sparkle,
      name: 'Lead Qualification & Booking',
      what: 'Routes consultation requests and supports the booking process.',
      stack: 'GoHighLevel · Forms · Calendar',
    },
    {
      id: 'lead-nurture',
      Icon: Sparkle,
      name: 'Lead Nurture Sequence',
      what: 'Welcomes new contacts and creates an organized follow-up path.',
      stack: 'GoHighLevel · Email · SMS',
    },
  ],
}
