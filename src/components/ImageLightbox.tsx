import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CaretLeft, CaretRight, X } from '@/components/slab'
import '@/styles/image-lightbox.css'

export type LightboxImage = {
  src: string
  alt: string
  caption: string
}

type ImageLightboxProps = {
  images: LightboxImage[]
  open: boolean
  initialIndex?: number
  onClose: () => void
  triggerRef: { current: HTMLElement | null }
}

export default function ImageLightbox({
  images,
  open,
  initialIndex = 0,
  onClose,
  triggerRef,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)
  const image = images[activeIndex]

  useEffect(() => {
    if (!open) return
    setActiveIndex(Math.min(Math.max(initialIndex, 0), images.length - 1))
    setZoomed(false)
  }, [open, initialIndex, images.length])

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }, [open, triggerRef])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (zoomed) {
      requestAnimationFrame(() => {
        viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2
        viewport.scrollTop = (viewport.scrollHeight - viewport.clientHeight) / 2
      })
    } else {
      viewport.scrollTo({ left: 0, top: 0 })
    }
  }, [zoomed, activeIndex, open])

  const showImage = (index: number) => {
    const nextIndex = (index + images.length) % images.length
    setActiveIndex(nextIndex)
    setZoomed(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowLeft' && images.length > 1) {
      event.preventDefault()
      showImage(activeIndex - 1)
      return
    }
    if (event.key === 'ArrowRight' && images.length > 1) {
      event.preventDefault()
      showImage(activeIndex + 1)
      return
    }
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && (document.activeElement === first || !event.currentTarget.contains(document.activeElement))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (document.activeElement === last || !event.currentTarget.contains(document.activeElement))) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!image || images.length === 0) return null

  return (
    <dialog
      ref={dialogRef}
      className="image-lightbox"
      aria-label="Image viewer"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={closeButtonRef}
        className="image-lightbox__close"
        type="button"
        aria-label="Close image viewer"
        onClick={onClose}
      >
        <X size={20} weight="bold" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="image-lightbox__nav image-lightbox__nav--previous"
            type="button"
            aria-label="Previous image"
            onClick={() => showImage(activeIndex - 1)}
          >
            <CaretLeft size={24} weight="bold" aria-hidden="true" />
          </button>
          <button
            className="image-lightbox__nav image-lightbox__nav--next"
            type="button"
            aria-label="Next image"
            onClick={() => showImage(activeIndex + 1)}
          >
            <CaretRight size={24} weight="bold" aria-hidden="true" />
          </button>
        </>
      )}

      <figure className="image-lightbox__figure">
        <div ref={viewportRef} className="image-lightbox__viewport">
          <button
            type="button"
            className={`image-lightbox__zoom-toggle${zoomed ? ' is-zoomed' : ''}`}
            aria-label={zoomed ? 'Fit image to screen' : 'Zoom image to 2x'}
            onClick={() => setZoomed((value) => !value)}
          >
            <img src={image.src} alt={image.alt} draggable={false} />
          </button>
        </div>
        <figcaption className="image-lightbox__caption">{image.caption}</figcaption>
        {images.length > 1 && (
          <span className="image-lightbox__counter" aria-live="polite" aria-atomic="true">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </figure>
    </dialog>
  )
}
