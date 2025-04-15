import { NextResponse } from 'next/server';

export interface BlacklistCheckResult {
  ip: string;
  isListed: boolean;
  listedOn: string[];
  message: string;
}

// Common blacklist services used for the simulation
const BLACKLIST_SERVICES = [
  'zen.spamhaus.org',
  'bl.spamcop.net'
];

export async function GET(request: Request) {
  try {
    // Get the IP from the query string
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    // If no IP is provided, return an error
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    // For demonstration purposes, we'll simulate a blacklist check
    // In a real application, you would perform actual DNS lookups against DNSBL services

    // Simulate a check based on the IP
    // For demo purposes, we'll consider IPs ending with .100 as blacklisted
    const isListed = ip.endsWith('.100');
    const listedOn = isListed ? BLACKLIST_SERVICES : [];

    const result: BlacklistCheckResult = {
      ip,
      isListed,
      listedOn,
      message: isListed
        ? 'This IP address is listed on one or more blacklists.'
        : 'This IP address is not listed on any known blacklists.'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to check blacklist' },
      { status: 500 }
    );
  }
}
