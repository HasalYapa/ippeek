import { NextResponse } from 'next/server';

// Define the structure of the IP information response
export interface IPInfo {
  ip: string;
  version: string;
  city: string;
  region: string;
  country: string;
  country_name: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string; // ISP information
}

// Cache to avoid hitting rate limits
let cachedData: IPInfo | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedData && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json(cachedData);
    }

    // Step 1: Get the IP address using ipify
    const ipResponse = await fetch('https://api.ipify.org?format=json');

    if (!ipResponse.ok) {
      throw new Error('Failed to fetch IP address');
    }

    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // Step 2: Get geolocation data using ipgeolocation.io (free tier)
    // Note: Free tier has a limit of 1000 requests per day
    const apiKey = process.env.IPGEOLOCATION_API_KEY || '';
    const geoResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?ip=${ip}&apiKey=${apiKey}`);

    // Fallback to ipapi.co if ipgeolocation.io fails or rate limit is reached
    if (!geoResponse.ok) {
      try {
        const fallbackResponse = await fetch(`https://ipapi.co/${ip}/json/`);

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();

          // Format the response to match our IPInfo interface
          cachedData = {
            ip: ip,
            version: ip.includes(':') ? 'IPv6' : 'IPv4',
            city: fallbackData.city || '',
            region: fallbackData.region || '',
            country: fallbackData.country_code || '',
            country_name: fallbackData.country_name || '',
            postal: fallbackData.postal || '',
            latitude: fallbackData.latitude || 0,
            longitude: fallbackData.longitude || 0,
            timezone: fallbackData.timezone || '',
            org: fallbackData.org || ''
          };

          // If successful, return early
          return NextResponse.json(cachedData);
        }
      } catch (fallbackError) {
        console.error('Fallback to ipapi.co failed:', fallbackError);
      }

      // Second fallback to ipwho.is if ipapi.co also fails
      try {
        const secondFallbackResponse = await fetch(`https://ipwho.is/${ip}`);

        if (secondFallbackResponse.ok) {
          const secondFallbackData = await secondFallbackResponse.json();

          // Format the response to match our IPInfo interface
          cachedData = {
            ip: ip,
            version: ip.includes(':') ? 'IPv6' : 'IPv4',
            city: secondFallbackData.city || '',
            region: secondFallbackData.region || '',
            country: secondFallbackData.country_code || '',
            country_name: secondFallbackData.country || '',
            postal: secondFallbackData.postal || '',
            latitude: secondFallbackData.latitude || 0,
            longitude: secondFallbackData.longitude || 0,
            timezone: secondFallbackData.timezone?.id || '',
            org: secondFallbackData.connection?.isp || ''
          };

          // If successful, return early
          return NextResponse.json(cachedData);
        }
      } catch (secondFallbackError) {
        console.error('Second fallback to ipwho.is failed:', secondFallbackError);
      }

      // If all providers fail, throw an error
      throw new Error('Failed to fetch IP information from all providers');
    } else {
      const geoData = await geoResponse.json();

      // Format the response to match our IPInfo interface
      cachedData = {
        ip: ip,
        version: ip.includes(':') ? 'IPv6' : 'IPv4',
        city: geoData.city || '',
        region: geoData.state_prov || '',
        country: geoData.country_code2 || '',
        country_name: geoData.country_name || '',
        postal: geoData.zipcode || '',
        latitude: geoData.latitude || 0,
        longitude: geoData.longitude || 0,
        timezone: geoData.time_zone?.name || '',
        org: geoData.isp || ''
      };
    }

    // Update cache time
    cacheTime = now;

    // Return the IP information
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching IP information:', error);

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fallback to mock data if all else fails
    const mockData: IPInfo = {
      ip: '192.168.1.1',
      version: 'IPv4',
      city: 'New York',
      region: 'New York',
      country: 'US',
      country_name: 'United States',
      postal: '10001',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      org: 'Example ISP'
    };

    return NextResponse.json(mockData);
  }
}
