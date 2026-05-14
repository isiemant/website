/* ─────────────────────────────────────────────────────────────
   js/constants.js — Shared numeric constants
   Centralising magic numbers makes intent clear and ensures
   consistency across the three parallel widget patterns
   (slideshow, carousel, story modal).
───────────────────────────────────────────────────────────── */

// ── Slideshow / Carousel ──────────────────────────────────────

/** Milliseconds between automatic slide advances. */
export const SLIDE_INTERVAL = 4000;

/** Minimum horizontal drag distance (px) to count as a swipe. */
export const SWIPE_THRESHOLD = 40;

/** Gap between timeline cards in the updates carousel (px). */
export const CAROUSEL_GAP = 20;

/**
 * Duration of the carousel slide transition (ms).
 * Matches the cubic-bezier spring in carousel.js.
 */
export const CAROUSEL_TRANSITION_MS = 480;

/**
 * Busy-lock duration (ms) — slightly longer than CAROUSEL_TRANSITION_MS
 * to account for easing overshoot at the tail of the spring curve,
 * ensuring the lock is released only after the animation fully settles.
 */
export const CAROUSEL_BUSY_LOCK_MS = 530;


// ── Scroll & Parallax ────────────────────────────────────────

/** Scroll multiplier for the hero parallax effect. */
export const PARALLAX_FACTOR = 0.12;

/** Maximum downward shift (px) for the hero parallax — prevents overflow on very long pages. */
export const PARALLAX_MAX_SHIFT = 60;


// ── Cyclops Eye ──────────────────────────────────────────────

/** Maximum distance (px) the pupil travels from the eyeball centre. */
export const PUPIL_MAX_RADIUS = 16;

/** Duration (ms) the eyelid stays fully closed during a blink. */
export const BLINK_CLOSE_MS = 230;

/**
 * Pause (ms) after the eyelid reopens before the next blink is scheduled.
 * Must be > BLINK_CLOSE_MS so the eye looks fully open before blinking again.
 */
export const BLINK_REOPEN_MS = 260;

/** Minimum delay (ms) between blinks for a natural look. */
export const BLINK_MIN_DELAY = 2000;

/** Random additional delay (ms) added on top of BLINK_MIN_DELAY. */
export const BLINK_JITTER = 3200;


// ── Intersection Observers ───────────────────────────────────

/**
 * Fraction of an element that must be visible before the
 * scroll-reveal animation fires (general content).
 */
export const REVEAL_THRESHOLD = 0.12;

/**
 * Fraction of the cyclops element that must be visible before
 * its entrance animation fires.  Higher than REVEAL_THRESHOLD
 * so the full eye is on-screen before it animates in.
 */
export const CYCLOPS_THRESHOLD = 0.5;

// ── Cache busting ─────────────────────────────────────────────
/**
 * Replaced at deploy time by the CI workflow with the Git commit SHA.
 * Appended as ?v=<sha> to CSV fetch URLs so browsers always load fresh
 * data after a push, without requiring a manual hard reload.
 */
export const CACHE_BUST = '__CACHE_BUST__';
