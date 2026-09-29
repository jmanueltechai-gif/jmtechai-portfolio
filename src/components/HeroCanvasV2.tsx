import { useEffect, useRef } from 'react'

type Layer = 'back' | 'mid' | 'front'
type NodeType = 'tool' | 'data'
type ToolIcon = 'n8n' | 'make' | 'airtable' | 'zapier' | 'gemini'

type CanvasNode = {
  id: number
  layer: Layer
  type: NodeType
  toolIcon?: ToolIcon
  x: number
  y: number
  radius: number
  phase: number
  period: number
  driftPhaseX: number
  driftPhaseY: number
  offsetX: number
  offsetY: number
  velocityX: number
  velocityY: number
  highlight: number
  cursorX: number
  cursorY: number
  flashUntil: number
}

type Packet = {
  startAt: number
  duration: number
  flashed: Set<number>
  mergeGroup: boolean
}

type Chain = {
  nodes: CanvasNode[]
  packet: Packet | null
  nextAt: number
}

type Curve = {
  from: CanvasNode
  to: CanvasNode
  p0: { x: number; y: number }
  p1: { x: number; y: number }
  p2: { x: number; y: number }
  p3: { x: number; y: number }
}

type Route = {
  curves: Curve[]
  samples: { x: number; y: number; distance: number }[]
  markers: number[]
  length: number
}

type Palette = {
  navy: string
  muted: string
  orange: string
  paper: string
}

type Scene = {
  nodes: CanvasNode[]
  chains: Chain[]
  mergeNode: CanvasNode | null
  mobile: boolean
}

const MIN_SPACING = 140
const ICON_SOURCES: Record<Exclude<ToolIcon, 'gemini'>, string> = {
  n8n: '/icons/ai/n8n.svg',
  make: 'https://cdn.simpleicons.org/make/6D00CC',
  airtable: 'https://cdn.simpleicons.org/airtable/18BFFF',
  zapier: '/icons/ai/zapier.svg',
}
const LAYER_OPACITY: Record<Layer, number> = {
  back: 0.15,
  mid: 0.26,
  front: 0.4,
}

