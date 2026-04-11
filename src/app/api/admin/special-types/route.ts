import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const types = await prisma.specialType.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(types)
}
