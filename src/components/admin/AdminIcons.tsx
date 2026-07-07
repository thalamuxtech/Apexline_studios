"use client";

/**
 * Premium animated SVG marks for the Apex-Line studio admin.
 * Each mark draws its geometry on mount and reacts to hover, giving the
 * control room an architectural, blueprint-like character. All strokes use
 * the gold token so they read as one system across the panel.
 *
 * These are intentionally decorative (aria-hidden) — meaningful labels live
 * on the surrounding buttons/headings.
 */
import { motion, type Variants } from "framer-motion";

const GOLD = "#C9A24B";
const GOLD_SOFT = "#E5C98A";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay: i * 0.12, duration: 0.3 },
    },
  }),
};

type MarkProps = { size?: number; className?: string };

function Frame({ size = 44, className, children }: MarkProps & { children: React.ReactNode }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {children}
    </motion.svg>
  );
}

const stroke = {
  stroke: GOLD,
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  variants: draw,
};

/** Compass rose — dashboards / overview */
export function MarkOverview(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.circle cx="24" cy="24" r="18" {...stroke} custom={0} />
      <motion.path d="M24 9 L28 24 L24 39 L20 24 Z" {...stroke} custom={1}
        whileHover={{ rotate: 45, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        style={{ transformOrigin: "24px 24px" }} />
      <motion.circle cx="24" cy="24" r="2.4" fill={GOLD} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 260 }} />
    </Frame>
  );
}

/** Layered plates — projects / portfolio */
export function MarkProjects(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.rect x="10" y="14" width="22" height="26" rx="1.5" {...stroke} custom={0} />
      <motion.rect x="16" y="8" width="22" height="26" rx="1.5" {...stroke} custom={1}
        whileHover={{ x: 2, y: -2, transition: { duration: 0.4 } }} />
      <motion.path d="M20 20 L28 20 M20 25 L32 25" {...stroke} custom={2} />
    </Frame>
  );
}

/** Slider frames — hero */
export function MarkHero(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.rect x="8" y="12" width="32" height="24" rx="1.5" {...stroke} custom={0} />
      <motion.path d="M8 30 L18 22 L24 27 L31 20 L40 28" {...stroke} custom={1} />
      <motion.circle cx="30" cy="19" r="2.6" {...stroke} custom={2}
        whileHover={{ scale: 1.3, transition: { duration: 0.3 } }} style={{ transformOrigin: "30px 19px" }} />
    </Frame>
  );
}

/** Discipline grid — services */
export function MarkServices(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.rect x="9" y="9" width="12" height="12" rx="1.2" {...stroke} custom={0} />
      <motion.rect x="27" y="9" width="12" height="12" rx="1.2" {...stroke} custom={1} />
      <motion.rect x="9" y="27" width="12" height="12" rx="1.2" {...stroke} custom={2} />
      <motion.rect x="27" y="27" width="12" height="12" rx="1.2" {...stroke} custom={3}
        whileHover={{ fill: GOLD, fillOpacity: 0.18, transition: { duration: 0.3 } }} />
    </Frame>
  );
}

/** Quote mark — testimonials */
export function MarkTestimonials(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.path d="M12 30 C12 20 16 15 22 14 M14 30 L20 30 L20 24 L14 24 Z" {...stroke} custom={0} />
      <motion.path d="M28 30 C28 20 32 15 38 14 M30 30 L36 30 L36 24 L30 24 Z" {...stroke} custom={1} />
    </Frame>
  );
}

/** Bar-chart pulse — stats */
export function MarkStats(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.path d="M9 39 L39 39" {...stroke} custom={0} />
      <motion.rect x="13" y="24" width="6" height="15" {...stroke} custom={1}
        whileHover={{ y: -3, height: 18, transition: { duration: 0.3 } }} />
      <motion.rect x="22" y="17" width="6" height="22" {...stroke} custom={2}
        whileHover={{ y: -3, height: 25, transition: { duration: 0.3 } }} />
      <motion.rect x="31" y="28" width="6" height="11" {...stroke} custom={3}
        whileHover={{ y: -3, height: 14, transition: { duration: 0.3 } }} />
    </Frame>
  );
}

/** Studio monogram — site profile */
export function MarkProfile(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.path d="M24 8 L38 34 L10 34 Z" {...stroke} custom={0}
        whileHover={{ scale: 1.04, transition: { duration: 0.4 } }} style={{ transformOrigin: "24px 24px" }} />
      <motion.path d="M17 34 L24 20 L31 34" {...stroke} custom={1} />
      <motion.path d="M14 40 L34 40" {...stroke} custom={2} />
    </Frame>
  );
}

/** Envelope with flap — inbox / leads */
export function MarkInbox(props: MarkProps) {
  return (
    <Frame {...props}>
      <motion.rect x="9" y="13" width="30" height="22" rx="1.6" {...stroke} custom={0} />
      <motion.path d="M9 15 L24 27 L39 15" {...stroke} custom={1}
        whileHover={{ opacity: 0.5, transition: { duration: 0.3 } }} />
      <motion.circle cx="37" cy="13" r="3.4" fill={GOLD} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300 }} />
    </Frame>
  );
}

/**
 * Large decorative hero mark for page headers — a slowly rotating
 * architect's compass over a blueprint ring. Purely ornamental.
 */
export function CompassCrest({ size = 120, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <motion.circle cx="60" cy="60" r="52" stroke={GOLD} strokeWidth="0.75" strokeOpacity="0.4"
        strokeDasharray="2 6" initial={{ rotate: 0 }} animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }} style={{ transformOrigin: "60px 60px" }} />
      <motion.circle cx="60" cy="60" r="40" stroke={GOLD} strokeWidth="0.75" strokeOpacity="0.55"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
      <motion.path d="M60 22 L68 60 L60 98 L52 60 Z" stroke={GOLD} strokeWidth="1" fill={GOLD} fillOpacity="0.06"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
      <motion.path d="M22 60 L98 60" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
      <motion.circle cx="60" cy="60" r="4" fill={GOLD_SOFT}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 1.4, duration: 0.6 }} />
    </svg>
  );
}