function randomSource(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function makeNode(
  id: number,
  layer: Layer,
  type: NodeType,
  x: number,
  y: number,
  random: () => number,
  toolIcon?: ToolIcon,
): CanvasNode {
  return {
    id,
    layer,
    type,
    toolIcon,
    x,
    y,
    radius: layer === 'back' ? 7 : layer === 'mid' ? 6 : 5,
    phase: random() * Math.PI * 2,
    period: 4 + random() * 2,
    driftPhaseX: random() * Math.PI * 2,
    driftPhaseY: random() * Math.PI * 2,
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    velocityY: 0,
    highlight: 0,
    cursorX: 0,
    cursorY: 0,
    flashUntil: 0,
  }
}

function nodeSize(node: CanvasNode) {
  return node.type === 'tool'
    ? { width: 52, height: 32 }
    : { width: node.radius * 2, height: node.radius * 2 }
}

function intersectsHeadlineZone(node: CanvasNode, x: number, y: number, width: number) {
  const size = nodeSize(node)
  const left = x - size.width / 2
  const right = x + size.width / 2
  const top = y - size.height / 2
  const bottom = y + size.height / 2
  return left < width * 0.6 && right > 0 && top < 240 && bottom > 0
}

function tooClose(nodes: CanvasNode[], x: number, y: number) {
  return nodes.some((node) => Math.hypot(node.x - x, node.y - y) < MIN_SPACING)
}

function addAmbientNodes(
  nodes: CanvasNode[],
  specs: { layer: Layer; type: NodeType; icon?: ToolIcon }[],
  width: number,
  height: number,
  random: () => number,
  nextId: () => number,
) {
  for (const spec of specs) {
    let point: { x: number; y: number } | null = null
    for (let attempt = 0; attempt < 12000; attempt++) {
      const x = 30 + random() * Math.max(1, width - 60)
      const y = 28 + random() * Math.max(1, height - 56)
      const candidate = makeNode(nextId(), spec.layer, spec.type, x, y, random, spec.icon)
      if (intersectsHeadlineZone(candidate, x, y, width) || tooClose(nodes, x, y)) continue
      point = { x, y }
      break
    }
    if (point) nodes.push(makeNode(nextId(), spec.layer, spec.type, point.x, point.y, random, spec.icon))
  }
}

function createDesktopScene(width: number, height: number, elapsed: number): Scene {
  const random = randomSource((Math.floor(width) * 73856093) ^ (Math.floor(height) * 19349663))
  let id = 0
  const nextId = () => id++
  const nodes: CanvasNode[] = []
  const x = [width * 0.11, width * 0.36, width * 0.62, width * 0.88]
  const firstLane = Math.max(268, height * 0.35)
  const lastLane = Math.min(height - 24, Math.max(firstLane + 280, height * 0.85))
  const lanes = [firstLane, firstLane + (lastLane - firstLane) / 2, lastLane]

  const starts = lanes.map((y) => makeNode(nextId(), 'mid', 'data', x[0], y, random))
  const firstTools = lanes.map((y, index) =>
    makeNode(nextId(), 'mid', 'tool', x[1], y, random, (['n8n', 'make', 'airtable'] as ToolIcon[])[index]),
  )
  const secondTools = lanes.map((y, index) =>
    makeNode(nextId(), 'front', 'tool', x[2], y, random, (['zapier', 'gemini', 'n8n'] as ToolIcon[])[index]),
  )
  const merge = makeNode(nextId(), 'mid', 'data', x[3], lanes[1], random)
  nodes.push(...starts, ...firstTools, ...secondTools, merge)

  const chains: Chain[] = lanes.map((_, index) => ({
    nodes: [starts[index], firstTools[index], secondTools[index], merge],
    packet: null,
    nextAt: elapsed + 0.55 + index * 0.82 + random() * 0.2,
  }))

  addAmbientNodes(
    nodes,
    [
      { layer: 'back', type: 'tool', icon: 'airtable' },
      { layer: 'back', type: 'data' },
      { layer: 'back', type: 'data' },
      { layer: 'back', type: 'data' },
      { layer: 'back', type: 'data' },
      { layer: 'back', type: 'data' },
      { layer: 'mid', type: 'tool', icon: 'make' },
      { layer: 'mid', type: 'data' },
      { layer: 'front', type: 'data' },
    ],
    width,
    height,
    random,
    nextId,
  )
  return { nodes, chains, mergeNode: merge, mobile: false }
}

function createMobileScene(width: number, height: number, elapsed: number): Scene {
  const random = randomSource((Math.floor(width) * 2654435761) ^ (Math.floor(height) * 2246822519))
  let id = 0
  const nextId = () => id++
  const bottom = height - 36
  const laneGap = Math.min(150, Math.max(100, (height - 180) / 3))
  const startY = Math.max(160, bottom - laneGap * 3)
  const toolOneY = startY + laneGap
  const toolTwoY = startY + laneGap * 2
  const endY = startY + laneGap * 3
  const start = makeNode(nextId(), 'mid', 'data', width * 0.82, startY, random)
  const toolOne = makeNode(nextId(), 'mid', 'tool', width * 0.82, toolOneY, random, 'n8n')
  const toolTwo = makeNode(nextId(), 'mid', 'tool', width * 0.24, toolTwoY, random, 'zapier')
  const end = makeNode(nextId(), 'mid', 'data', width * 0.82, endY, random)
  const fillerY = Math.max(260, Math.min(toolTwoY - MIN_SPACING, height * 0.42))
  const filler = makeNode(nextId(), 'mid', 'data', width * 0.1, fillerY, random)
  const chain: Chain = {
    nodes: [start, toolOne, toolTwo, end],
    packet: null,
    nextAt: elapsed + 0.7,
  }
  return { nodes: [start, toolOne, toolTwo, end, filler], chains: [chain], mergeNode: null, mobile: true }
}

function positionOf(node: CanvasNode, elapsed: number) {
  const driftX = node.layer === 'back' ? Math.sin(elapsed * 0.04 + node.driftPhaseX) * 6 : 0
  const driftY = node.layer === 'back' ? Math.cos(elapsed * 0.04 + node.driftPhaseY) * 6 : 0
  return { x: node.x + driftX + node.offsetX, y: node.y + driftY + node.offsetY }
}

function cubicPoint(curve: Curve, t: number) {
  const inverse = 1 - t
  const a = inverse * inverse * inverse
  const b = 3 * inverse * inverse * t
  const c = 3 * inverse * t * t
  const d = t * t * t
  return {
    x: a * curve.p0.x + b * curve.p1.x + c * curve.p2.x + d * curve.p3.x,
    y: a * curve.p0.y + b * curve.p1.y + c * curve.p2.y + d * curve.p3.y,
  }
}

function createCurve(from: CanvasNode, to: CanvasNode, elapsed: number, chainIndex: number, edgeIndex: number): Curve {
  const p0 = positionOf(from, elapsed)
  const p3 = positionOf(to, elapsed)
  const dx = p3.x - p0.x
  const dy = p3.y - p0.y
  const length = Math.max(1, Math.hypot(dx, dy))
  const bend = Math.min(64, Math.max(34, length * 0.18))
  const side = (chainIndex + edgeIndex) % 2 === 0 ? 1 : -1
  const normalX = -dy / length
  const normalY = dx / length
  return {
    from,
    to,
    p0,
    p1: { x: p0.x + dx * 0.32 + normalX * bend * side, y: p0.y + dy * 0.32 + normalY * bend * side },
    p2: { x: p0.x + dx * 0.68 + normalX * bend * side, y: p0.y + dy * 0.68 + normalY * bend * side },
    p3,
  }
}

function buildRoute(chain: Chain, elapsed: number, chainIndex: number): Route {
  const curves: Curve[] = []
  const samples: { x: number; y: number; distance: number }[] = []
  const markers: number[] = [0]
  let distance = 0
  let previous: { x: number; y: number } | null = null

  for (let edge = 0; edge < chain.nodes.length - 1; edge++) {
    const curve = createCurve(chain.nodes[edge], chain.nodes[edge + 1], elapsed, chainIndex, edge)
    curves.push(curve)
    for (let step = edge === 0 ? 0 : 1; step <= 28; step++) {
      const point = cubicPoint(curve, step / 28)
      if (previous) distance += Math.hypot(point.x - previous.x, point.y - previous.y)
      samples.push({ ...point, distance })
      previous = point
    }
    markers.push(distance)
  }

  return { curves, samples, markers, length: Math.max(1, distance) }
}

function pointOnRoute(route: Route, progress: number) {
  const target = route.length * clamp(progress, 0, 1)
  for (let index = 1; index < route.samples.length; index++) {
    const before = route.samples[index - 1]
    const after = route.samples[index]
    if (after.distance < target) continue
    const span = Math.max(0.001, after.distance - before.distance)
    const part = clamp((target - before.distance) / span, 0, 1)
    return { x: before.x + (after.x - before.x) * part, y: before.y + (after.y - before.y) * part }
  }
  const last = route.samples[route.samples.length - 1]
  return { x: last.x, y: last.y }
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -7)
  ctx.lineTo(0, 7)
  ctx.moveTo(-7, 0)
  ctx.lineTo(7, 0)
  ctx.moveTo(-4.5, -4.5)
  ctx.lineTo(4.5, 4.5)
  ctx.moveTo(4.5, -4.5)
  ctx.lineTo(-4.5, 4.5)
  ctx.stroke()
  ctx.restore()
}

