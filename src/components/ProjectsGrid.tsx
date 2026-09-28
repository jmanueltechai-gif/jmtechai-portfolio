import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X, Ticket, Robot, CursorClick, Stack } from '@/components/slab'
import { useIsPhone } from '@/hooks/useMediaQuery'

type Project = {
  id: string
  title: string
  description: string
  category: 'apps' | 'automation'
  Icon: ComponentType<{ size?: number }>
  tools: string[]
  CaseStudy: ReactNode
  thumbnail?: string
}

const PROJECTS: Project[] = [
  {
    id: 'receiptiq',
    title: 'ReceiptIQ — AI Expense & Receipt Tracker',
    description: 'Turns receipt photos into organized expense records, spending insights, and downloadable reports.',
    category: 'apps',
    Icon: Ticket,
    tools: ['Lovable', 'Gemini AI', 'PDF & CSV reports'],
    CaseStudy: <ReceiptIQCaseStudy />,
  },
  {
    id: 'job-tracker',
    title: 'Automated Job Listing Tracker',
    description: 'Collects remote job listings, checks for duplicates, and scores matches for recruiters and independent freelancers.',
    category: 'automation',
    Icon: Robot,
    tools: ['n8n', 'Airtable', 'Gemini'],
    thumbnail: '/projects/job-listing-workflow.png',
    CaseStudy: <JobTrackerCaseStudy />,
  },
  {
    id: 'lead-enrichment',
    title: 'Autonomous Lead Enrichment & Scoring Pipeline',
    description: 'Enriches incoming leads, scores them against business criteria, and routes follow-up by fit.',
    category: 'automation',
    Icon: Robot,
    tools: ['Zapier', 'Apollo.io', 'Google Sheets', 'Slack'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-1-CKUT4pWa.png',
    CaseStudy: <LegacyCaseStudy title="Autonomous Lead Enrichment & Scoring Pipeline" subtitle="A lead workflow that adds useful context to form submissions and helps teams prioritize follow-up." details={['Connects submitted forms with Apollo.io for contact enrichment.', 'Applies a custom score and routes enterprise and small-business leads separately.', 'Records lead details in Google Sheets and sends Slack notifications.']} tools="Zapier, Apollo.io, Google Sheets, and Slack" />,
  },
  {
    id: 'financial-reconciliation',
    title: 'Automated Financial Reconciliation Pipeline',
    description: 'Moves transaction information from project tracking into accounting records with less manual entry.',
    category: 'automation',
    Icon: Stack,
    tools: ['Make', 'Asana', 'Xero', 'Google Sheets'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-2-Bt3bzDYm.png',
    CaseStudy: <LegacyCaseStudy title="Automated Financial Reconciliation Pipeline" subtitle="A workflow designed to keep transaction details consistent as they move from project work into accounting." details={['Moves relevant transaction data from project tracking toward accounting.', 'Reduces repeated manual entry between tools.', 'Keeps a clearer record for review and reporting.']} tools="Make, Asana, Xero, and Google Sheets" />,
  },
  {
    id: 'healthcare-hiring',
    title: 'Automated Healthcare Hiring Pipeline',
    description: 'Organizes candidate steps from application through status updates for a healthcare practice.',
    category: 'automation',
    Icon: Stack,
    tools: ['Make', 'Google Forms', 'Gmail', 'Slack'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-3-EkJPV2UP.png',
    CaseStudy: <LegacyCaseStudy title="Automated Healthcare Hiring Pipeline" subtitle="A multi-step hiring workflow for a healthcare practice, designed to make candidate progress easier to follow." details={['Captures new applications through a form.', 'Moves candidate information through a structured hiring process.', 'Shares status updates with the team as candidates progress.']} tools="Make, Google Forms, Gmail, Slack, and Google Sheets" />,
  },
  {
    id: 'crm-engagement',
    title: 'Automated CRM Lead Engagement & Pipeline Orchestration',
    description: 'Organizes lead follow-up and moves active prospects through a clear engagement pipeline.',
    category: 'automation',
    Icon: Robot,
    tools: ['Zapier', 'Asana', 'Gmail', 'Google Drive'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-4-DA-tUzps.png',
    CaseStudy: <LegacyCaseStudy title="Automated CRM Lead Engagement & Pipeline Orchestration" subtitle="A lead-engagement workflow built to make sure high-priority prospects receive timely, organized follow-up." details={['Tracks prospects as they move from new lead to active engagement.', 'Creates follow-up tasks and keeps supporting information together.', 'Helps the team respond consistently to higher-priority prospects.']} tools="Zapier, Asana, Gmail, Google Drive, and AI by Zapier" />,
  },
  {
    id: 'lead-booking',
    title: 'Automated Lead Qualification & Booking Pipeline',
    description: 'Routes consultation requests by need and supports the booking journey through follow-up.',
    category: 'automation',
    Icon: Robot,
    tools: ['GoHighLevel', 'Forms', 'Calendar'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-5-1-CTADJPzH.png',
    CaseStudy: <LegacyCaseStudy title="Automated Lead Qualification & Booking Pipeline" subtitle="A 20-plus-step GoHighLevel workflow for capturing consultation requests and guiding each lead toward the right next step." details={['Routes requests by service type, including consultation, general inquiry, and project quote.', 'Sends a calendar link, checks booking status, and follows up when needed.', 'Updates the CRM stage as the lead moves through the process.']} tools="GoHighLevel, forms, calendar, CRM pipeline, and email automation" />,
  },
  {
    id: 'lead-nurture',
    title: 'Automated Lead Nurture Sequence',
    description: 'Welcomes new contacts, organizes them in the CRM, and creates a clear follow-up task.',
    category: 'automation',
    Icon: Robot,
    tools: ['GoHighLevel', 'Email', 'SMS'],
    thumbnail: 'https://jmtechautomation.lovable.app/assets/project-6-U4R_ipAk.png',
    CaseStudy: <LegacyCaseStudy title="Automated Lead Nurture Sequence" subtitle="A seven-step follow-up workflow that starts when a new contact enters the CRM." details={['Sends a personalized first response after a short delay and notifies the team.', 'Adds a new-lead tag and creates an opportunity in the pipeline.', 'Assigns a follow-up task so the next action is easy to find.']} tools="GoHighLevel, email, SMS, CRM pipeline, and task management" />,
  },

]

function StoryFrame({ title, subtitle, link, children }: {
  title: string
  subtitle: string
  link?: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <article style={{
      boxSizing: 'border-box',
      height: '100%',
      overflowY: 'auto',
      padding: 'clamp(24px, 5vw, 56px)',
      background: 'var(--cream, #f4f4ed)',
      color: 'var(--navy)',
      borderRadius: 20,
    }}>
      <p style={{ margin: '0 0 10px', color: 'var(--accent, #e8743b)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
        Project case study
      </p>
      <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ maxWidth: 760, margin: '0 0 30px', fontSize: 18, lineHeight: 1.6 }}>{subtitle}</p>
      {link && (
        <p style={{ margin: '0 0 30px' }}>
          <a href={link.href} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 700 }}>
            {link.label} <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </a>
        </p>
      )}
      {children}
    </article>
  )
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ maxWidth: 850, margin: '28px 0' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>{title}</h3>
      <div style={{ lineHeight: 1.65 }}>{children}</div>
    </section>
  )
}

function JobTrackerCaseStudy() {
  return (
    <StoryFrame
      title="Automated Job Listing Tracker"
      subtitle="A scheduled workflow that gathers remote job listings, checks for existing records, and scores how closely each role matches. It can support recruiters, staffing teams, and individual freelancers looking for opportunities."
    >
      <CaseSection title="The challenge">
        <p>Finding relevant openings can mean checking job boards repeatedly, copying listings into a tracker, and reviewing the same posting more than once.</p>
      </CaseSection>
      <CaseSection title="How it works">
        <ol>
          <li><strong>Fetch:</strong> n8n requests current listings from Remotive on a six-hour schedule.</li>
          <li><strong>Check:</strong> Each job ID is compared against Airtable to identify records already in the database.</li>
          <li><strong>Score:</strong> New listings are sent to Gemini in batches and receive a match score with a short reason.</li>
          <li><strong>Save:</strong> The listings and scores are stored in Airtable for review.</li>
        </ol>
      </CaseSection>
      <CaseSection title="Designing for real-world issues">
        <ul>
          <li>Added a filtering fallback when a job board’s search settings did not behave consistently.</li>
          <li>Used batched AI requests and retry handling to work around rate limits and model changes.</li>
          <li>Handled differing data formats and branch behavior so records continue through the workflow.</li>
        </ul>
      </CaseSection>
      <CaseSection title="Workflow">
        <figure style={{ margin: '20px 0' }}>
          <img
            src="/projects/job-listing-workflow.png"
            alt="n8n workflow showing the scheduled Remotive search, Airtable duplicate check, Gemini scoring, and Airtable save steps"
            loading="lazy"
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 14, border: '1px solid #d7d9d2' }}
          />
          <figcaption style={{ marginTop: 8, fontSize: 14, opacity: .75 }}>The n8n workflow from job search through scoring and storage.</figcaption>
        </figure>
      </CaseSection>
      <CaseSection title="Airtable tracker">
        <figure style={{ margin: '20px 0' }}>
          <img
            src="/projects/job-listing-airtable.png"
            alt="Airtable job listings table with company, role, tags, posted date, match score, and match reason"
            loading="lazy"
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 14, border: '1px solid #d7d9d2' }}
          />
          <figcaption style={{ marginTop: 8, fontSize: 14, opacity: .75 }}>The example Airtable view shows 38 saved records.</figcaption>
        </figure>
      </CaseSection>
      <CaseSection title="Tools">
        <p>n8n, Remotive, Google Gemini, Airtable, and REST APIs. The workflow is designed so another job or lead source can be added later.</p>
      </CaseSection>
    </StoryFrame>
  )
}

