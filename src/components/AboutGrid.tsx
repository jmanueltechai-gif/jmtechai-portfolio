import type { CSSProperties } from 'react'
import { Briefcase, Globe, Robot } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual. Swap the marks below for your own (any square SVG/PNG in public/).
 */

const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const MAKE = { src: 'https://cdn.simpleicons.org/make/6D00CC', name: 'Make' }
const AIRTABLE = { src: 'https://cdn.simpleicons.org/airtable/18BFFF', name: 'Airtable' }
const ASANA = { src: 'https://cdn.simpleicons.org/asana/F06A6A', name: 'Asana' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const META = { src: 'https://cdn.simpleicons.org/meta/0668E1', name: 'Meta' }
const LOVABLE = { src: 'https://cdn.simpleicons.org/lovable/FF4F00', name: 'Lovable' }

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  { index: '01', title: 'AI & business automation', marks: [N8N, MAKE, ZAPIER, LOVABLE] },
  { index: '02', title: 'Operations & workflow coordination', marks: [AIRTABLE, ASANA, MAKE] },
  { index: '03', title: 'Community management & marketing', marks: [META, AIRTABLE] },
  { index: '04', title: 'Team coordination & reporting', marks: [ASANA, ZAPIER, AIRTABLE] },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          My background spans operations leadership, recruitment, digital marketing, community management, and practical automation.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I bring operations experience and practical automation together.
            <span> My work also includes recruitment, digital marketing, and global student communities.</span>
          </p>

          <p className="agrid__note">
            In my latest five-month role (May–September 2026), I managed the business’s Facebook groups, shared marketing posts, and handled admin tasks. I researched student communities worldwide, kept lead information organized, engaged members, promoted TSL communities and housing initiatives, and worked with the Philippines-based marketing team. I also introduced AI tools and automations to improve team workflows.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, two cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark agrid__cell-mark--img">
                <Briefcase size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Facebook Community Manager & AI Automation Specialist</span>
                <span className="agrid__cell-meta">May–September 2026 · 5 months</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <Globe size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Global community work</span>
                <span className="agrid__cell-meta">Student groups across multiple cities</span>
              </span>
            </span>

            <span className="agrid__cell agrid__cell--wide">
              <span className="agrid__cell-mark agrid__cell-mark--plain">
                <Robot size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">AI & automation</span>
                <span className="agrid__cell-meta">n8n · Make · Airtable · Zapier</span>
              </span>
            </span>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src={profile.hero.portraitSrc}
            alt={profile.hero.portraitAlt}
            loading="eager"
            decoding="async"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  )
}
