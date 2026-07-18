# UI/UX Implementation Plan

## Final handoff - completed July 18, 2026

Implementation and verification are complete. Populated desktop, tablet, mobile, keyboard, modal-focus, screen-reader, empty-state, validation, and data-regression walkthroughs passed. Temporary audit accounts and their related records were removed successfully.

Final verification results:

- [x] Client production build passes.
- [x] Client lint passes.
- [x] Server TypeScript check passes.
- [x] Analytics charts retain positive dimensions at 1440 x 1000, 820 x 1180, and 390 x 844.
- [x] No Recharts container-size warnings remain while switching responsive viewports.
- [x] No horizontal overflow was found at the verified breakpoints.

Final fixes completed:

- Moved budget, goal, deposit, and export dialog semantics/focus traps onto the actual panels.
- Added accessible close labels and goal progressbar semantics.
- Made the affected dialogs and drawers mobile-safe.
- Updated account deletion to remove transactions, budgets, and goals before removing the user.
- Added stable initial chart dimensions to prevent transient responsive-container warnings.

Light-theme forest refinement:

- Rebalanced the light canvas toward warm paper while retaining the original saturated emerald particle system as the product's signature visual.
- Preserved the original full-screen distribution, particle density, bloom, shimmer, drift, and pointer response in both themes.
- Restored the client-supplied `AnimatedBackground` component verbatim.
- Removed the dark-theme fractal-noise layer that made the background appear blurred while preserving its gradient and particles.
- Upgraded the moss engine with three crisp depth layers, loose organic clusters, cursor wake and recovery, seamless light/dark color morphing, content-aware particle attenuation, and success-event blooms.
- Added a gentle reduced-motion drift, hidden-tab pausing, responsive density, and device-pixel-ratio limits to keep the richer animation accessible and efficient without freezing its signature particles.
- Cleared cancelled animation-frame state during effect cleanup so React development-mode remounts reliably restart particle motion.
- Restored mouse and pen interaction in reduced-motion environments with a gentler wake, plus persistent nearby displacement while the pointer rests over the particle field.
- Added an original generated landscape "living financial forest" authentication hero composed for the panel ratio, with a quiet text-safe area, slow parallax, layered light movement, and floating emerald spores.
- Added a 3840 × 2880 high-detail hero variant for every desktop display and moved animation off the base artwork onto the spores and sheen, preventing fractional transform resampling from softening the moss.
- Replaced the generic wallet brand icon with the exact original “Moss Ledger” spiral-and-leaf artwork across desktop navigation, mobile navigation, authentication, Settings, and the browser favicon.
- Normalized the logo canvas for true centering and added a dedicated high-contrast mint favicon for dark browser chrome.

This document is the source of truth for the Expense Tracker interface refinement. Work is implemented in the order below. Update the status and verification notes whenever an item changes.

## Status legend

- `[x]` Complete and verified
- `[-]` In progress
- `[ ]` Pending

## Product direction

Create a calm personal-finance workspace that helps individuals understand their current position, act quickly, and build better financial habits. Preserve all existing transaction, budget, goal, analytics, profile, theme, and account functionality.

## Phase 1 - Shared foundation

- [x] Establish color, spacing, radius, surface, and typography tokens.
- [x] Standardize buttons, inputs, cards, page headers, loaders, errors, and empty states.
- [x] Add visible keyboard focus and reduced-motion behavior.
- [x] Reduce decorative background competition with financial data.
- [x] Create a desktop sidebar, mobile app bar, and labeled mobile navigation.
- [x] Verify layouts at 390px and 1440px without horizontal overflow.

## Phase 2 - System feedback and validation

- [x] Add one accessible global notification system for success and failure feedback.
  - [x] Expenses: create, update, and delete notifications.
  - [x] Budgets: create, update, and delete notifications.
  - [x] Goals: create, update, deposit, withdraw, and delete notifications.
  - [x] Profile: save and security notifications.
  - [x] Authentication: account-created confirmation on the login screen.
- [x] Standardize inline validation messages and `aria-describedby` relationships.
- [x] Prevent duplicate submissions consistently across feature forms.
- [x] Add retry actions to feature-level request errors.

## Phase 3 - Dashboard

- [x] Reframe the screen around financial position and next actions.
- [x] Preserve period filtering, KPIs, budget health, recent transactions, and recurring bills.
- [x] Improve first-run dashboard guidance with a short three-step onboarding path.
- [x] Add contextual links from warning states to the exact corrective action.

## Phase 4 - Expenses

- [x] Add purpose-built mobile transaction cards.
- [x] Label search and filtering controls.
- [x] Add first-run and no-results states with recovery actions.
- [x] Disable export when no transactions exist.
- [x] Add an active-filter summary with individual removable filter chips.
- [x] Preserve the user's preferred page size between sessions.

## Phase 5 - Budgets

- [x] Clarify month navigation and first-budget creation.
- [x] Preserve summaries, category usage, editing, and deletion.
- [x] Add a direct "review transactions" action to near-limit and over-budget categories.
- [x] Improve status explanations for near-limit and exceeded budgets.

## Phase 6 - Goals

- [x] Simplify goal hierarchy and first-goal creation.
- [x] Preserve filtering, roadmap selection, deposits, withdrawals, editing, and deletion.
- [x] Explain the optional transaction-recording side effect before submission.
- [x] Add completion celebration and a clear next action.

## Phase 7 - Analytics

- [x] Align hierarchy and spacing with the application shell.
- [x] Replace zero-only chart rendering with a meaningful empty state.
- [x] Add plain-language chart summaries for screen readers.
- [x] Add an explicit comparison explanation when a prior period is unavailable.

## Phase 8 - Authentication, profile, and settings

- [x] Build product-specific sign-in and account-creation layouts.
- [x] Add autocomplete metadata and password guidance.
- [x] Remove unsupported social login and password-recovery affordances.
- [x] Clarify fixed regional defaults in Settings.
- [x] Align Profile with the shared page hierarchy.
- [x] Add image file size/type validation before profile preview.
- [x] Add unsaved-change protection when leaving profile edit mode.
- [x] Ensure account deletion also removes all related transactions, budgets, and goals.

## Verification checklist

- [x] `npm run build`
- [x] `npm run lint`
- [x] Desktop visual review at 1440 x 1000
- [x] Tablet visual review at 820 x 1180
- [x] Mobile visual review at 390 x 844
- [x] Empty dashboard, expenses, budgets, goals, and analytics review
- [x] Keyboard-only walkthrough of every modal and drawer
- [x] Screen-reader labels and live-region walkthrough
- [x] Populated-data regression review
