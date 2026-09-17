# CodeTrack

**Skill & Mentorship Intelligence Platform**

CodeTrack is a demo-ready mentorship and career-guidance application for **Bid2Build — Problem Statement #34**. It helps students and early professionals identify useful next skills, discover mentors aligned with their career goals, and make informed learning decisions.

The application implements **exactly eight purchased Bid2Build features**, with Intelligent Matching at its center. It runs locally without a backend, API keys, authentication setup, or paid services.

## Features

| Purchased feature | Implementation | Where to try it |
| --- | --- | --- |
| Recommendation Engine | Personalized next skills, learning guides, and top mentors based on career goal, current skills, desired skills, interests, and seeded progress | Dashboard and Mentor Matches |
| Intelligent Matching | Ten mentor profiles, calculated match percentages, individual match reasons, and a transparent score breakdown | Mentor Matches → open a mentor profile |
| Comparison Tool | Compare 2–3 mentors across expertise, experience, mentoring focus, and skill alignment; differing rows are highlighted | Mentor Matches → Compare → Compare selected |
| Save-for-Later / Wishlist | Save or remove mentors and learning resources; saved items survive reloads | Saved |
| Standard Report Builder | Generate a snapshot of the profile, recommendations, top three matches, activity counts, saved items, and latest skill progress | Reports → Generate Career & Skill Report |
| Feedback Collection Form | A fixed private feedback form with relevant mentor/resource selection, validation, and submission confirmation | Feedback |
| Activity History Log | Timestamped records of profile edits, mentor/resource views, saves and removals, comparisons, feedback, and report generation | Activity |
| Trend Graph Visualizer | Three charts showing skill progress over time, weekly learning activity, and domain development | Progress |

Basic profile editing supports these features. No unpurchased Bid2Build features are implemented.

## Tech stack

- **React 19 + TypeScript** for the interface and application logic
- **Vite 7** for local development and production builds
- **Recharts 3** for progress visualizations
- **Lucide React** for consistent icons
- **Custom responsive CSS** for desktop, mobile, and print layouts
- **localStorage** for browser-local persistence
- **Node.js test runner + tsx** for regression tests

Navigation uses URL hashes, so application routes work on static hosting without server-side rewrite rules.

## Getting started

### Requirements

Use **Node.js 22.12 or newer** and npm. Internet access is needed for the initial dependency installation. Google Fonts enhance typography when available; system fonts provide a fallback.

### Install and run

From the project directory:

```bash
npm install
npm run dev
```

Open the local address printed by Vite, normally **http://localhost:5173**.

For a loopback-only development server:

```bash
npm run dev -- --host 127.0.0.1
```

### Build and preview

```bash
npm run build
npm run preview
```

The production application is written to `dist/`. Build output and installed dependencies are intentionally excluded from Git; `package-lock.json` is included for reproducible dependency installation.

### Run tests

```bash
npm test
```

The automated tests cover weighted match calculations, ordering and score bounds, profile-driven personalization, empty profiles, persistence round-trips, and malformed stored data.

## How mentor matching works

The matching engine is deterministic and rule-based. Match percentages are calculated from the learner's profile rather than hard-coded.

| Component | Maximum points | Calculation |
| --- | ---: | --- |
| Career/domain alignment | 40 | 40 points when a recognized domain keyword appears in the career goal; otherwise 20 when a mentor skill appears in the goal, or zero |
| Desired skill alignment | 30 | `30 × desired skills covered / desired skills entered` |
| Existing skill overlap | 20 | `20 × overlapping current skills / current skills entered` |
| Interest alignment | 10 | `10 × aligned interests / interests entered` |

Missing fields contribute zero. Skill comparisons are case-insensitive. Domain aliases support terms such as AI, machine learning, cloud, and full stack. The total is rounded to a whole percentage; results are ordered by score, with mentor name as the tie-breaker.

For example, the default profile matches **Ananya Rao at 84%**: 40 career points, 20 desired-skill points, 16 existing-skill points, and 7.5 interest points, rounded from 83.5.

Open a mentor profile to see the component scores and the exact overlaps behind the explanation. Change the career goal, skills, or interests to recalculate both mentor matches and learning recommendations.

## Suggested demo walkthrough

1. Open **Dashboard** and review Aarav Sharma's AI / Machine Learning Engineer profile.
2. Open **Mentor Matches**, then a mentor profile to inspect the calculated score and reasons.
3. Select two or three mentors and choose **Compare selected**.
4. Save a mentor and a learning resource. Open **Saved**, then refresh to demonstrate persistence.
5. Choose **Edit profile** and try a Full Stack Developer goal, Git and TypeScript as current skills, React as a desired skill, and Full Stack as an interest. Observe the new leading mentor and resource recommendations.
6. Open **Progress** to view all three trend charts.
7. Submit private feedback and inspect its timestamped entry in **Activity**.
8. Generate a **Career & Skill Report**, then choose **Print / Save as PDF** using a browser with print support.

## Data and persistence

The initial demo learner is **Aarav Sharma**, a B.Tech Information Technology student. Mentor profiles, learning resources, and historical progress are seeded demonstration records, not a live mentor directory.

- The versioned localStorage key is `codetrack.v1`.
- Profile edits, saved items, comparison selections, activity entries, and feedback persist across refreshes in the same browser and origin.
- Stored records are validated on load, with safe defaults for missing or malformed data.
- A visible message explains when the browser cannot persist changes.
- Feedback remains in the browser; it is not transmitted to mentors or a service.
- Learning resource cards open self-contained starter guides.
- Progress charts show explicitly labeled **April–September 2026 seeded history**. Interactions do not change those historical proficiency values; they appear separately in Activity.
- Reports capture the workspace at generation time. Regenerate after making changes. Reports themselves are held in memory, so generate a new report after a reload.
- The recent activity total covers the preceding 30 days and excludes the activity entry created by generating that report.

The storage adapter is separate from matching logic and seed data so a future backend can replace browser persistence without rewriting the matching engine.

## Project structure

```text
Bid_2_Build/
├── index.html             # Application entry document
├── package.json           # Dependencies and npm scripts
├── package-lock.json      # Locked dependency versions
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── README.md
└── src/
    ├── main.tsx           # React entry point
    ├── App.tsx            # Eight navigation views and connected workflows
    ├── styles.css         # Responsive interface and print styling
    ├── types.ts           # Shared TypeScript data models
    ├── data.ts            # Seeded profile, mentors, resources, and trends
    ├── engine.ts          # Matching and recommendation logic
    ├── storage.ts         # Persistence adapter and validation
    └── engine.test.ts     # Matching and persistence regression tests
```

## Validation

- Production build and all four automated tests pass.
- Browser checks cover profile-driven recommendations, mentor score explanations, 2–3 mentor comparison and removal, saved-item persistence and removal, feedback submission and persistence, activity logging, report generation, and rendered trend charts.
- Responsive behavior was checked at a 390px viewport with no document-level horizontal overflow; the comparison table scrolls horizontally when needed.
- No browser console errors were observed during testing.
- The print action is wired to the browser's native print function with dedicated report styling. Native PDF output was not independently inspected in the embedded browser.

## Prototype boundaries

CodeTrack is a single-user, local prototype. Clearing browser storage removes its persisted data, and separate browsers or origins have separate workspaces. Trend values are illustrative, and mentor matches explain profile overlap rather than guaranteeing real-world suitability. Publishing the application requires hosting its production build; pushing the source to GitHub alone does not deploy it.
