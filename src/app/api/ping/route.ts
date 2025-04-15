import { NextResponse } from 'next/server';

export interface PingResult {
  target: string;
  success: boolean;
  time: number;
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

    // For security reasons, we'll simulate a ping response
    // In a real application, you would use a server-side implementation
    // that executes the ping command with proper security measures

    // Simulate ping response
    const success = Math.random() > 0.1; // 90% success rate for simulation
    const pingTime = Math.floor(Math.random() * 100) + 10; // Random time between 10-110ms

    const output = [
      `PING ${target} (${target}): 56 data bytes`,
      `64 bytes from ${target}: icmp_seq=0 ttl=55 time=${pingTime}.123 ms`,
      `64 bytes from ${target}: icmp_seq=1 ttl=55 time=${pingTime + 2}.456 ms`,
      `64 bytes from ${target}: icmp_seq=2 ttl=55 time=${pingTime - 1}.789 ms`,
      `64 bytes from ${target}: icmp_seq=3 ttl=55 time=${pingTime + 1}.012 ms`,
      '',
      `--- ${target} ping statistics ---`,
      `4 packets transmitted, 4 packets received, 0.0% packet loss`,
      `round-trip min/avg/max/stddev = ${pingTime - 1}.789/${pingTime}.845/${pingTime + 2}.456/1.234 ms`
    ];

    const result: PingResult = {
      target,
      success,
      time: pingTime,
      output: success ? output : [`Request timed out for ${target}`]
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing ping:', error);
    return NextResponse.json(
      { error: 'Failed to execute ping' },
      { status: 500 }
    );
  }
}
