import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowsOut, ArrowUpRight } from '@/components/slab'
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox'

type Highlight = {
  title: string
  label: string
  description: string
  image: string
  imageAlt: string
  href: string
  action: string
  external: boolean
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'ReceiptIQ',
    label: 'AI expense & receipt tracker',
    description: 'A mobile-friendly app that reads receipt details, organizes expenses, and creates downloadable reports.',
    image: '/projects/receiptiq-analytics.png',
    imageAlt: 'ReceiptIQ analytics page showing spending by category and daily spending',
    href: 'https://aireceipt.lovable.app',
    action: 'Open the live demo',
    external: true,
  },
  {
    title: 'Automated Job Listing Tracker',
    label: 'n8n workflow',
    description: 'A scheduled workflow that gathers job listings, checks for duplicates, scores new roles, and stores them in Airtable.',
    image: '/projects/job-listing-workflow.png',
    imageAlt: 'JM’s n8n job listing workflow',
    href: '/projects',
    action: 'Read the case study',
    external: false,
  },
]

const SHOWCASE_IMAGES: LightboxImage[] = HIGHLIGHTS.map((item) => ({
  src: item.image,
  alt: item.imageAlt,
  caption: item.title,
}))

export default function ShowcaseGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <section className="pgrid showcase-page" aria-labelledby="showcase-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Showcase</span>
        <h1 className="pgrid__title" id="showcase-title">Selected work, shown in context.</h1>
        <p className="pgrid__lede">
          Two recent builds, shown as they run. Click any screenshot to see the full view.
        </p>
      </header>

      <div className="home__glass showcase-page__glass">
        <div className="showcase-projects">
          {HIGHLIGHTS.map((item, index) => (
            <article className="showcase-project" key={item.title}>
              <button
                type="button"
                className="showcase-project__image-frame image-lightbox-trigger"
                aria-label={`Enlarge ${item.title} screenshot`}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget
                  setLightboxIndex(index)
                }}
              >
                <img className="showcase-project__image" src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
                <span className="image-lightbox__chip">
                  Click to enlarge <ArrowsOut size={15} weight="bold" aria-hidden="true" />
                </span>
              </button>
              <div className="showcase-project__copy">
                <span className="showcase-project__label">{item.label}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="showcase-project__link">
                    {item.action} <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
                  </a>
                ) : (
                  <Link to={item.href} className="showcase-project__link">
                    {item.action} <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <ImageLightbox
        images={SHOWCASE_IMAGES}
        open={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        triggerRef={triggerRef}
      />
    </section>
  )
}
