import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET() {
  try {
    const demands = await prisma.demand.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(demands)
  } catch (error) {
    console.error('Error fetching demands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demands' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      urgency,
      locationText,
      tags,
      category,
      userId
    } = body

    const demand = await prisma.demand.create({
      data: {
        title,
        description,
        type: type || 'GENERAL',
        urgency: urgency || 3,
        locationText,
        tags: JSON.stringify(tags || []),
        category: category || 'general',
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        }
      }
    })

    return NextResponse.json(demand)
  } catch (error) {
    console.error('Error creating demand:', error)
    return NextResponse.json(
      { error: 'Failed to create demand' },
      { status: 500 }
    )
  }
}