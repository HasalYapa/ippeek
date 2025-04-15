# IPPeek - IP Address Checker Tool

IPPeek is a comprehensive IP address checking tool that provides detailed information about your IP address, location, and network connectivity.

## Features

- **IP Information**: View your IP address, version (IPv4/IPv6), location, and ISP details
- **Location Map**: Visualize your IP location on an interactive map
- **Global IP Connectivity**: See how your IP connects to major internet hubs worldwide
- **Advanced Tools**:
  - VPN Detection: Check if your connection is using a VPN or proxy
  - Blacklist Checker: Verify if your IP is on common spam blacklists
  - Network Tools: Run ping and traceroute operations
  - Browser Fingerprinting: Analyze your browser's unique fingerprint

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Leaflet (for maps)
- shadcn/ui components
- dotted-map (for world map visualization)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HasalYapa/ippeek.git
   cd ippeek
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   IPGEOLOCATION_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHasalYapa%2Fippeek)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [ipapi.co](https://ipapi.co/) for IP geolocation data
- [ipify.org](https://www.ipify.org/) for IP address detection
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
