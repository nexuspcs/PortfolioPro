# PortfolioPro

PortfolioPro is a React-based personal finance dashboard for tracking portfolio allocation, value history, stock pricing, foreign exchange rates, and related news.

## Public Release Readiness

This repository has been prepared for public publication with the following expectations:

- API keys are **not** committed to source control.
- Runtime API configuration is provided through environment variables.
- Build artifacts are not tracked by Git.

## Tech Stack

- React 17 (Create React App)
- TypeScript (mixed JS/TS codebase)
- Recharts
- Axios
- dayjs / moment-timezone

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Required Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_TRADERMADE_API_KEY=your_tradermade_key
REACT_APP_FMP_API_KEY=your_financialmodelingprep_key
REACT_APP_POLYGON_API_KEY=your_polygon_key
REACT_APP_MARKETAUX_API_KEY=your_marketaux_key
```

> React only exposes variables prefixed with `REACT_APP_` to browser code.

### Run Locally

```bash
npm start
```

### Test

```bash
CI=true npm test -- --watch=false
```

### Build

```bash
npm run build
```

## Legal

- Terms and conditions: [terms/terms.md](terms/terms.md)
- Privacy agreement: [privacy/privacy.md](privacy/privacy.md)

## Contact

- LinkedIn: [James Coates](https://www.linkedin.com/in/jamescoatesaus/)
