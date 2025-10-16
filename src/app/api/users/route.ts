import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        locationText: true,
        trustLevel: true,
        helpCount: true,
        receiveCount: true,
        skills: true,
        onlineStatus: true
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, locationText, skills } = body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        locationText,
        skills: JSON.stringify(skills || []),
        trustLevel: 0,
        helpCount: 0,
        receiveCount: 0,
        onlineStatus: false
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}