export default function HeroCanvasV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    let width = window.innerWidth
    let height = window.innerHeight
    let pixelRatio = 1
    let elapsed = 0
    let previousTime = 0
    let animationFrame = 0
    let resizeTimer = 0
    let running = false
    let disposed = false
    let pointer: { x: number; y: number } | null = null
    let theme: Palette = { navy: '', muted: '', orange: '', paper: '' }
    let scene: Scene = { nodes: [], chains: [], mergeNode: null, mobile: false }
    let totalPackets = 0
    let mergeAfter = 4 + Math.floor(Math.random() * 3)
    let mergePending = false
    let mergeActive = false
    let mergeRemaining = 0
    let lastLaunch = -10

    const random = Math.random
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchDevice =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.navigator.maxTouchPoints > 0
    let cursorEnabled = width >= 768 && !touchDevice

    const readPalette = () => {
      theme = {
        navy: token('--navy'),
        muted: token('--muted'),
        orange: token('--orange'),
        paper: token('--paper') || token('--cream'),
      }
    }

    const iconImages = new Map<ToolIcon, HTMLImageElement>()
    const imagePromises: Promise<void>[] = []
    for (const key of Object.keys(ICON_SOURCES) as Exclude<ToolIcon, 'gemini'>[]) {
      const image = new Image()
      image.src = ICON_SOURCES[key]
      iconImages.set(key, image)
      imagePromises.push(new Promise((resolve) => {
        if (image.complete) resolve()
        else {
          image.onload = () => resolve()
          image.onerror = () => resolve()
        }
      }))
    }

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const rebuildScene = () => {
      scene = width < 768
        ? createMobileScene(width, height, elapsed)
        : createDesktopScene(width, height, elapsed)
      totalPackets = 0
      mergeAfter = 4 + Math.floor(random() * 3)
      mergePending = false
      mergeActive = false
      mergeRemaining = 0
      lastLaunch = elapsed - 10
    }

    const isExcludedAt = (node: CanvasNode, x: number, y: number) =>
      intersectsHeadlineZone(node, x, y, width)

    const updateCursor = (dt: number) => {
      if (!cursorEnabled) return
      const candidates: { node: CanvasNode; distance: number; dx: number; dy: number }[] = []
      if (pointer) {
        for (const node of scene.nodes) {
          if (node.layer === 'back') continue
          const point = positionOf(node, elapsed)
          const dx = pointer.x - point.x
          const dy = pointer.y - point.y
          const distance = Math.hypot(dx, dy)
          if (distance <= 180) candidates.push({ node, distance, dx, dy })
        }
        candidates.sort((a, b) => a.distance - b.distance)
      }

      for (const node of scene.nodes) {
        if (node.layer === 'back') continue
        const candidateIndex = candidates.findIndex((item) => item.node === node)
        const nearby = candidateIndex >= 0 && candidateIndex < 2
        const targetHighlight = nearby ? 1 : 0
        const fadeStep = dt / 0.2
        node.highlight = targetHighlight
          ? Math.min(1, node.highlight + fadeStep)
          : Math.max(0, node.highlight - fadeStep)

        let targetX = 0
        let targetY = 0
        if (nearby && pointer) {
          const item = candidates.find((candidate) => candidate.node === node)
          if (item && item.distance > 0) {
            const amount = Math.min(10, 10 * (1 - item.distance / 180))
            targetX = (item.dx / item.distance) * amount
            targetY = (item.dy / item.distance) * amount
          }
          node.cursorX = pointer.x
          node.cursorY = pointer.y
        }

        node.velocityX += (targetX - node.offsetX) * 78 * dt
        node.velocityY += (targetY - node.offsetY) * 78 * dt
        const damping = Math.exp(-14 * dt)
        node.velocityX *= damping
        node.velocityY *= damping
        node.offsetX += node.velocityX * dt
        node.offsetY += node.velocityY * dt

        const point = positionOf(node, elapsed)
        if (isExcludedAt(node, point.x, point.y)) {
          node.offsetX = 0
          node.offsetY = 0
          node.velocityX = 0
          node.velocityY = 0
        }
      }
    }

    const buildRoutes = () => scene.chains.map((chain, index) => buildRoute(chain, elapsed, index))

    const drawConnections = (routes: Route[]) => {
      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.strokeStyle = theme.muted
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.setLineDash([2, 4])
      for (const route of routes) {
        ctx.beginPath()
        for (const curve of route.curves) {
          ctx.moveTo(curve.p0.x, curve.p0.y)
          ctx.bezierCurveTo(curve.p1.x, curve.p1.y, curve.p2.x, curve.p2.y, curve.p3.x, curve.p3.y)
        }
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawCursorLinks = () => {
      if (!cursorEnabled) return
      for (const node of scene.nodes) {
        if (node.layer === 'back' || node.highlight <= 0.005) continue
        const point = positionOf(node, elapsed)
        ctx.save()
        ctx.globalAlpha = 0.3 * node.highlight
        ctx.strokeStyle = theme.orange
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(node.cursorX, node.cursorY)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
        ctx.restore()
      }
    }

    const drawTool = (node: CanvasNode, elapsedNow: number) => {
      const point = positionOf(node, elapsed)
      const breathing = 1 + (Math.sin((elapsedNow / node.period) * Math.PI * 2 + node.phase) + 1) * 0.02
      const flashing = elapsedNow < node.flashUntil
      const scale = flashing ? 1.12 : breathing
      const opacity = Math.min(1, LAYER_OPACITY[node.layer] + 0.15 * node.highlight)

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(point.x, point.y)
      ctx.scale(scale, scale)
      ctx.fillStyle = theme.paper
      ctx.strokeStyle = flashing ? theme.orange : theme.navy
      ctx.lineWidth = 1
      roundedRect(ctx, -26, -16, 52, 32, 8)
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(-12, 0, 10, 0, Math.PI * 2)
      ctx.fillStyle = theme.paper
      ctx.fill()
      ctx.strokeStyle = theme.navy
      ctx.lineWidth = 1
      ctx.stroke()

      if (node.toolIcon === 'gemini') {
        drawSparkle(ctx, -12, 0, theme.orange)
      } else if (node.toolIcon) {
        const image = iconImages.get(node.toolIcon)
        if (image?.complete && image.naturalWidth > 0) ctx.drawImage(image, -20, -8, 16, 16)
        else drawSparkle(ctx, -12, 0, theme.muted)
      }

      ctx.strokeStyle = theme.muted
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(4, -5)
      ctx.lineTo(19, -5)
      ctx.moveTo(4, 5)
      ctx.lineTo(16, 5)
      ctx.stroke()
      ctx.restore()
    }

    const drawData = (node: CanvasNode, elapsedNow: number) => {
      const point = positionOf(node, elapsed)
      const breathing = 1 + (Math.sin((elapsedNow / node.period) * Math.PI * 2 + node.phase) + 1) * 0.02
      const flashing = elapsedNow < node.flashUntil
      const scale = flashing ? 1.12 : breathing
      const opacity = Math.min(1, LAYER_OPACITY[node.layer] + 0.15 * node.highlight)
      const radius = node.radius

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(point.x, point.y)
      ctx.scale(scale, scale)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
      gradient.addColorStop(0, theme.paper)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.strokeStyle = flashing ? theme.orange : theme.navy
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    const drawNodes = (layer: Layer, elapsedNow: number) => {
      ctx.save()
      if (layer === 'back') ctx.filter = 'blur(2.5px)'
      for (const node of scene.nodes) {
        if (node.layer !== layer) continue
        if (node.type === 'tool') drawTool(node, elapsedNow)
        else drawData(node, elapsedNow)
      }
      ctx.restore()
    }

    const drawPackets = (routes: Route[], elapsedNow: number) => {
      for (let index = 0; index < scene.chains.length; index++) {
        const chain = scene.chains[index]
        const packet = chain.packet
        if (!packet) continue
        const raw = clamp((elapsedNow - packet.startAt) / packet.duration, 0, 1)
        const progress = easeInOutCubic(raw)
        const route = routes[index]

        for (let nodeIndex = 1; nodeIndex < chain.nodes.length - 1; nodeIndex++) {
          const node = chain.nodes[nodeIndex]
          if (progress >= route.markers[nodeIndex] / route.length && !packet.flashed.has(node.id)) {
            node.flashUntil = elapsedNow + 0.3
            packet.flashed.add(node.id)
          }
        }

        const point = pointOnRoute(route, progress)
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 8)
        glow.addColorStop(0, theme.orange)
        glow.addColorStop(1, 'transparent')
        ctx.save()
        ctx.globalAlpha = 0.48
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowColor = theme.orange
        ctx.shadowBlur = 7
        ctx.globalAlpha = 0.9
        ctx.fillStyle = theme.orange
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (raw >= 1) {
          chain.packet = null
          chain.nextAt = elapsedNow + 1.5 + random() * 1.5
          if (packet.mergeGroup) {
            mergeRemaining -= 1
            if (mergeRemaining === 0) {
              if (scene.mergeNode) scene.mergeNode.flashUntil = elapsedNow + 0.45
              mergeActive = false
            }
          } else if (scene.mergeNode) {
            scene.mergeNode.flashUntil = elapsedNow + 0.3
          }
        }
      }
    }

    const scheduleMerge = (now: number) => {
      if (!scene.mergeNode || scene.chains.length < 2) return
      const firstIndex = Math.floor(random() * scene.chains.length)
      let secondIndex = Math.floor(random() * (scene.chains.length - 1))
      if (secondIndex >= firstIndex) secondIndex += 1
      const firstDuration = 1.8 + random() * 0.6
      const secondDuration = 1.8 + random() * 0.6
      const arrival = now + Math.max(firstDuration, secondDuration)
      const first = scene.chains[firstIndex]
      const second = scene.chains[secondIndex]
      first.packet = { startAt: arrival - firstDuration, duration: firstDuration, flashed: new Set(), mergeGroup: true }
      second.packet = { startAt: arrival - secondDuration, duration: secondDuration, flashed: new Set(), mergeGroup: true }
      for (const chain of scene.chains) {
        if (chain !== first && chain !== second) chain.nextAt = arrival + 1.5 + random() * 1.5
      }
      mergeRemaining = 2
      mergeActive = true
      mergePending = false
      totalPackets += 2
      mergeAfter = totalPackets + 4 + Math.floor(random() * 3)
    }

    const updatePacketSchedule = (now: number) => {
      const anyActive = scene.chains.some((chain) => chain.packet !== null)
      if (mergePending && !mergeActive && !anyActive && scene.chains.length > 1) {
        scheduleMerge(now)
        return
      }
      if (mergePending || mergeActive) return
      if (now - lastLaunch < 0.65) return

      const nextChain = scene.chains.find((chain) => chain.packet === null && now >= chain.nextAt)
      if (!nextChain) return
      nextChain.packet = { startAt: now, duration: 1.8 + random() * 0.6, flashed: new Set(), mergeGroup: false }
      nextChain.nextAt = Number.POSITIVE_INFINITY
      lastLaunch = now
      totalPackets += 1
      if (totalPackets >= mergeAfter && scene.chains.length > 1) mergePending = true
    }

    const draw = (elapsedNow: number) => {
      ctx.clearRect(0, 0, width, height)
      if (!scene) return
      updateCursor(Math.min(0.05, Math.max(0, elapsedNow - elapsed)))
      const routes = buildRoutes()
      drawNodes('back', elapsedNow)
      drawConnections(routes)
      drawCursorLinks()
      drawPackets(routes, elapsedNow)
      drawNodes('mid', elapsedNow)
      drawNodes('front', elapsedNow)
    }

    const onMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
    }
    const onLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) pointer = null
    }
    const onThemeChange = () => {
      readPalette()
      draw(elapsed)
    }
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        resizeCanvas()
        cursorEnabled = width >= 768 && !touchDevice
        rebuildScene()
        draw(elapsed)
      }, 150)
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
        running = false
      } else if (!running) {
        previousTime = performance.now()
        running = true
        animationFrame = window.requestAnimationFrame(loop)
      }
    }

    const loadIcons = Promise.all(imagePromises)
    readPalette()
    resizeCanvas()
    rebuildScene()

    if (reducedMotion) {
      void loadIcons.then(() => {
        if (!disposed) draw(0)
      })
      return () => {
        disposed = true
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('themechange', onThemeChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    if (!touchDevice) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseout', onLeave)
    }

    function loop(now: number) {
      if (!running || disposed) return
      animationFrame = window.requestAnimationFrame(loop)
      const dt = Math.min(0.05, Math.max(0, (now - previousTime) / 1000))
      previousTime = now
      elapsed += dt
      updateCursor(dt)
      const routes = buildRoutes()
      ctx.clearRect(0, 0, width, height)
      drawNodes('back', elapsed)
      drawConnections(routes)
      drawCursorLinks()
      drawPackets(routes, elapsed)
      drawNodes('mid', elapsed)
      drawNodes('front', elapsed)
      updatePacketSchedule(elapsed)
    }

    previousTime = performance.now()
    if (!document.hidden) {
      running = true
      animationFrame = window.requestAnimationFrame(loop)
    }

    return () => {
      disposed = true
      running = false
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('themechange', onThemeChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (!touchDevice) {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseout', onLeave)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas hero-network" aria-hidden="true" />
}
