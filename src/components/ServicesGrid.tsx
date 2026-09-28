import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: your three-step method (on a dark plate so it
 * is the first thing the eye lands on), the five services as cards that carry
 * the marks of what each one is built with, and an animated illustration of the actual workflow
 * scaled to fit the page. Same object language as Home and
 * Projects: the glass, the bento card, plated marks, orange for the index
 * and the accent.
 *
 * Service descriptions reflect JM’s operations, marketing, leadership, and automation experience.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Understand',
    body: 'Get clear on the team’s goals and current process.',
    Icon: MagnetStraight,
    chips: ['Current workflow', 'Team needs', 'Desired outcome', 'Constraints'],
  },
  {
    index: '02',
    label: 'Improve',
    body: 'Remove friction before adding new tools.',
    Icon: Timer,
    chips: ['Simplify handoffs', 'Clarify ownership', 'Reduce repeat work', 'Track progress'],
  },
  {
    index: '03',
    label: 'Automate',
    body: 'Connect repeatable steps and keep a person in control.',
    Icon: Trophy,
    chips: ['Choose the right tool', 'Connect key steps', 'Add checks', 'Review results'],
  },

]

/* ---------- The services ---------- */

// Brand marks for the tools JM uses in these services.
const N8N = '/icons/ai/n8n.svg'
const MAKE = 'https://cdn.simpleicons.org/make/6D00CC'
const AIRTABLE = 'https://cdn.simpleicons.org/airtable/18BFFF'
const ASANA = 'https://cdn.simpleicons.org/asana/F06A6A'
const LOVABLE = 'https://cdn.simpleicons.org/lovable/FF4F00'
const ZAPIER = '/icons/ai/zapier.svg'
const META = 'https://cdn.simpleicons.org/meta/0668E1'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'AI & business automation',
    description: 'Connect repeatable tasks so work moves forward with fewer manual steps.',
    chip: 'Workflow design',
    logos: [N8N, MAKE, ZAPIER, AIRTABLE],
    bullets: ['Automate routine tasks', 'Route information clearly', 'Add review and follow-up steps'],
  },
  {
    index: '02',
    title: 'Operations management',
    description: 'Keep daily responsibilities, client handoffs, and team processes organized.',
    chip: 'Operational support',
    logos: [AIRTABLE, ASANA, MAKE],
    bullets: ['Coordinate daily workflows', 'Document clear ownership', 'Track tasks and progress'],
  },
  {
    index: '03',
    title: 'Team leadership & recruitment',
    description: 'Support hiring, onboarding, and communication across distributed teams.',
    chip: 'People & hiring',
    logos: [ASANA, AIRTABLE, META],
    bullets: ['Organize candidate stages', 'Support team onboarding', 'Keep communication moving'],
  },
  {
    index: '04',
    title: 'Digital marketing & communities',
    description: 'Build engagement through relevant posts, group activity, and lead follow-up.',
    chip: 'Community growth',
    logos: [META, ZAPIER, AIRTABLE],
    bullets: ['Plan useful marketing posts', 'Monitor community activity', 'Identify audience opportunities'],
  },
  {
    index: '05',
    title: 'Process improvement & reporting',
    description: 'Make work easier to follow and give teams a clearer view of progress.',
    chip: 'Clearer processes',
    logos: [ASANA, AIRTABLE, MAKE, LOVABLE],
    bullets: ['Find process bottlenecks', 'Improve information tracking', 'Share useful progress insights'],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          Make everyday work run more smoothly.
        </h1>
        <p className="pgrid__lede">
          I combine operations experience with practical automation, team support, and digital marketing.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the three stages wired
            in order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">Your Method</span>
            <h2 className="sgrid__method-title" id="method-title">
              Understand. Improve. Automate.
              <br />
              <span>A practical path to better workflows.</span>
            </h2>
            <p className="sgrid__method-sub">
              Start with the real day-to-day problem, then choose a solution that fits.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Five cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">Ways I can contribute.</h2>
            <p className="sgrid__offers-sub">Support shaped around the work and the team.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 05</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
              <h2 className="sgrid__flow-title">Job Listing Tracker</h2>
              <p className="sgrid__flow-sub">
                A six-hour workflow gathers Remotive listings, checks Airtable for duplicates, scores new jobs with Gemini, and saves them for review.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <figure className="sgrid__workflow-figure">
              <img
                src="/projects/job-listing-workflow.png"
                alt="The n8n Job Listing Tracker workflow, from the scheduled Remotive search through Airtable duplicate checks, Gemini scoring, and saving new listings."
                loading="lazy"
                decoding="async"
              />
              <figcaption>The actual n8n workflow used for the Job Listing Tracker.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
