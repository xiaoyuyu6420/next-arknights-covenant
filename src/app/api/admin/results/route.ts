import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 20)))
  const type = searchParams.get('type') || undefined

  const where = type ? { resultCode: type } : {}

  const [records, total] = await Promise.all([
    prisma.testRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.testRecord.count({ where }),
  ])

  return NextResponse.json({
    records,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
