import { NextResponse } from 'next/server';

export interface VPNDetectionResult {
  ip: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isBot: boolean;
  isCrawler: boolean;
  fraudScore: number;
  mobile: boolean;
  host: string;
  isp: string;
  country: string;
  city: string;
  region: string;
  message: string;
  success: boolean;
  debug?: {
    headers: {
      [key: string]: string;
    };
    source: string;
    error?: string;
    rawResponse?: any;
  };
}

// Cache to avoid hitting rate limits
const cache = new Map<string, { data: VPNDetectionResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function GET(request: Request) {
  try {
    // Get the IP from the query string
    const { searchParams } = new URL(request.url);
    let ip = searchParams.get('ip');

    // If no IP is provided, try to get it from the request headers
    if (!ip) {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '';
    }

    // If we still don't have an IP, return an error
    if (!ip) {
      return NextResponse.json(
        {
          success: false,
          message: 'IP address is required',
          debug: {
            headers: {
              'x-forwarded-for': request.headers.get('x-forwarded-for') || 'not present',
              'x-real-ip': request.headers.get('x-real-ip') || 'not present',
              'cf-connecting-ip': request.headers.get('cf-connecting-ip') || 'not present',
              'true-client-ip': request.headers.get('true-client-ip') || 'not present',
            },
            source: 'error',
            error: 'No IP address provided or detected'
          }
        },
        { status: 400 }
      );
    }

    // Check if we have cached data for this IP
    const now = Date.now();
    const cacheKey = ip;
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry && now - cachedEntry.timestamp < CACHE_DURATION) {
      console.log(`Using cached VPN detection data for IP: ${ip}`);
      return NextResponse.json(cachedEntry.data);
    }

    // Get user agent and language from the request
    const userAgent = request.headers.get('user-agent') || '';
    const language = request.headers.get('accept-language') || '';

    // Call the IPQualityScore API
    const apiKey = 'ZUjabfXozZ1bUzmGnXKlG3zYBB3cqnWn';
    const strictness = 1;
    const allowPublicAccessPoints = 'true';

    const url = `https://www.ipqualityscore.com/api/json/ip/${apiKey}/${ip}?user_agent=${encodeURIComponent(userAgent)}&user_language=${encodeURIComponent(language)}&strictness=${strictness}&allow_public_access_points=${allowPublicAccessPoints}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`IPQualityScore API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Format the response
    const result: VPNDetectionResult = {
      success: true,
      ip: ip,
      isVpn: data.vpn || false,
      isProxy: data.proxy || false,
      isTor: data.tor || false,
      isCrawler: data.is_crawler || false,
      isBot: data.bot_status || false,
      fraudScore: data.fraud_score || 0,
      mobile: data.mobile || false,
      host: data.host || '',
      isp: data.ISP || '',
      country: data.country_code || '',
      city: data.city || '',
      region: data.region || '',
      message: data.proxy || data.vpn || data.tor || data.fraud_score >= 75
        ? 'This IP address appears to be using anonymizing services.'
        : 'No anonymizing services detected.',
      debug: {
        headers: {
          'x-forwarded-for': request.headers.get('x-forwarded-for') || 'not present',
          'x-real-ip': request.headers.get('x-real-ip') || 'not present',
          'cf-connecting-ip': request.headers.get('cf-connecting-ip') || 'not present',
          'true-client-ip': request.headers.get('true-client-ip') || 'not present',
        },
        source: 'ipqualityscore',
        rawResponse: data
      }
    };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: now });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error detecting VPN:', error);

    // Return an error response
    return NextResponse.json(
      {
        success: false,
        ip: '',
        isVpn: false,
        isProxy: false,
        isTor: false,
        isCrawler: false,
        isBot: false,
        fraudScore: 0,
        mobile: false,
        host: '',
        isp: '',
        country: '',
        city: '',
        region: '',
        message: 'Failed to detect VPN',
        debug: {
          headers: {
            'x-forwarded-for': request.headers.get('x-forwarded-for') || 'not present',
            'x-real-ip': request.headers.get('x-real-ip') || 'not present',
            'cf-connecting-ip': request.headers.get('cf-connecting-ip') || 'not present',
            'true-client-ip': request.headers.get('true-client-ip') || 'not present',
          },
          source: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}
