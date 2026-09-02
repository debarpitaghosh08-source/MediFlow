# MediFlow - Smart Hospital Automation System

A fully functional, interactive web application prototype for a smart hospital automation system built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Features

- **Role-Based Access**: Patient, Doctor, and Receptionist (Admin) dashboards
- **Authentication**: Google OAuth, Facebook OAuth, Phone OTP, Hospital ID login (simulated)
- **Public Pages**: Home, About, Contact, Search Doctors with booking
- **Patient Dashboard**: Medication timeline, appointments, prescriptions, visit history, notifications
- **Doctor Dashboard**: Daily schedule, patient roster, profile, appointments
- **Admin Dashboard**: Bed/ward management, appointment queue, patient search, doctor overview
- **Real Backend**: File-based JSON database with full CRUD API routes
- **Animations**: Framer Motion powered transitions, hover effects, and micro-interactions
- **Glassmorphism UI**: Modern translucent card design with gradient backgrounds

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Lucide React | Icons |
| UUID | Unique ID generation |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Extract the zip file
cd mediflow

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

### Demo Login Credentials

Click **Quick Demo Login** buttons on the login page, or use these Hospital IDs:

| Role | Hospital ID | Email |
|------|-------------|-------|
| Patient | `HOSP-2024-001` | john.anderson@email.com |
| Doctor | `HOSP-DOC-001` | sarah.mitchell@mediflow.com |
| Admin | `HOSP-ADM-001` | admin@mediflow.com |

You can also switch roles anytime from the **Role Switcher Dropdown** in the top navigation bar after logging in.

## Project Structure

```
mediflow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # Authentication endpoint
│   │   │   ├── doctors/        # Doctor CRUD
│   │   │   ├── patients/       # Patient CRUD
│   │   │   ├── appointments/   # Appointment booking
│   │   │   ├── prescriptions/  # Prescriptions
│   │   │   ├── beds/           # Bed management
│   │   │   ├── roster/         # Doctor roster
│   │   │   ├── visitHistories/ # Visit history
│   │   │   └── notifications/  # Notifications
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── login/              # Login page
│   │   ├── doctors/            # Search doctors
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── dashboard/          # Role-based dashboard
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── AuthContext.tsx     # Authentication context
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Footer.tsx          # Footer
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   └── ReceptionistDashboard.tsx
│   ├── lib/
│   │   ├── db.ts               # File-based database
│   │   ├── mockData.ts         # Seed data
│   │   └── utils.ts            # Utilities
│   └── types/
│       └── index.ts            # TypeScript types
├── data/                       # JSON data storage (auto-created)
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.local
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | POST | Login (google, facebook, phone, hospitalId, demo) |
| `/api/doctors` | GET | List/filter doctors |
| `/api/patients` | GET, PATCH | Get/update patients |
| `/api/appointments` | GET, POST, PATCH | Manage appointments |
| `/api/prescriptions` | GET | Get prescriptions |
| `/api/beds` | GET, PATCH | Bed management |
| `/api/roster` | GET, POST | Doctor roster |
| `/api/visitHistories` | GET | Visit history |
| `/api/notifications` | GET, PATCH | Notifications |

## Data Persistence

All data is stored in JSON files under the `/data` directory. The database layer (`src/lib/db.ts`) automatically:
- Creates JSON files from mock data on first run
- Reads/writes data for all CRUD operations
- Persists changes across server restarts

## Customization

- **Colors**: Edit `tailwind.config.js` and `src/app/globals.css`
- **Mock Data**: Edit `src/lib/mockData.ts`
- **Animations**: Adjust Framer Motion props in components

## License

MIT - Built for demonstration purposes.