function ReceiptIQCaseStudy() {
  return (
    <StoryFrame
      title="ReceiptIQ — AI Expense & Receipt Tracker"
      subtitle="A mobile-friendly app that turns receipt photos into structured expense records, spending insights, and downloadable reports."
      link={{ href: 'https://aireceipt.lovable.app', label: 'Open the ReceiptIQ demo' }}
    >
      <CaseSection title="The challenge">
        <p>People can lose track of expenses when receipts pile up and details must be entered by hand. This makes it harder to review spending or prepare reports.</p>
      </CaseSection>
      <CaseSection title="What it does">
        <ul>
          <li>Reads key details from receipt photos so users have less to type.</li>
          <li>Organizes expenses and displays spending by category and date range.</li>
          <li>Creates PDF and CSV reports for download.</li>
          <li>Lets users review and correct extracted details.</li>
        </ul>
      </CaseSection>
      <CaseSection title="Tools">
        <p>React, TypeScript, Tailwind CSS, Lovable Cloud, and Google Gemini. The live demo uses sample data.</p>
      </CaseSection>
    </StoryFrame>
  )
}

function LegacyCaseStudy({ title, subtitle, details, tools }: {
  title: string
  subtitle: string
  details: string[]
  tools: string
}) {
  return (
    <StoryFrame title={title} subtitle={subtitle}>
      <CaseSection title="What the workflow does">
        <ul>{details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </CaseSection>
      <CaseSection title="Tools">
        <p>{tools}</p>
      </CaseSection>
    </StoryFrame>
  )
}

function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="pmodal" role="dialog" aria-modal="true" aria-label={project.title} onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage">{children}</div>
    </div>,
    document.body,
  )
}

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const phone = useIsPhone()
  const [category, setCategory] = useState<'all' | Project['category']>('all')
  const triggerRef = useRef<HTMLElement | null>(null)
  const projects = PROJECTS.filter((project) => category === 'all' || project.category === category)

  const show = useCallback((project: Project, element: HTMLElement) => {
    triggerRef.current = element
    setOpen(project)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <section className="pgrid pgrid--scroll" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">Practical systems for smoother work.</h1>
        <p className="pgrid__lede">Explore recent AI and automation work alongside earlier projects in operations, recruitment, and lead management.</p>
      </header>

      {phone && (
        <div className="pfilter" role="group" aria-label="Filter projects">
          {([
            { key: 'all', label: 'All' },
            { key: 'apps', label: 'Apps' },
            { key: 'automation', label: 'Automation' },
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              className="pfilter__btn"
              aria-pressed={category === item.key}
              onClick={() => setCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="home__glass pgrid__glass">
        <span className="pgrid__hint" aria-hidden="true"><CursorClick size={14} weight="duotone" />Select a project to read its case study</span>
        <div className="bento bento--projects">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="bento__card bento__card--btn bento__card--build"
              onClick={(event) => show(project, event.currentTarget)}
              aria-haspopup="dialog"
            >
              <span className="bento__build-plate">
                {project.thumbnail
                  ? <img src={project.thumbnail} alt="" loading="lazy" decoding="async" />
                  : <project.Icon size={22} />}
              </span>
              <span className="bento__build-text">
                <span className="bento__kicker">{project.tools.join(' · ')}</span>
                <span className="bento__build-title">{project.title}</span>
                <span className="bento__build-desc">{project.description}</span>
              </span>
              <span className="bento__build-arrow"><ArrowUpRight size={13} weight="bold" aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          {open.CaseStudy}
        </ProjectModal>
      )}
    </section>
  )
}
