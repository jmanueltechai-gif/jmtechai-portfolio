/**
 * Full-page workflow-network backdrop.
 *
 * The SVG stays crisp at any screen size. CSS moves small signal packets along
 * the connectors and softly activates the nodes; the reduced-motion setting
 * leaves the network still.
 */
export default function HeroCanvasV2() {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <svg className="hero-network" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g className="hero-network__wires">
          <path d="M155 200 C220 200 300 220 365 220" />
          <path d="M455 220 C520 220 620 200 685 200" />
          <path d="M775 200 H1035" />
          <path d="M410 244 V456" />
          <path d="M455 480 H1035" />
          <path d="M1080 224 V456" />
        </g>
        <g className="hero-network__flow">
          <path d="M155 200 C220 200 300 220 365 220" />
          <path d="M455 220 C520 220 620 200 685 200" />
          <path d="M775 200 H1035" />
          <path d="M410 244 V456" />
          <path d="M455 480 H1035" />
          <path d="M1080 224 V456" />
        </g>
        <g className="hero-network__nodes">
          <g transform="translate(65 176)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
          <g transform="translate(365 196)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
          <g transform="translate(685 176)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
          <g transform="translate(1035 176)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
          <g transform="translate(365 456)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
          <g transform="translate(1035 456)"><rect width="90" height="48" rx="12"/><circle cx="18" cy="24" r="5"/><path d="M34 18h38M34 27h25"/></g>
        </g>
      </svg>
    </div>
  )
}
