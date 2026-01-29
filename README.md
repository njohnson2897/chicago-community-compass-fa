# Chicago Community Compass – Food Access

A small app for finding food pantries and delivery programs in Chicago. Search by address or ZIP, filter by hours and delivery, and see results on a map or in a list. I built it as a portfolio piece for civic and social-service tech roles.

**Live demo:** https://chicago-community-compass-fa.onrender.com

---

## What it does

Food pantry info in Chicago is scattered. This puts location, hours, eligibility, and delivery options in one place. You enter an address or ZIP, pick a radius, and get a map plus list. Filters let you narrow by “open today,” referral requirements, and home delivery. The list view is there for accessibility and for people who prefer not to use the map.

**Tech:** React 18, Material-UI, Mapbox (map + geocoding), Vite. Data is static for now; the shape of it could be swapped for live feeds from the city or nonprofits later.

## Scope

**In scope:** Food pantries and delivery programs only. Map and list. Filters for open today, referral, delivery, and location (address/ZIP + radius). Static data with a realistic structure.

**Out of scope (on purpose):** Other service types (housing, health, jobs). Logins. Admin UI. Direct hooks into government systems.

More on who it’s for and where it could go: see the [About page](./src/pages/About.jsx) in the app.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Mapbox account (free tier is sufficient)

### Installation

1. Clone or navigate to the project directory:

```bash
cd chicago-community-compass-FA
```

2. Install dependencies:

```bash
npm install
```

3. Set up Mapbox access token:
   - Sign up for a free account at [mapbox.com](https://www.mapbox.com)
   - Create a `.env` file in the project root:

   ```
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
chicago-community-compass-FA/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Layout.jsx       # Main app layout with navigation
│   │   ├── FilterPanel.jsx  # Filter controls
│   │   ├── ResourceMap.jsx  # Mapbox map component
│   │   └── ResourceList.jsx # List view fallback
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── MapView.jsx      # Main resource discovery page
│   │   ├── ServiceDetails.jsx # Individual resource details
│   │   ├── About.jsx        # Project scope and documentation
│   │   └── NotFound.jsx     # 404 page
│   ├── data/                # Data layer and static data
│   │   ├── foodResourcesService.js  # Normalization and API
│   │   └── pantryData.json          # Pantry list (with coordinates)
│   ├── utils/               # Utility functions
│   │   └── filterResources.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   ├── theme.js             # Material-UI theme configuration
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Tech Stack

- **React 18** – UI
- **React Router 6** – Client-side routing
- **Material-UI (MUI)** – Components and styling
- **Mapbox GL JS** – Interactive map and geocoding
- **Vite** – Build and dev server

## Data model

Each resource has name, address (with coordinates for the map), hours by day, contact info, and flags for referral and delivery. The shape matches how pantries actually run—short hours, referral-only programs, delivery signup—so filters stay useful.

## Design choices

I kept the UI simple and focused. List view doubles as an accessible fallback and works well on small screens. The data model and filters (hours, referral, delivery) match how pantries actually work—short windows, referral-only programs, etc. The code is split so the data layer, filters, and UI are easy to change or extend.

I’ve worked in food access and community engagement at a Chicago nonprofit; that context shaped what’s in scope and how the filters behave.

## Possible next steps

Right now it’s food access only. The same patterns could extend to housing, health, workforce, or legal aid. Other directions: user accounts, provider-facing updates, live data from the city or nonprofits, multiple languages. The [About page](./src/pages/About.jsx) in the app goes into more detail.

---

**Data:** The pantry list is from a consolidated static dataset. Hours and rules change—always confirm with the organization before visiting or referring someone. A real deployment would ideally pull from city or nonprofit feeds.
