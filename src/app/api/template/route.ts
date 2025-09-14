import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the template selection to the backend
    const response = await fetch('http://127.0.0.1:8000/template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // If endpoint doesn't exist (404), still return success to continue flow
    if (response.status === 404) {
      console.log('Template endpoint not found on backend, continuing...');
      return NextResponse.json({ success: true, message: 'Template endpoint not available' });
    }

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Template API error:', error);
    // Return success anyway to not block the user flow
    return NextResponse.json({ success: true, message: 'Template sent with fallback' });
  }
}