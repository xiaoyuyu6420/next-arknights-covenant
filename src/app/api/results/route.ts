import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, resultCode, resultName, similarity, userVector, isSpecial, answers } = body

    if (!userId || !resultCode || !resultName || similarity == null || !userVector) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const record = await prisma.testRecord.create({
      data: {
        userId,
        resultCode,
        resultName,
        similarity: Number(similarity),
        userVector,
        isSpecial: Boolean(isSpecial),
        answers: JSON.stringify(answers || {}),
      },
    })

    return NextResponse.json({ id: record.id, ok: true })
  } catch (error) {
    console.error('Failed to save test result:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
