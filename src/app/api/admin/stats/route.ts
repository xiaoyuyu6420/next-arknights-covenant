import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const totalTests = await prisma.testRecord.count()

  // Type distribution
  const typeDistribution = await prisma.testRecord.groupBy({
    by: ['resultCode', 'resultName'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  // Daily trend - last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentRecords = await prisma.testRecord.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by date
  const dailyTrend: Record<string, number> = {}
  for (const r of recentRecords) {
    const date = r.createdAt.toISOString().split('T')[0]
    dailyTrend[date] = (dailyTrend[date] || 0) + 1
  }

  // Unique users
  const uniqueUsers = await prisma.testRecord.groupBy({
    by: ['userId'],
  })

  // Average similarity
  const avgResult = await prisma.testRecord.aggregate({
    _avg: { similarity: true },
  })

  return NextResponse.json({
    totalTests,
    uniqueUsers: uniqueUsers.length,
    avgSimilarity: Math.round((avgResult._avg.similarity || 0) * 10) / 10,
    typeDistribution: typeDistribution.map(t => ({
      code: t.resultCode,
      name: t.resultName,
      count: t._count.id,
    })),
    dailyTrend: Object.entries(dailyTrend).map(([date, count]) => ({ date, count })),
  })
}
