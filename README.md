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

## Architecture & Design Notes

- Data layer separated from UI for easier future ingestion changes  
- Filtering logic modeled on real pantry constraints (short service windows, referral-only programs, delivery sign-up requirements)  
- List view functions as both an accessibility feature and a mobile-friendly alternative to map interaction  

This project was informed by my experience working in food access and community engagement in Chicago.

---

## Scope

**In scope**
- Food pantries and delivery programs  
- Map + list views  
- Structured filtering  

**Intentionally out of scope**
- Other service categories (housing, healthcare, workforce)  
- User accounts or admin interfaces  
- Direct integration with government systems  

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