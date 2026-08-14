"use client";

import { MotionConfig } from "framer-motion";

/**
 * Reduced-motion is handled here rather than by branching JSX on
 * `useReducedMotion()` — that hook reports `false` during SSR and `true`
 * on a reduced-motion client, so branching on it renders different markup
 * on each side and breaks hydration.
 *
 * `reducedMotion="user"` drops transform animations for those users while
 * keeping opacity, so content still arrives; the purely decorative loops
 * (ticker, level bars, loop pulse) are switched off in CSS instead.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
