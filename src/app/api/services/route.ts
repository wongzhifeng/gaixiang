import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
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

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
      locationText,
      tags,
      category,
      availableFrom,
      availableTo,
      userId
    } = body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        type: type || 'GENERAL',
        locationText,
        tags: JSON.stringify(tags || []),
        category: category || 'general',
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null,
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

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}