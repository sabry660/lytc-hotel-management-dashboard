# LYTC Hotel Management Dashboard

A comprehensive luxury hotel management dashboard built by LYTC, featuring an integrated system for room management, reservations, guest requests, housekeeping, financial services, and analytics. The application is designed entirely in Arabic to serve the Middle Eastern hospitality market.

## Features

- **Room Management**: Complete oversight of room status, occupancy, and maintenance
- **Reservation System**: Streamlined booking management and guest check-in/check-out processes
- **Guest Services**: Efficient handling of guest requests and service orders
- **Housekeeping Coordination**: Real-time room cleaning status and staff assignment
- **Financial Analytics**: Comprehensive reporting on revenue, expenses, and performance metrics
- **Arabic Interface**: Full Arabic language support with RTL (right-to-left) layout
- **Modern UI**: Built with React 19, Tailwind CSS, and Motion for smooth animations
- **AI Integration**: Powered by Google Gemini AI for intelligent insights and automation

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI SDK
- **Backend**: Express.js for server-side operations

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Google Gemini API Key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
Dashboard/
├── public/              # Static assets (logo, images)
├── src/
│   ├── components/      # Reusable React components
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── data.ts         # Mock data and constants
│   ├── types.ts        # TypeScript type definitions
│   └── index.css       # Global styles
├── index.html          # HTML template with SEO meta tags
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## Browser Support

The application supports all modern browsers including Chrome, Firefox, Safari, and Edge.

## License

Proprietary - Copyright LYTC

## Support

For technical support or inquiries, please contact the LYTC development team.
