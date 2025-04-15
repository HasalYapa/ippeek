import { NextResponse } from 'next/server';

export interface VPNDetectionResult {
  ip: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
  riskScore: number;
  message: string;
}

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

    // For demonstration purposes, we'll simulate a VPN detection
    // In a real application, you would use a VPN detection API service

    // Simulate detection based on the IP
    // For demo purposes, we'll consider IPs ending with .200 as VPN
    // and IPs ending with .150 as proxies
    const isVpn = ip.endsWith('.200');
    const isProxy = ip.endsWith('.150');
    const isTor = ip.includes('176.10.') || ip.includes('185.220.');
    const isHosting = ip.includes('13.') || ip.includes('52.') || ip.includes('34.');

    // Calculate a risk score (0-100)
    let riskScore = 0;
    if (isVpn) riskScore += 40;
    if (isProxy) riskScore += 30;
    if (isTor) riskScore += 20;
    if (isHosting) riskScore += 10;

    // Generate a message based on the detection
    let message = 'No anonymizing services detected.';
    if (isVpn || isProxy || isTor) {
      message = 'This IP address appears to be using anonymizing services.';
    }

    const result: VPNDetectionResult = {
      ip,
      isVpn,
      isProxy,
      isTor,
      isHosting,
      riskScore,
      message
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error detecting VPN:', error);
    return NextResponse.json(
      { error: 'Failed to detect VPN' },
      { status: 500 }
    );
  }
}
