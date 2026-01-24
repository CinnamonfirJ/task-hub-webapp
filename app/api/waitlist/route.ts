import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address so we can reach you.' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_BASE_API;
    
    if (!backendUrl) {
      console.error('NEXT_BASE_API is not defined');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    const response = await fetch(`${backendUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.message || 'Something went wrong on the server. Please try again.' },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 200 })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
