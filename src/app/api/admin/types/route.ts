import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const types = await prisma.personalityType.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(types)
}
