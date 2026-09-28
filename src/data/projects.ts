export type AppStat = { value: string; label: string }
export type AppProject = {
  name: string; tagline: string; description: string; imageSrc?: string
  imagePosition?: string; accentColor: string; stats: AppStat[]; badge: string
}
export type MobileApp = AppProject

export const mobileApps: MobileApp[] = [
  {
    name: 'ReceiptIQ',
    tagline: 'Turn receipt photos into organized expense records.',
    description: 'A mobile-friendly expense tool that reads receipt details, helps users review spending, and creates PDF or CSV reports. A sample-data demo is available online.',
    imageSrc: 'https://aireceipt.lovable.app/og-image.png',
    accentColor: '#2563EB',
    stats: [{ value: 'AI', label: 'Receipt capture' }, { value: 'PDF', label: 'Reports' }, { value: 'CSV', label: 'Export' }],
    badge: 'Featured · Web app',
  },
  {
    name: 'Automated Job Listing Tracker',
    tagline: 'A refreshed shortlist of relevant remote opportunities.',
    description: 'An n8n workflow collects Remotive listings, checks Airtable for existing job IDs, scores matches with Gemini, then saves the results. Useful for recruiters, staffing teams, and freelancers looking for work.',
    
    accentColor: '#7C3AED',
    stats: [{ value: '6 hrs', label: 'Scheduled refresh' }, { value: '38', label: 'Records shown' }, { value: 'AI', label: 'Match scoring' }],
    badge: 'Featured · n8n',
  },
]

export const webApps: AppProject[] = mobileApps
