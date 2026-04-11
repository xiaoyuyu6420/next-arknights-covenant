import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const body = await request.json()

    const type = await prisma.specialType.update({
      where: { code },
      data: body,
    })

    return NextResponse.json(type)
  } catch (error) {
    console.error('Failed to update special type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
