# Requirements Document

## Introduction

Restyle WingFantasy to match Red Bull TV mobile UI. Keep all feature logic intact, update only visual design, spacing, and motion. Target iPhone viewports (390px, 430px).

## Glossary

- **WingFantasy**: The fantasy sports app being restyled
- **Red Bull TV UI**: Target design system with dark navy palette and glassmorphic effects
- **Design Tokens**: Colors, typography, spacing, shadows defined in Tailwind config
- **Tab Bar**: Fixed bottom navigation
- **Card**: Rounded container with shadows and gradients
- **Pill**: Small rounded button or tag
- **Glassmorphic**: Backdrop blur with semi-transparent backgrounds

## Requirements

### Requirement 1

**User Story:** As a user, I want Red Bull TV visual styling, so that the app has premium brand aesthetics

#### Acceptance Criteria

1. THE WingFantasy application SHALL apply Red Bull TV color palette with navy backgrounds, red accents, and light text
2. THE WingFantasy application SHALL use 4pt spacing scale and constrain content to max-w-[432px]
3. THE WingFantasy application SHALL apply Inter font with defined heading and body text styles
4. THE WingFantasy application SHALL style buttons as rounded-full with red primary and pill secondary variants

### Requirement 2

**User Story:** As a user, I want cards and containers with depth, so that content hierarchy is clear

#### Acceptance Criteria

1. THE WingFantasy application SHALL apply rb-card gradient backgrounds with rounded-2xl corners and shadow-card
2. THE WingFantasy application SHALL use glassmorphic tab bar with backdrop-filter blur at bottom
3. THE WingFantasy application SHALL display active tab indicator as 4px white pill
4. THE WingFantasy application SHALL apply border-rb-line dividers between sections

### Requirement 3

**User Story:** As a user viewing events, I want status pills and grouped lists, so that I can see what's upcoming vs past

#### Acceptance Criteria

1. THE WingFantasy application SHALL group events under "UPCOMING" and "PAST" headers in red uppercase text
2. WHEN an event is upcoming, THE WingFantasy application SHALL show "Starts in X mins" pill
3. WHEN an event is locked, THE WingFantasy application SHALL show "LOCKED" pill in red text
4. THE WingFantasy application SHALL display event cards with chevron icons and stacked content

### Requirement 4

**User Story:** As a user managing fantasy squads, I want capacity indicators and slot cards, so that I can build teams within budget

#### Acceptance Criteria

1. THE WingFantasy application SHALL display "Used X / Cap" header with red text when over budget
2. THE WingFantasy application SHALL layout slots in 2-column grid on mobile
3. WHEN a slot is filled, THE WingFantasy application SHALL show player chip with name, role, cost, and captain controls
4. WHEN a slot is empty, THE WingFantasy application SHALL show dashed border card with "Add" button

### Requirement 5

**User Story:** As a user, I want smooth interactions and proper mobile sizing, so that the app feels polished

#### Acceptance Criteria

1. THE WingFantasy application SHALL apply active:scale-[0.98] transitions to buttons
2. THE WingFantasy application SHALL ensure 44px minimum touch targets
3. THE WingFantasy application SHALL add safe area padding above tab bar
4. THE WingFantasy application SHALL prevent horizontal scroll on 390px viewport
