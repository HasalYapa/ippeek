import { NextResponse } from 'next/server';

export interface TracerouteHop {
  hop: number;
  host: string;
  ip: string;
  time: number;
}

export interface TracerouteResult {
  target: string;
  success: boolean;
  hops: TracerouteHop[];
  output: string[];
}

export async function GET(request: Request) {
  try {
    // Get the target from the query string
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    // If no target is provided, return an error
    if (!target) {
      return NextResponse.json(
        { error: 'Target is required' },
        { status: 400 }
      );
    }

    // For security reasons, we'll simulate a traceroute response
    // In a real application, you would use a server-side implementation
    // that executes the traceroute command with proper security measures

    // Simulate traceroute response
    const hopCount = Math.floor(Math.random() * 8) + 5; // Random number of hops between 5-12
    const hops: TracerouteHop[] = [];
    const output: string[] = [`traceroute to ${target}, 30 hops max, 60 byte packets`];

    for (let i = 1; i <= hopCount; i++) {
      const time = Math.floor(Math.random() * 100) + 5; // Random time between 5-105ms
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const host = i === hopCount ? target : `router-${i}.example.com`;

      hops.push({
        hop: i,
        host,
        ip,
        time
      });

      output.push(`${i}  ${host} (${ip})  ${time}.123 ms  ${time + 1}.456 ms  ${time - 1}.789 ms`);
    }

    const result: TracerouteResult = {
      target,
      success: true,
      hops,
      output
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing traceroute:', error);
    return NextResponse.json(
      { error: 'Failed to execute traceroute' },
      { status: 500 }
    );
  }
}
