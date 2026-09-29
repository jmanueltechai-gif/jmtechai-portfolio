import { useEffect, useRef } from 'react'
import { getTheme } from '@/lib/theme'
import * as THREE from 'three'

/**
 * Full-page animated contour background, v2.
 * Technique inspired by the landonorris.com background (by OFF+BRAND):
 *  - Two-layer simplex noise feedback (a slow large-scale layer warps the
 *    UV of the fast contour layer). This is the single biggest reason their
 *    blobs look "smooth" instead of drifting in a uniform current.
 *  - Cursor effect scaled by mouse VELOCITY (uMousePace), not just position.
 *    Quiet on hover, ripples on flick.
 *  - Aspect-corrected UVs so contours stay circular at any window ratio.
 *
 * Everything else (throttle, visibility pause, dark-section scroll mix,
 * touch/reduced-motion skip) is identical to HeroCanvas.tsx so this is a
 * drop-in replacement at the App.tsx import site.
 */


const vert = `
  varying vec2 vUv;
  void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`

const frag = `
  uniform float uDarkMix;
  void main(){
    vec3 bgLight = vec3(0.957, 0.957, 0.929);
    vec3 bgDark  = vec3(0.024, 0.047, 0.102);
    gl_FragColor = vec4(mix(bgLight, bgDark, uDarkMix), 1.0);
  }
`

export default function HeroCanvasV2() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch =
      'ontouchstart' in window ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      navigator.maxTouchPoints > 0
    if (reduced || isTouch) return

    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
    cam.position.z = 1

    // antialias off: this is a single fullscreen quad - the only "edges" are
    // the contour lines, which the shader already smooths with fwidth(), so
    // MSAA buys nothing and just costs a multisample buffer.
    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    // Render ABOVE 1:1 so higher-DPI displays get crisp contour lines. The
    // 0.5 default looked pixelated; 1.0 fixed the cream theme. 1.5 was tried
    // for crisper hairlines on scaled displays and it DID cost scroll
    // smoothness on weak machines: a HiDPI laptop was shading 2.25x the
    // fragments of a 1:1 render, every frame, under a viewport-sized
    // backdrop-filter. Stepped back to 1.0 per the note below. If crispness
    // on retina ever needs revisiting, gate it on lib/perf.ts's tier, do not
    // raise this constant for everyone. The shader still animates
    // continuously and must NEVER pause/freeze during scroll - if this ever
    // costs scroll smoothness on a weak machine, step it DOWN, do not raise it.
    const RENDER_SCALE = 1.0
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER_SCALE))
    el.appendChild(renderer.domElement)

    const mouse = new THREE.Vector2(0, 0)
    // The page is dark or light, never both, and it never inverts on scroll.
    // uDarkMix is a theme reading now: 1 in dark, 0 in light, eased only when
    // the visitor actually flips the switch.
    const darkMix = { value: getTheme() === 'dark' ? 1 : 0 }
    let targetDark = darkMix.value
    renderer.setClearColor(darkMix.value ? 0x070b14 : 0xf4f4ed, 1)

    const onThemeChange = () => {
      const dark = getTheme() === 'dark'
      targetDark = dark ? 1 : 0
      renderer.setClearColor(dark ? 0x070b14 : 0xf4f4ed, 1)
    }
    window.addEventListener('themechange', onThemeChange)

    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      // fwidth() is part of GLSL ES 3.0 / WebGL2 (Three.js' default since
      // r150), no extension hint needed. The OES_standard_derivatives key
      // was removed from the ShaderMaterial type in Three.js 0.180+.
      uniforms: {
        uTime:      { value: 0 },
        uMouse:     { value: mouse },
        uMousePace: { value: 0 },
        uAspect:    { value: window.innerWidth / window.innerHeight },
        uDarkMix:   darkMix,
      },
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    let tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      tgt.x = (e.clientX / window.innerWidth) * 2 - 1
      tgt.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      mat.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let visible = document.visibilityState !== 'hidden'
    const onVisibility = () => {
      const next = document.visibilityState !== 'hidden'
      if (next && !visible) {
        visible = true
        raf = requestAnimationFrame(loop)
      } else {
        visible = next
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    let raf: number
    let time = 0
    let lastTs = performance.now()
    // Throttle the shader to ~30fps. The contour only drifts at 0.09/sec, so
    // 30fps is visually identical to 60 but halves the GPU/main-thread cost,
    // leaving headroom for smooth scrolling. Delta-time keeps the pace correct.
    const FRAME_INTERVAL = 1000 / 30

    // Delta-time animation. Speeds are expressed PER SECOND, so the visual
    // pace stays the same on a 60Hz, 120Hz, or 144Hz display. The previous
    // version ran at a hard 20fps cap which felt laggy compared to Lando's
    // uncapped 60fps. The shader is cheap (~one fullscreen plane, two
    // simplex samples) so there is no need to throttle on desktop.
    const DRIFT_PER_SECOND  = 0.09  // shader uTime advance per second (lower = slower, calmer drift)
    const FOLLOW_PER_SECOND = 4.0   // cursor lerp rate (higher = snappier)
    const PACE_PER_SECOND   = 8.0   // velocity smoothing rate
    const DARK_PER_SECOND   = 7.0   // light/dark theme blend rate

    let lastCurX = 0, lastCurY = 0
    let pace = 0

    function loop(now: number = performance.now()) {
      if (!visible) return
      raf = requestAnimationFrame(loop)

      // 30fps throttle: bail out of frames that arrive too soon.
      if (now - lastTs < FRAME_INTERVAL - 1) return

      // dt clamped so a tab returning from backgroound doesn't produce a
      // huge jump (rAF can pause when the tab is hidden).
      const dt = Math.min(0.05, (now - lastTs) / 1000)
      lastTs = now

      time += DRIFT_PER_SECOND * dt

      const followK = 1 - Math.exp(-FOLLOW_PER_SECOND * dt)
      cur.x += (tgt.x - cur.x) * followK
      cur.y += (tgt.y - cur.y) * followK
      mouse.set(cur.x, cur.y)

      // Velocity in normalized-units / second, smoothed.
      const dx = (cur.x - lastCurX) / Math.max(dt, 0.001)
      const dy = (cur.y - lastCurY) / Math.max(dt, 0.001)
      const velRaw = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 0.4)
      const paceK = 1 - Math.exp(-PACE_PER_SECOND * dt)
      pace += (velRaw - pace) * paceK
      lastCurX = cur.x; lastCurY = cur.y

      const darkK = 1 - Math.exp(-DARK_PER_SECOND * dt)
      darkMix.value += (targetDark - darkMix.value) * darkK

      mat.uniforms.uTime.value      = time
      mat.uniforms.uMousePace.value = pace
      renderer.render(scene, cam)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('themechange', onThemeChange)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      geo.dispose()
      mat.dispose()
    }
  }, [])

  return (
    <div ref={ref} className="hero-canvas" aria-hidden="true">
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
