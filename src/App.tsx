import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, ExternalLink, Briefcase, GraduationCap, Award, Code, Bot, Zap, FolderGit2, SkipForward, List, Github, Linkedin } from 'lucide-react'
import { translations, seo, type Lang } from './i18n'
import { useHomeSeo } from './articles/use-article-seo'
import { getTechIcon } from './tech-icons'


function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, isInView }
}

const HOME_TOC_SECTIONS = [
  { id: 'experience', es: 'Experiencia', en: 'Experience' },
  { id: 'projects', es: 'Proyectos', en: 'Projects' },
  { id: 'education', es: 'Formación', en: 'Education' },
  { id: 'tech', es: 'Skills & Stack', en: 'Skills & Stack' },
  { id: 'contact', es: 'Contacto', en: 'Contact' },
] as const

function HomeToc({ lang }: { lang: Lang }) {
  const [hasRevealed, setHasRevealed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  // Show when #experience top reaches viewport, hide when user scrolls above it
  useEffect(() => {
    const check = () => {
      const trigger = document.getElementById('experience')
      if (!trigger) return
      const show = trigger.getBoundingClientRect().top <= 100
      setVisible(show)
      if (show && !hasRevealed) setHasRevealed(true)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [hasRevealed])

  // Track active section — last section whose top has scrolled past 40% of viewport
  // At page bottom, force last section as active
  useEffect(() => {
    if (!hasRevealed) return
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
      if (atBottom) {
        setActiveId(HOME_TOC_SECTIONS[HOME_TOC_SECTIONS.length - 1].id)
        return
      }
      const threshold = window.innerHeight * 0.4
      let current = ''
      for (const s of HOME_TOC_SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= threshold) current = s.id
      }
      if (current) setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [hasRevealed])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setTocOpen(false)
    const isLast = id === HOME_TOC_SECTIONS[HOME_TOC_SECTIONS.length - 1].id
    const top = isLast
      ? document.documentElement.scrollHeight - window.innerHeight
      : el.getBoundingClientRect().top + window.scrollY - 96
    requestAnimationFrame(() => { window.scrollTo({ top, behavior: 'instant' }) })
  }, [])

  const activeIdx = HOME_TOC_SECTIONS.findIndex(s => s.id === activeId)

  const lastIdx = HOME_TOC_SECTIONS.length - 1
  // Progress as fraction between first and last dot (0 to 1)
  const progressFrac = activeIdx >= 0 ? activeIdx / lastIdx : 0

  const tocNav = (
    <nav aria-label="Table of contents" className="relative">
      {/* Vertical track — spans from first dot center to last dot center */}
      <div className="absolute left-[5.5px] top-[14px] w-px bg-border" style={{ height: 'calc(100% - 28px)' }} />
      {/* Animated progress fill */}
      <motion.div
        className="absolute left-[5.5px] top-[14px] w-px bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progressFrac }}
        style={{ height: 'calc(100% - 28px)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <ul className="relative space-y-1">
        {HOME_TOC_SECTIONS.map((section, i) => {
          const isActive = activeId === section.id
          const isPast = i <= activeIdx
          return (
            <li key={section.id} className="flex items-center gap-3">
              <motion.span
                className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${
                  isActive ? 'border-primary bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]'
                  : isPast ? 'border-primary/50 bg-card'
                  : 'border-border bg-card'
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <button
                onClick={() => scrollTo(section.id)}
                className={`text-left text-[13px] tracking-wide py-1 transition-all duration-300 ${
                  isActive ? 'text-primary font-semibold translate-x-0.5'
                  : isPast ? 'text-foreground/70'
                  : 'text-muted-foreground/60 hover:text-foreground/80'
                }`}
              >
                {section[lang]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop: sticky sidebar */}
          <motion.div
            initial={hasRevealed ? { opacity: 0, x: -12 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden 2xl:block fixed top-24 left-[max(1rem,calc(50%-46rem))] w-48 max-h-[calc(100vh-8rem)] overflow-visible z-30"
          >
            {tocNav}
          </motion.div>

          {/* Mobile / narrow desktop: floating button + drawer */}
          <motion.button
            initial={hasRevealed ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setTocOpen(o => !o)}
            className="2xl:hidden fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            aria-label="Toggle table of contents"
          >
            <List className="w-5 h-5" />
          </motion.button>
          {tocOpen && (
            <>
              <div className="2xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
              <div className="2xl:hidden fixed bottom-20 right-6 z-50 w-64 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl p-4">
                {tocNav}
              </div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [detected, setDetected] = useState(false)
  const hydrated = useHydrated()
  const wasAboveFold = useRef(false)

  useEffect(() => {
    if (!ref) return

    // IntersectionObserver instead of getBoundingClientRect (avoids forced reflow).
    // First callback fires immediately for visible elements → above-fold detection.
    let firstCallback = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firstCallback) {
          firstCallback = false
          if (entry.isIntersecting) wasAboveFold.current = true
          setDetected(true)
        }
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return (
    <motion.div
      ref={setRef}
      initial={false}
      animate={
        !hydrated || !detected
          ? false  // Pre-hydration / pre-detection: preserve SSR DOM state
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 40 }
      }
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parsea texto con marcadores de highlight:
// *texto* = Tipo B: gradiente durante typewriter (frase activa), luego normal
// +texto+ = Tipo C: normal durante typewriter, gradiente en encendido final
// **texto** = gradiente siempre (permanent) + slow typing
type ParsedHighlights = {
  clean: string
  ranges: [number, number][]          // backward compat
  typewriterRanges: [number, number][] // *texto* - Tipo B: gradiente solo durante typewriter
  finalRanges: [number, number][]      // +texto+ - Tipo C: gradiente solo en encendido final
  permanentRanges: [number, number][]  // **texto** - siempre gradiente
  slowRanges: [number, number][]       // para typing lento
}

function parseHighlights(text: string): ParsedHighlights {
  const typewriterRanges: [number, number][] = []  // Tipo B: *texto*
  const finalRanges: [number, number][] = []       // Tipo C: +texto+
  const permanentRanges: [number, number][] = []   // **texto**
  const slowRanges: [number, number][] = []
  let clean = ''
  let i = 0

  while (i < text.length) {
    // Check for ** (permanent highlight + slow)
    if (text[i] === '*' && text[i + 1] === '*') {
      const start = clean.length
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        clean += text[i]
        i++
      }
      permanentRanges.push([start, clean.length])
      slowRanges.push([start, clean.length])
      i += 2
    }
    // Check for + (Tipo C: gradiente solo en encendido final)
    // Si +digit (ej: +15), mostrar como "15+" (convención internacional)
    else if (text[i] === '+') {
      const nextIsDigit = /\d/.test(text[i + 1] || '')
      const start = clean.length
      i++ // skip opening +
      if (nextIsDigit) {
        // Leer dígitos primero, luego añadir + después (15+ en vez de +15)
        while (i < text.length && /\d/.test(text[i])) {
          clean += text[i]
          i++
        }
        clean += '+'
      }
      while (i < text.length && text[i] !== '+') {
        clean += text[i]
        i++
      }
      finalRanges.push([start, clean.length])
      i++ // skip closing +
    }
    // Check for single * (Tipo B: gradiente solo durante typewriter)
    else if (text[i] === '*') {
      const start = clean.length
      i++
      while (i < text.length && text[i] !== '*') {
        clean += text[i]
        i++
      }
      typewriterRanges.push([start, clean.length])
      i++
    } else {
      clean += text[i]
      i++
    }
  }

  // For backward compatibility
  const ranges: [number, number][] = [...permanentRanges]
  return { clean, ranges, typewriterRanges, finalRanges, permanentRanges, slowRanges }
}

// Renderiza texto con rangos destacados y soporte para transición
// Tipos de highlight:
// - typewriter (Tipo B): gradiente durante typewriter, luego normal
// - final (Tipo C): normal durante typewriter, gradiente en encendido final
// - permanent: siempre gradiente
function renderHighlightedText(
  text: string,
  _ranges: [number, number][],  // kept for API compatibility
  options?: {
    dimmed?: boolean           // texto atenuado (después del typewriter)
    finalReveal?: boolean      // Tipo C se enciende con gradiente
    revealed?: boolean         // resto del texto se enciende
    typewriterRanges?: [number, number][]  // Tipo B
    finalRanges?: [number, number][]       // Tipo C
    permanentRanges?: [number, number][]
    highlightsActive?: boolean // gradiente activo durante typewriter
  }
) {
  const {
    dimmed = false,
    finalReveal = false,
    revealed = false,
    typewriterRanges = [],
    finalRanges = [],
    permanentRanges = [],
    highlightsActive = false
  } = options || {}

  // Build a map of character positions to their highlight type
  type HighlightType = 'typewriter' | 'final' | 'permanent' | null
  const charTypes: HighlightType[] = new Array(text.length).fill(null)

  typewriterRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'typewriter'
  })
  finalRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'final'
  })
  permanentRanges.forEach(([start, end]) => {
    for (let i = start; i < end && i < text.length; i++) charTypes[i] = 'permanent'
  })

  // Opacity states - SEPARADOS para cada tipo
  // Texto normal y Tipo B: atenuados, luego quedan en segundo plano (opacity-50)
  const textOpacity = dimmed ? (revealed ? 'opacity-50' : 'opacity-15') : 'opacity-100'
  // Tipo C: atenuados hasta que finalReveal=true (se encienden ANTES que el resto)
  const isFinalLowOpacity = dimmed && !finalReveal

  // UN SOLO TIMING para TODO - sincronización perfecta
  const timing = 'duration-[2500ms] ease-in-out'

  // If no special ranges, render as plain text
  if (typewriterRanges.length === 0 && finalRanges.length === 0 && permanentRanges.length === 0) {
    return (
      <span className={`text-muted-foreground transition-opacity ${timing} ${textOpacity}`}>
        {text}
      </span>
    )
  }

  // Group consecutive characters by type
  const parts: React.ReactNode[] = []
  let currentType: HighlightType = charTypes[0]
  let currentStart = 0

  // Per-word inline-grid so highlighted text can wrap naturally on narrow screens.
  // Each word shows its slice of the full-phrase gradient via background-size/position.
  const pushHighlightWords = (
    seg: string, baseKey: number, showGradient: boolean, normalOpacity: string
  ) => {
    const gOp = showGradient ? 'opacity-100' : 'opacity-0'
    const totalLen = seg.length
    let charPos = 0
    seg.split(/( +)/).forEach((word, wIdx) => {
      if (!word) return
      if (/^ +$/.test(word)) {
        parts.push(<span key={`${baseKey}s${wIdx}`}>{word}</span>)
        charPos += word.length
      } else {
        const wordFrac = word.length / totalLen
        const startFrac = charPos / totalLen
        // Continuous gradient: size spans full phrase, position shows this word's slice
        const bgSize = wordFrac >= 1 ? 100 : 100 / wordFrac
        const bgPos = wordFrac >= 1 ? 0 : startFrac * 100 / (1 - wordFrac)
        parts.push(
          <span key={`${baseKey}w${wIdx}`} className="inline-grid">
            <span
              className={`col-start-1 row-start-1 font-medium transition-opacity ${timing} ${gOp}`}
              style={{
                backgroundImage: 'linear-gradient(to right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))',
                backgroundSize: `${bgSize}% 100%`,
                backgroundPosition: `${bgPos}% 0`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >{word}</span>
            <span className={`col-start-1 row-start-1 text-muted-foreground transition-opacity ${timing} ${normalOpacity}`}>{word}</span>
          </span>
        )
        charPos += word.length
      }
    })
  }

  for (let i = 1; i <= text.length; i++) {
    const type = i < text.length ? charTypes[i] : null
    if (type !== currentType || i === text.length) {
      const segment = text.slice(currentStart, i)
      if (segment) {
        if (currentType === null) {
          // Plain text - dims then stays as background context
          parts.push(
            <span
              key={currentStart}
              className={`text-muted-foreground transition-opacity ${timing} ${textOpacity}`}
            >
              {segment}
            </span>
          )
        } else if (currentType === 'typewriter') {
          // Tipo B: gradiente SOLO durante typewriter (highlightsActive), luego texto normal
          const showGradient = highlightsActive
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : textOpacity)
        } else if (currentType === 'final') {
          // Tipo C: normal durante typewriter, gradiente en encendido final (finalReveal)
          const showGradient = finalReveal
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : isFinalLowOpacity ? 'opacity-15' : 'opacity-100')
        } else {
          // permanent: siempre gradiente (mientras no esté revealed)
          const showGradient = !revealed
          pushHighlightWords(segment, currentStart, showGradient,
            showGradient ? 'opacity-0' : 'opacity-100')
        }
      }
      currentStart = i
      currentType = type
    }
  }

  return parts
}

// Typewriter reflexivo con fases: contexto → reflexiones (se borran) → hook final
type Phase = 'idle' | 'context' | 'pause-after-context' | 'reflection' | 'pause-before-delete' | 'deleting' | 'hook' | 'complete'

type TypewriterState = {
  phase: Phase
  displayText: string
  contextComplete: boolean
  currentReflection: number
  completedHookLines: string[][]
  currentHookParagraph: number
  currentHookLine: number
}

type TypewriterAction =
  | { type: 'START' }
  | { type: 'TICK'; char: string }
  | { type: 'PHASE_CHANGE'; phase: Phase }
  | { type: 'CONTEXT_COMPLETE' }
  | { type: 'CLEAR_TEXT' }
  | { type: 'DELETE_WORD' }
  | { type: 'NEXT_REFLECTION' }
  | { type: 'COMPLETE_HOOK_LINE'; text: string }
  | { type: 'NEXT_HOOK_LINE' }
  | { type: 'NEXT_HOOK_PARAGRAPH' }
  | { type: 'SKIP_TO_COMPLETE'; allHookLines: string[][] }
  | { type: 'RESET' }

const initialTypewriterState: TypewriterState = {
  phase: 'idle',
  displayText: '',
  contextComplete: false,
  currentReflection: 0,
  completedHookLines: [],
  currentHookParagraph: 0,
  currentHookLine: 0,
}

function typewriterReducer(state: TypewriterState, action: TypewriterAction): TypewriterState {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'context' }
    case 'TICK':
      return { ...state, displayText: state.displayText + action.char }
    case 'PHASE_CHANGE':
      return { ...state, phase: action.phase }
    case 'CONTEXT_COMPLETE':
      return { ...state, contextComplete: true }
    case 'CLEAR_TEXT':
      return { ...state, displayText: '' }
    case 'DELETE_WORD': {
      const trimmed = state.displayText.trimEnd()
      const lastSpace = trimmed.lastIndexOf(' ')
      return { ...state, displayText: lastSpace === -1 ? '' : state.displayText.slice(0, lastSpace + 1) }
    }
    case 'NEXT_REFLECTION':
      return { ...state, currentReflection: state.currentReflection + 1, displayText: '', phase: 'reflection' }
    case 'COMPLETE_HOOK_LINE': {
      const newCompleted = [...state.completedHookLines]
      if (!newCompleted[state.currentHookParagraph]) newCompleted[state.currentHookParagraph] = []
      newCompleted[state.currentHookParagraph][state.currentHookLine] = action.text
      return { ...state, completedHookLines: newCompleted }
    }
    case 'NEXT_HOOK_LINE':
      return { ...state, currentHookLine: state.currentHookLine + 1, displayText: '' }
    case 'NEXT_HOOK_PARAGRAPH':
      return { ...state, currentHookParagraph: state.currentHookParagraph + 1, currentHookLine: 0, displayText: '' }
    case 'SKIP_TO_COMPLETE':
      return {
        ...state,
        phase: 'complete',
        contextComplete: true,
        completedHookLines: action.allHookLines,
        displayText: '',
      }
    case 'RESET':
      return initialTypewriterState
    default:
      return state
  }
}

const STORY_SEEN_KEY = 'story-animation-seen-v1'

function ReflectiveTypewriter({
  context,
  reflections,
  hookParagraphs,
  className = '',
  dimmed = false,
  finalReveal = false,
  revealed = false,
  onComplete,
  skipRef,
  onStart
}: {
  context: string
  reflections: readonly string[]
  hookParagraphs: readonly (readonly string[])[]
  className?: string
  dimmed?: boolean
  finalReveal?: boolean
  revealed?: boolean
  onComplete?: () => void
  skipRef?: React.MutableRefObject<(() => void) | null>
  onStart?: () => void
}) {
  const [state, dispatch] = useReducer(typewriterReducer, initialTypewriterState)
  const { phase, displayText, contextComplete, currentReflection, completedHookLines, currentHookParagraph, currentHookLine } = state

  const { ref, isInView } = useInView(0.5)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Parse context for highlights
  const parsedContext = useMemo(() => parseHighlights(context), [context])

  // Parse hook lines for highlights
  const parsedHookLines = useMemo(() =>
    hookParagraphs.flatMap(p => [...p]).map(parseHighlights),
    [hookParagraphs]
  )

  // Build all hook lines for skip functionality
  const allHookLinesComplete = useMemo(() => {
    const result: string[][] = []
    let flatIdx = 0
    for (let p = 0; p < hookParagraphs.length; p++) {
      result[p] = []
      for (let l = 0; l < hookParagraphs[p].length; l++) {
        result[p][l] = parsedHookLines[flatIdx]?.clean || ''
        flatIdx++
      }
    }
    return result
  }, [hookParagraphs, parsedHookLines])

  // Skip to complete function
  const skipToComplete = useCallback(() => {
    abortRef.current?.abort()
    dispatch({ type: 'SKIP_TO_COMPLETE', allHookLines: allHookLinesComplete })
    sessionStorage.setItem(STORY_SEEN_KEY, 'true')
    onComplete?.()
  }, [allHookLinesComplete, onComplete])

  // Expose skipToComplete to parent via ref
  useEffect(() => {
    if (skipRef) skipRef.current = skipToComplete
  }, [skipRef, skipToComplete])

  // Check sessionStorage on mount - skip if already seen
  useEffect(() => {
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen && phase === 'idle') {
      skipToComplete()
    }
  }, []) // Only on mount

  // Reset and cancel on language change
  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    dispatch({ type: 'RESET' })

    // Check if already seen after reset
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen) {
      dispatch({ type: 'SKIP_TO_COMPLETE', allHookLines: allHookLinesComplete })
    }
  }, [context, reflections, hookParagraphs, allHookLinesComplete])

  // Start when in view
  useEffect(() => {
    if (isInView && phase === 'idle') {
      dispatch({ type: 'START' })
      onStart?.()
    }
  }, [isInView, phase, onStart])

  // Click to skip handler
  useEffect(() => {
    if (phase === 'complete' || phase === 'idle') return

    const handleClick = () => {
      skipToComplete()
    }

    const container = containerRef.current
    container?.addEventListener('click', handleClick)

    return () => container?.removeEventListener('click', handleClick)
  }, [phase, skipToComplete])

  // Typing delay function
  const getTypingDelay = useCallback((char: string, prevChar: string) => {
    let delay = 40
    if (/[.,!?;:—]/.test(char)) delay += 120 + Math.random() * 100
    else if (char === ' ') delay += 20 + Math.random() * 30
    else if (prevChar === ' ') delay += 25 + Math.random() * 20
    else if (/[áéíóúñü¿¡]/i.test(char)) delay += 30 + Math.random() * 20
    delay += (Math.random() - 0.5) * 20
    return Math.max(25, delay)
  }, [])

  // Main animation effect
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    const signal = abortRef.current?.signal

    // Phase: context (use clean text without markers)
    if (phase === 'context') {
      const cleanContext = parsedContext.clean
      if (displayText === cleanContext) {
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'PHASE_CHANGE', phase: 'pause-after-context' })
        }, 100)
        return () => clearTimeout(timer)
      } else {
        const nextChar = cleanContext[displayText.length]
        const prevChar = displayText.length > 0 ? cleanContext[displayText.length - 1] : ''
        const delay = getTypingDelay(nextChar, prevChar)
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: pause after context
    if (phase === 'pause-after-context') {
      dispatch({ type: 'CONTEXT_COMPLETE' })
      const timer = setTimeout(() => {
        if (signal?.aborted) return
        dispatch({ type: 'CLEAR_TEXT' })
        dispatch({ type: 'PHASE_CHANGE', phase: 'reflection' })
      }, 800)
      return () => clearTimeout(timer)
    }

    // Phase: reflection (typing)
    if (phase === 'reflection') {
      const currentText = reflections[currentReflection]
      if (displayText === currentText) {
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'PHASE_CHANGE', phase: 'pause-before-delete' })
        }, 600)
        return () => clearTimeout(timer)
      } else {
        const nextChar = currentText[displayText.length]
        const prevChar = displayText.length > 0 ? currentText[displayText.length - 1] : ''
        const delay = getTypingDelay(nextChar, prevChar)
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: pause before delete
    if (phase === 'pause-before-delete') {
      const timer = setTimeout(() => {
        if (signal?.aborted) return
        dispatch({ type: 'PHASE_CHANGE', phase: 'deleting' })
      }, 400)
      return () => clearTimeout(timer)
    }

    // Phase: deleting (word by word, like Alt+Backspace)
    if (phase === 'deleting') {
      if (displayText === '') {
        if (currentReflection < reflections.length - 1) {
          dispatch({ type: 'NEXT_REFLECTION' })
        } else {
          dispatch({ type: 'PHASE_CHANGE', phase: 'hook' })
        }
      } else {
        const delay = 80 + Math.random() * 40
        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'DELETE_WORD' })
        }, delay)
        return () => clearTimeout(timer)
      }
    }

    // Phase: hook
    if (phase === 'hook') {
      const flatIndex = (() => {
        let idx = 0
        for (let p = 0; p < currentHookParagraph; p++) idx += hookParagraphs[p].length
        return idx + currentHookLine
      })()
      const { clean: currentText } = parsedHookLines[flatIndex]

      if (displayText === currentText) {
        dispatch({ type: 'COMPLETE_HOOK_LINE', text: currentText })

        const isLastLine = currentHookLine >= hookParagraphs[currentHookParagraph].length - 1
        const isLastParagraph = currentHookParagraph >= hookParagraphs.length - 1

        if (isLastLine && isLastParagraph) {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'PHASE_CHANGE', phase: 'complete' })
            sessionStorage.setItem(STORY_SEEN_KEY, 'true')
            onComplete?.()
          }, 600)
          return () => clearTimeout(timer)
        } else if (isLastLine) {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'NEXT_HOOK_PARAGRAPH' })
          }, 800)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => {
            if (signal?.aborted) return
            dispatch({ type: 'NEXT_HOOK_LINE' })
          }, 500)
          return () => clearTimeout(timer)
        }
      } else {
        const nextCharIndex = displayText.length
        const nextChar = currentText[nextCharIndex]
        const prevChar = nextCharIndex > 0 ? currentText[nextCharIndex - 1] : ''

        const { slowRanges } = parsedHookLines[flatIndex]
        const isInSlowRange = slowRanges.some(([start, end]) => nextCharIndex >= start && nextCharIndex < end)

        const textSoFar = currentText.slice(0, nextCharIndex)
        const isAfterSentenceEnd = prevChar === '.' && nextChar === ' ' && textSoFar.includes('negocio')

        let delay = getTypingDelay(nextChar, prevChar)

        if (isAfterSentenceEnd) {
          delay = 800
        } else if (isInSlowRange) {
          delay = delay * 4 + 80
        }

        const timer = setTimeout(() => {
          if (signal?.aborted) return
          dispatch({ type: 'TICK', char: nextChar })
        }, delay)
        return () => clearTimeout(timer)
      }
    }
  }, [phase, displayText, context, reflections, currentReflection, hookParagraphs, parsedHookLines, currentHookParagraph, currentHookLine, getTypingDelay, onComplete])

  const showCursor = phase !== 'complete' && phase !== 'idle'

  // Helper to get parsed highlights for hook line
  const getHookParsed = (pIdx: number, lIdx: number): ParsedHighlights => {
    let flatIdx = 0
    for (let p = 0; p < pIdx; p++) flatIdx += hookParagraphs[p].length
    return parsedHookLines[flatIdx + lIdx] || { clean: '', fadeOutRanges: [], permanentRanges: [], fadeInRanges: [], slowRanges: [] }
  }

  // Combine refs
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
    ref(node)
  }, [ref])

  return (
    <div
      ref={setRefs}
      className={`${className} min-h-[7rem] md:min-h-[8rem] ${phase !== 'complete' && phase !== 'idle' ? 'cursor-pointer' : ''}`}
      title={phase !== 'complete' && phase !== 'idle' ? 'Click to skip' : undefined}
    >
      {/* Context line */}
      <span className="md:block md:-mb-1">
        {phase === 'context' ? (
          <>
            {renderHighlightedText(displayText, [], {
              dimmed,
              finalReveal,
              revealed,
              typewriterRanges: parsedContext.typewriterRanges,
              finalRanges: parsedContext.finalRanges,
              permanentRanges: parsedContext.permanentRanges,
              highlightsActive: true, // gradiente activo durante typewriter del context
            })}
            {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
          </>
        ) : contextComplete ? (
          <>
            {renderHighlightedText(parsedContext.clean, [], {
              dimmed,
              finalReveal,
              revealed,
              typewriterRanges: parsedContext.typewriterRanges,
              finalRanges: parsedContext.finalRanges,
              permanentRanges: parsedContext.permanentRanges,
              highlightsActive: false, // ya no estamos en el context, gradiente apagado
            })}
            {phase === 'pause-after-context' && (
              <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>
            )}
          </>
        ) : null}
      </span>{' '}

      {/* Reflection line (becomes the hook line) */}
      {(phase === 'reflection' || phase === 'pause-before-delete' || phase === 'deleting') && (
        <p className="mb-1">
          <span className="text-gradient-theme">{displayText}</span>
          {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
        </p>
      )}

      {/* Hook paragraphs */}
      {/* Hook paragraphs: pIdx=0 inline on mobile (flows with context), block on desktop */}
      {(phase === 'hook' || phase === 'complete') && hookParagraphs.map((paragraph, pIdx) => {
        const Tag = pIdx === 0 ? 'span' : 'p'
        const wrapperClass = pIdx === 0
          ? "md:block md:mb-4"
          : "mt-4 md:mt-0"
        return (
          <Tag key={pIdx} className={wrapperClass}>
            {paragraph.map((_, lIdx) => {
              const parsed = getHookParsed(pIdx, lIdx)
              const isCurrentLine = pIdx === currentHookParagraph && lIdx === currentHookLine
              const isCompleted = completedHookLines[pIdx]?.[lIdx] !== undefined

              // Unificar renderizado para permitir transiciones CSS suaves
              // El texto a mostrar: completado > actual (displayText) > vacío
              const textToShow = isCompleted
                ? completedHookLines[pIdx][lIdx]
                : (isCurrentLine && phase === 'hook')
                  ? displayText
                  : ''

              // Tipo B highlights activos SOLO mientras se escribe esta línea
              const highlightsActive = isCurrentLine && phase === 'hook'

              // Solo renderizar si hay texto o es la línea actual
              if (!textToShow && !isCurrentLine) return null

              return (
                <span key={lIdx} className={lIdx > 0 ? "md:block md:-mt-1" : ""}>
                  {lIdx > 0 && <span className="md:hidden"> </span>}
                  {renderHighlightedText(textToShow, [], {
                    dimmed,
                    finalReveal,
                    revealed,
                    typewriterRanges: parsed.typewriterRanges,
                    finalRanges: parsed.finalRanges,
                    permanentRanges: parsed.permanentRanges,
                    highlightsActive,
                  })}
                  {isCurrentLine && phase === 'hook' && showCursor && (
                    <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>
                  )}
                </span>
              )
            })}
          </Tag>
        )
      })}
    </div>
  )
}

// Sección de historia con typewriter y animaciones
function StorySection({ t }: { t: (typeof translations)[Lang] }) {
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [textDimmed, setTextDimmed] = useState(false)
  const [finalReveal, setFinalReveal] = useState(false)  // Tipo C se enciende con gradiente
  const [textRevealed, setTextRevealed] = useState(false) // Resto del texto se enciende
  const [animationStarted, setAnimationStarted] = useState(false)
  const [scrollSkipped, setScrollSkipped] = useState(false)
  const skipRef = useRef<(() => void) | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Reset states when language changes
  useEffect(() => {
    // Check if animation was already seen (skip case)
    const seen = sessionStorage.getItem(STORY_SEEN_KEY)
    if (seen) {
      setTypewriterComplete(true)
      setTextDimmed(true)
      setFinalReveal(true)
      setTextRevealed(true)
    } else {
      setTypewriterComplete(false)
      setTextDimmed(false)
      setFinalReveal(false)
      setTextRevealed(false)
      setAnimationStarted(false)
      setScrollSkipped(false)
    }
  }, [t])

  // Transition sequence: dim → finalReveal (Tipo C gradient) → revealed (rest)
  const sequenceStartedRef = useRef(false)

  useEffect(() => {
    // Reset ref when language changes
    sequenceStartedRef.current = false
  }, [t])

  useEffect(() => {
    if (!typewriterComplete || sequenceStartedRef.current) return
    sequenceStartedRef.current = true

    // Secuencia de animación post-typewriter:
    // 1. Esperar a que Tipo B (Construir) termine de desvanecerse (~2.5s transición)
    // 2. Dimmed: todo se atenúa
    // 3. FinalReveal: Tipo C se enciende con gradiente (+15 años + sistemas)
    // 4. Revealed: resto del texto se enciende, Tipo C MANTIENE gradiente

    // Step 1: Dim everything (2500ms - espera a que Tipo B haya perdido gradiente)
    const dimTimer = setTimeout(() => {
      setTextDimmed(true)
    }, 2500)

    // Step 2: Tipo C se enciende con gradiente (4500ms - contenido adicional ya visible)
    const finalRevealTimer = setTimeout(() => {
      setFinalReveal(true)
    }, 4500)

    // Step 3: Resto del texto se enciende (8000ms - Tipo C tuvo tiempo de brillar)
    const revealTimer = setTimeout(() => {
      setTextRevealed(true)
    }, 8000)

    return () => {
      clearTimeout(dimTimer)
      clearTimeout(finalRevealTimer)
      clearTimeout(revealTimer)
    }
  }, [typewriterComplete])

  // Scroll-past-as-skip: si el usuario scrollea pasando la sección, auto-skip
  useEffect(() => {
    if (typewriterComplete) return
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setScrollSkipped(true)
          skipRef.current?.()
        }
      },
      { threshold: 0 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [typewriterComplete])

  return (
    <section ref={sectionRef} id="about" className="relative py-16 md:py-24">
      {/* Vignette horizontal: tapa puntos en el centro, se ven en los bordes */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 25%, hsl(var(--background)) 75%, transparent 100%)',
      }} />
      {/* Fade vertical: transparente arriba → fondo sólido abajo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Hook emocional con typewriter reflexivo + botón skip */}
        <div className="relative pb-12">
          <ReflectiveTypewriter
            context={t.story.context}
            reflections={t.story.reflections}
            hookParagraphs={t.story.hookParagraphs}
            dimmed={textDimmed}
            finalReveal={finalReveal}
            revealed={textRevealed}
            className="font-display text-lg md:text-2xl leading-relaxed text-center max-w-3xl mx-auto"
            onComplete={() => setTypewriterComplete(true)}
            skipRef={skipRef}
            onStart={() => setAnimationStarted(true)}
          />

          {/* Botón skip — posición absoluta debajo del texto, en el padding reservado */}
          <AnimatePresence>
            {animationStarted && !typewriterComplete && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => skipRef.current?.()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-muted-foreground border border-border/50 bg-card backdrop-blur-sm cursor-pointer hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors duration-200"
              >
                <SkipForward className="w-3.5 h-3.5" />
                {t.story.skipButton}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Contenido que aparece después del typewriter - expansión suave (instantánea si scroll-skip) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={typewriterComplete
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
          }
          transition={scrollSkipped
            ? { duration: 0 }
            : {
                height: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.4, delay: 0.1 }
              }
          }
          style={{ overflow: 'hidden' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.1 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className={`text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto transition-opacity duration-[2500ms] ease-in-out ${textDimmed ? (textRevealed ? 'opacity-50' : 'opacity-15') : 'opacity-100'}`}>
              {t.story.why}
            </p>
          </motion.div>

          <div className="mt-6 text-center max-w-3xl mx-auto">
            {t.story.seeking.map((line, i) => {
              // Spotlight: lines 0 and 2 light up with finalReveal, line 1 stays as background
              const isSpotlit = i === 0 || i === 2
              const dimOpacity = textDimmed
                ? (isSpotlit ? (finalReveal ? 'opacity-100' : 'opacity-15') : (textRevealed ? 'opacity-50' : 'opacity-15'))
                : 'opacity-100'

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, delay: typewriterComplete ? 0.3 + i * 0.2 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`transition-opacity duration-[2500ms] ease-in-out ${dimOpacity} ${
                    i === 2
                      ? 'font-display text-lg md:text-2xl font-bold text-gradient-theme leading-snug'
                      : i === 1
                        ? 'font-display text-lg md:text-2xl text-muted-foreground leading-snug'
                        : 'font-display text-lg md:text-2xl font-bold text-foreground leading-snug'
                  }`}
                >
                  {line}
                </motion.p>
              )
            })}
          </div>

          {/* Burbujas de navegación - delays sincronizados */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={typewriterComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: typewriterComplete ? 0.9 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`flex flex-wrap justify-center gap-3 mt-10 mb-12 transition-opacity duration-[2500ms] ease-in-out ${textDimmed && !textRevealed ? 'opacity-15' : 'opacity-100'}`}
          >
          {t.story.nav.map((item) => {
            const icons: Record<string, React.ReactNode> = {
              briefcase: <Briefcase className="w-4 h-4" />,
              folder: <FolderGit2 className="w-4 h-4" />,
              mail: <Mail className="w-4 h-4" />,
              bot: <Bot className="w-4 h-4" />
            }
            const isHighlight = 'highlight' in item && item.highlight
            const handleClick = (e: React.MouseEvent) => {
              if (item.href === '#chat') {
                e.preventDefault()
                window.dispatchEvent(new Event('openChat'))
              }
            }
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={handleClick}
                className={isHighlight
                  ? "btn-pop flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-theme text-white border border-transparent hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:brightness-95 text-sm font-medium shadow-lg shadow-primary/25"
                  : "btn-pop flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium"
                }
              >
                {icons[item.icon]}
                {item.label}
              </a>
            )
          })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CertLogo({ logo }: { logo: string }) {
  const logos: Record<string, React.ReactNode> = {
    anthropic: (
      <svg viewBox="0 0 92.2 65" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
      </svg>
    ),
    airtable: (
      <svg viewBox="0 0 200 170" className="w-6 h-6" aria-hidden="true">
        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
        <path fill="#8B8B8B" d="m88.078 91.846-21.904 10.576-53.72-45.295a5 5 0 0 1 1.12-.839c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
      </svg>
    ),
    make: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-0" x1="1.5" x2="12" y1="19.5" y2="0">
            <stop stopColor="#F0F"/><stop offset=".17" stopColor="#E90CF9"/><stop offset=".54" stopColor="#C023ED"/><stop offset="1" stopColor="#B02DE9"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-1" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#B02DE9"/><stop offset="1" stopColor="#6D00CC"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-2" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#F0F"/><stop offset=".3" stopColor="#B02DE9"/><stop offset="1" stopColor="#6021C3"/>
          </linearGradient>
        </defs>
        <path d="M6.989 4.036L.062 17.818a.577.577 0 00.257.774l3.733 1.876a.577.577 0 00.775-.256L11.753 6.43a.577.577 0 00-.257-.775L7.763 3.78a.575.575 0 00-.774.257z" fill="url(#make-fill-0)"/>
        <path d="M19.245 3.832h4.179c.318 0 .577.26.577.577v15.425a.578.578 0 01-.577.578h-4.179a.578.578 0 01-.577-.578V4.41c0-.318.259-.577.577-.577z" fill="url(#make-fill-1)"/>
        <path d="M12.815 4.085L9.85 19.108a.576.576 0 00.453.677l4.095.826c.314.063.62-.14.681-.454l2.964-15.022a.577.577 0 00-.453-.677l-4.096-.827a.577.577 0 00-.68.454z" fill="url(#make-fill-2)"/>
      </svg>
    ),
  }
  return logos[logo] || null
}

function App() {
  const lang: Lang = 'en'
  const t = translations[lang]
  const hydrated = useHydrated()

  // SEO: Dynamic meta tags based on language
  const seoData = seo[lang]
  useHomeSeo({ lang, title: seoData.title, description: seoData.description })

  return (
    <main className="min-h-screen bg-background bg-[length:24px_24px] [background-image:radial-gradient(circle,hsl(var(--dot-grid))_1px,transparent_1px)]">
      {/* Skip navigation — accessible keyboard shortcut */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>

      <HomeToc lang={lang} />

      {/* Hero Section */}
      <header id="main-content" className="relative overflow-hidden bg-background">
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-16">
          <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-12 items-center">
            <motion.div
              initial={hydrated ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center md:text-left"
            >
              <p className="font-display text-2xl md:text-3xl text-foreground mb-4">
                Hi, I&apos;m Ananya <span className="italic text-gradient-theme">Rangaraju</span>
              </p>
              <p className="font-mono text-xs tracking-[0.16em] uppercase text-muted-foreground mb-5">
                AI Systems &amp; Product Engineer
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.98] mb-5">
                I build AI that<br />
                holds up <span className="text-pastel-blue">in the<br />real world.</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[46ch] mx-auto md:mx-0 mb-8">
                Two years shipping AI in production taught me that most demos don't hold up once{' '}
                <span className="text-foreground font-semibold">real users</span> get their hands on them. I've been closing that gap ever since, with evals, LLMOps, and the trust layer between capability and production.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center px-6 py-3 rounded-md border-2 border-foreground bg-foreground text-[hsl(var(--background))] font-mono text-sm shadow-[4px_4px_0_hsl(var(--pastel-blue))] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_hsl(var(--pastel-blue))] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200"
                >
                  View the work
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 rounded-md border-2 border-border font-mono text-sm hover:border-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_hsl(var(--pastel-green))] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200"
                >
                  Say hello
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={hydrated ? { opacity: 0, scale: 0.92, rotate: -4 } : false}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto md:mx-0 w-full max-w-[190px] md:max-w-[320px] mb-6 md:mb-0"
            >
              <div className="relative rounded-xl overflow-hidden border-2 border-foreground shadow-[10px_10px_0_hsl(var(--pastel-coral))] bg-card">
                <img
                  src="/portrait-illustration.jpg"
                  srcSet="/portrait-illustration-sm.jpg 480w, /portrait-illustration.jpg 900w"
                  sizes="(max-width: 768px) 280px, 320px"
                  alt="Illustrated portrait of Ananya Rangaraju"
                  className="w-full h-auto object-cover object-top"
                  width={894}
                  height={900}
                  fetchPriority="high"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Quick stats */}
      <AnimatedSection className="border-y border-border">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3">
          {[
            { value: '2+', label: 'Years shipping production AI in clinical environments', color: 'text-pastel-blue' },
            { value: '61pt', label: 'Benchmark-to-production gap found via Clearance', color: 'text-pastel-coral' },
            { value: '3', label: 'Shipped projects, all in production', color: 'text-pastel-gold' },
          ].map((stat, i) => (
            <div
              key={stat.value}
              className={`py-7 px-5 ${i > 0 ? 'border-t border-border md:border-t-0 md:border-l' : ''}`}
            >
              <div className={`font-display text-3xl md:text-4xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
              <div className="mt-1.5 text-sm text-muted-foreground leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Summary - Con storytelling integrado */}
      <StorySection t={t} />

      {/* Experience - Con preámbulo de competencias */}
      <section id="experience" className="py-16 md:py-24 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 2000px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              {t.experience.title}
            </h2>
          </AnimatedSection>

          {/* Preámbulo: Cómo trabajo + Competencias */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12 p-6 rounded-2xl bg-card/50">
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6">
                {t.summary.p2} <span className="text-foreground font-medium">{t.summary.p2Highlight}</span>{t.summary.p2End}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {t.coreCompetencies.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-xl bg-background/50 border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center sm:items-start gap-2 sm:mb-1 sm:min-h-[2.5rem]">
                      <Zap className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors leading-tight">{item.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6 hidden sm:block">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Oracle Health */}
          <AnimatedSection delay={0.1}>
            <div className="mb-16">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.oracleHealth.company}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{t.experience.oracleHealth.location}</span>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.oracleHealth.role}</p>
              <p className="text-sm text-muted-foreground mb-2">{t.experience.oracleHealth.period}</p>
              <p className="text-muted-foreground mb-4">{t.experience.oracleHealth.desc}</p>
              <div className="flex flex-wrap gap-2">
                {t.experience.oracleHealth.skills.map((skill, si) => (
                  <span key={si} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Keany Produce and Gourmet */}
          <AnimatedSection delay={0.15}>
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.keanyProduce.company}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{t.experience.keanyProduce.location}</span>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.keanyProduce.role}</p>
              <p className="text-sm text-muted-foreground mb-2">{t.experience.keanyProduce.period}</p>
              <p className="text-muted-foreground mb-4">{t.experience.keanyProduce.desc}</p>
              <div className="flex flex-wrap gap-2">
                {t.experience.keanyProduce.skills.map((skill, si) => (
                  <span key={si} className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-sm text-muted-foreground text-center">
              <a href={`mailto:${t.email}`} className="text-primary hover:underline">{t.experience.note}</a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 md:py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-2xl font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5 text-primary" />
                </div>
                {t.projects.title}
              </h2>
              <a
                href={`https://${t.projects.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {t.projects.githubLink.split('/').pop()}
              </a>
            </div>
            <p className="text-muted-foreground mb-12">{t.projects.intro}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {t.projects.items.map((project, i) => (
              <AnimatedSection key={project.title} delay={0.1 + i * 0.1}>
                <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-200 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl font-bold">{project.title}</h3>
                    <span className="badge px-2.5 py-1 bg-primary/10 text-primary text-xs shrink-0">{project.badge}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{project.desc}</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
                    {project.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 rounded-md text-xs bg-muted text-foreground">{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      {project.linkLabel || 'View'}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </AnimatedSection>
            ))}

            {/* Placeholder card for future projects */}
            {[0].map((i) => (
              <AnimatedSection key={`placeholder-${i}`} delay={0.2 + i * 0.1}>
                <div className="h-full min-h-[220px] p-6 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <FolderGit2 className="w-6 h-6 mb-3 opacity-40" />
                  <p className="text-sm font-medium">More projects coming soon</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-16 md:py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className={`grid gap-12 ${t.certifications.items.length > 0 ? 'md:grid-cols-2' : 'md:max-w-2xl md:mx-auto'}`}>
            {/* Education */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  {t.education.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {t.education.items.map((item, i) => (
                  <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                    <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-200 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-primary font-medium">{item.year} · {item.org}</span>
                          <h3 className="font-display font-semibold mt-1 group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.desc}
                            {('projectLink' in item && item.projectLink) && (
                              <>
                                {' '}
                                <a
                                  href={`https://${item.projectLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  {item.projectLabel}
                                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Testimonial if exists */}
                      {'testimonial' in item && item.testimonial && (
                        <a href="https://www.linkedin.com/in/ananya-rangaraju/details/recommendations/" target="_blank" rel="noopener noreferrer" className="block group">
                          <blockquote className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:border-[hsl(var(--linkedin)/0.3)] transition-colors">
                            <p className="text-sm text-muted-foreground italic mb-4">
                              "{item.testimonial.quote}"
                            </p>
                            <footer className="flex items-center gap-3">
                              <picture>
                                <source srcSet={item.testimonial.photo.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                                <img src={item.testimonial.photo} alt={item.testimonial.author} className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" decoding="async" />
                              </picture>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground block">{item.testimonial.author}</span>
                                <span className="text-xs text-muted-foreground">{item.testimonial.role}</span>
                              </div>
                              <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))]" />
                            </footer>
                          </blockquote>
                        </a>
                      )}
                    </div>
                  </AnimatedSection>
                ))}

              </div>
            </div>

            {/* Certifications — hidden when empty */}
            {t.certifications.items.length > 0 && (
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  {t.certifications.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-1 rounded-xl overflow-hidden border border-border">
                {t.certifications.items.map((cert, i) => {
                  // Alternate background by logical group: 0-3 tech, 4-7 fluency, 8-10 airtable, 11 make
                  const group = i < 4 ? 0 : i < 8 ? 1 : i < 11 ? 2 : 3
                  const isAlt = group % 2 === 1
                  return (
                  <AnimatedSection key={i} delay={0.1 + i * 0.05}>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className={`flex items-center gap-4 p-4 hover:border-accent/30 transition-colors duration-200 group cursor-pointer ${isAlt ? 'bg-muted/40' : 'bg-card'}`}
                    >
                      <span className="text-sm font-mono text-accent font-medium">{cert.year}</span>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-accent transition-colors">{cert.title}</p>
                        <p className="text-sm text-muted-foreground">{cert.org}</p>
                      </div>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        <CertLogo logo={cert.logo} />
                      </div>
                    </a>
                  </AnimatedSection>
                  )
                })}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="tech" className="py-16 md:py-24 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-12 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              {t.skills.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1}>
              <h3 className="font-display font-semibold mb-4">{t.skills.soft}</h3>
              <div className="flex flex-wrap gap-2">
                {t.skills.softSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="md:col-span-3">
              <h3 className="font-display font-semibold mb-4">{t.techStack.title}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.techStack.categories.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-xl bg-card border border-border">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.name}</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cat.items.map((item) => {
                        const icon = getTechIcon(item)
                        return (
                          <span key={item} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-muted text-foreground">
                            {icon && (
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill={icon.color} aria-hidden="true">
                                <path d={icon.path} />
                              </svg>
                            )}
                            {item}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="contact" className="relative py-16 md:py-24">
        {/* Vignette horizontal — zona limpia central, puntos en bordes */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 25%, hsl(var(--background)) 75%, transparent 100%)',
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t.cta.title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t.cta.desc}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${t.email}`}
                className="btn-pop inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95"
              >
                <Mail className="w-4 h-4" />
                {t.cta.contact}
              </a>
              <a
                href="https://github.com/AnanyaRangaraju"
                target="_blank"
                rel="me noopener noreferrer"
                className="btn-pop inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/ananya-rangaraju/"
                target="_blank"
                rel="me noopener noreferrer"
                className="btn-pop inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground/80 italic">
              {t.cta.footnote}
            </p>
          </AnimatedSection>
          <p className="mt-12 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ananya Rangaraju
            <span className="mx-2 text-border">|</span>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </p>
        </div>
      </footer>

    </main>
  )
}

export default App
