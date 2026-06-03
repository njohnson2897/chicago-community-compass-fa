# Chicago Community Compass – Food Access

A data-driven civic web application for locating food access resources across Chicago.

This project explores how geospatial interfaces and realistic filtering can reduce friction in navigating fragmented food pantry and delivery systems.

**Live Demo:**  
https://chicago-community-compass-fa.onrender.com

---

## Problem Context

Food pantry information in Chicago is distributed across multiple networks and independent community providers. Hours, referral requirements, and delivery options vary significantly, making discovery difficult for residents and caseworkers.

This project consolidates that information into a searchable, map-based interface designed around how pantries actually operate.

---

## What It Does

- Search by address or ZIP code with adjustable radius  
- View results on an interactive Mapbox map or accessible list view  
- Filter by:
  - Open today  
  - Referral required  
  - Home delivery available  
- View structured details for each resource  

---

## Tech Stack

- React 18  
- React Router 6  
- Material UI  
- Mapbox GL JS (map + geocoding)  
- Vite  

Data is currently static but structured to support future integration with live city or nonprofit feeds.

---

## Data Pipeline

Raw pantry data is stored as JSON and normalized at startup via `foodResourcesService.js`, which transforms each record into a consistent internal shape:

- Address strings are parsed into structured components
- Free-text hours like `"Monday 2:00 PM - 4:00 PM"` are parsed into a structured weekly schedule
- Geocoded coordinates are attached when available
- Programs are inspected to derive delivery availability and referral requirements

The normalized resources are filtered client-side by `filterUtils.js` based on location radius, resource type, and availability.

---

## Architecture & Design Notes

- Data layer separated from UI for easier future ingestion changes  
- Filtering logic modeled on real pantry constraints (short service windows, referral-only programs, delivery sign-up requirements)  
- List view functions as both an accessibility feature and a mobile-friendly alternative to map interaction  

This project was informed by my experience working in food access and community engagement in Chicago.

---

## Scope & Project History

This project was scoped down from a broader **Chicago Community Compass**, a multi-service civic navigator covering food access, benefits navigation, housing support, and workforce development. After assessing what was achievable as a solo project, I made a deliberate decision to build one focused, deployable vertical rather than an immense, incomplete one.

Food access was the natural starting point given my background at the Greater Chicago Food Depository.

**Currently in scope**
- Food pantries, community fridges, and delivery programs
- Map + list views
- Structured filtering

**Plans for future expansion**
- Additional service verticals (benefits, housing, workforce)
- Live data feeds from city or nonprofit APIs
- Admin interface for partner organizations

---

## Local Development

```bash
npm install
npm run dev
```

Create a .env file with:

```env
VITE_MAPBOX_ACCESS_TOKEN=your_token_here
```

---

## Tests

Unit tests cover the core filtering logic using Vitest.

```bash
npm test
```