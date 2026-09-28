import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  Robot,
  Medal,
  Stack,
  FunnelSimple,
  Gear,
  AddressBook,
  Globe,
  AppWindow,
  SealCheck,
} from '@/components/slab'
import { aiStack, type StackNode } from '@/data/ai-stack'
import { profile } from '@/data/profile'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds, each built from content the portfolio already ships. Every card is
 * a link. Nothing here invents a fact - the funnels, the tools, the clients
 * and the credentials are the same records the views render in full.
 *
 * Motion is transform-only on a clipped inner track, so a card never adds
 * height and Home stays a single viewport.
 */

const PROJECT_SHOTS = [
  '/projects/job-listing-workflow.png',
  '/projects/receiptiq-preview.svg',
]
const OFFERS = [
  { Icon: FunnelSimple, title: 'AI & business automation', note: 'Practical workflows that save time and keep work organized.' },
  { Icon: Gear, title: 'Operations management', note: 'Practical support shaped around your team’s goals.' },
  { Icon: AddressBook, title: 'Team leadership & recruitment', note: 'Practical support shaped around your team’s goals.' },
  { Icon: Globe, title: 'Digital marketing', note: 'Practical support shaped around your team’s goals.' },
  { Icon: AppWindow, title: 'Process improvement', note: 'Practical support shaped around your team’s goals.' },
] as const

type ClientCard = { name: string; role: string; work: string }

const CLIENTS: ClientCard[] = [
  { name: 'ReceiptIQ', role: 'AI receipt and expense app', work: 'Receipt capture · Reports' },
  { name: 'Job Listing Tracker', role: 'Automated job discovery', work: 'n8n · Airtable · Gemini' },
  { name: 'Lead Enrichment Pipeline', role: 'Lead scoring and routing', work: 'Zapier · Apollo.io · Sheets' },
  { name: 'Financial Reconciliation', role: 'Transaction-to-accounting workflow', work: 'Make · Asana · Xero' },
  { name: 'Healthcare Hiring Pipeline', role: 'Candidate journey automation', work: 'Make · Forms · Sheets' },
  { name: 'CRM Lead Engagement', role: 'Lead follow-up and pipeline updates', work: 'Zapier · Asana · Gmail' },
  { name: 'Lead Qualification & Booking', role: 'Consultation routing and scheduling', work: 'GoHighLevel · Calendar' },
  { name: 'Lead Nurture Sequence', role: 'New-contact follow-up workflow', work: 'GoHighLevel · Email · SMS' },
]


function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const half = Math.ceil(AI_BUILDS.length / 2)
  const toolRows = [AI_BUILDS.slice(0, half), AI_BUILDS.slice(half)]

  return (
    <nav className="bento" aria-label="Explore the portfolio">
      {/* Projects: the funnel thumbnails drift upward on a looped track. */}
      <Link to="/projects" className="bento__card bento__card--projects">
        <CardHead Icon={FolderOpen} title="Projects" desc="Recent work in automation, operations, and AI-powered tools." />
        <div className="bento__media bento__reel" aria-hidden="true">
          <div className="bento__reel-track">
            {[...PROJECT_SHOTS, ...PROJECT_SHOTS].map((f, i) => (
              <span key={i} className="bento__shot">
                <img src={f} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* About: a fanned stack of photos. */}
      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About" desc="Operations leader building practical business automations." />
        <div className="bento__media bento__fan" aria-hidden="true">
          <span className="bento__photo">
            <img src={profile.avatarSrc} alt="" loading="lazy" decoding="async" />
          </span>
        </div>
      </Link>

      {/* AI builds: the systems from the Projects tree, two chip rows
          scrolling against each other. */}
      <Link to="/projects" className="bento__card bento__card--ai">
        <CardHead Icon={Robot} title="AI Builds" desc="Projects designed to reduce repetitive work and make information easier to use." />
        <div className="bento__media bento__chips" aria-hidden="true">
          {toolRows.map((row, r) => (
            <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
              <div className="bento__chip-track">
                {[...row, ...row].map((n, i) => (
                  <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status}>
                    <n.Icon size={15} weight="duotone" />
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* Credentials: the badge that matters, on its plate. */}
      <Link to="/about" className="bento__card bento__card--creds">
        <CardHead Icon={Medal} title="Experience" desc="Operations, recruitment, and digital marketing experience." />
        <div className="bento__media bento__badge" aria-hidden="true">
          <span className="bento__badge-ring">
            <Medal size={42} weight="duotone" aria-hidden="true" />
          </span>
          <span className="bento__badge-tag">
            <SealCheck size={14} weight="fill" />
            Operations · Community · Automation
          </span>
        </div>
      </Link>

      {/* Services: the five offers as a compact index. */}
      <Link to="/services" className="bento__card bento__card--services">
        <CardHead Icon={Stack} title="Services" desc="Automation, operations, recruitment, marketing, and process improvement." />
        <ul className="bento__media bento__offers" role="list">
          {OFFERS.map(({ Icon, title, note }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">{note}</span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">
                0{i + 1}
              </span>
            </li>
          ))}
        </ul>
      </Link>

      {/* Testimonials: client cards drifting up a clipped column. */}
      <Link to="/projects" className="bento__card bento__card--quotes">
        <CardHead Icon={FolderOpen} title="Recent work" desc="Selected projects in AI, automation, and operations." />
        <div className="bento__media bento__reviews" aria-hidden="true">
          <div className="bento__reviews-track">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="bento__review">
                <span className="bento__review-top">
                  <FolderOpen size={14} weight="duotone" />
                  <b>{c.name}</b>
                </span>
                <span className="bento__review-role">{c.role}</span>
                <span className="bento__review-work">{c.work}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </nav>
  )
}
