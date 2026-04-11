import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const questions = await prisma.question.findMany({
    include: { options: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(questions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, dim, text, options, active } = body

    if (!text || !type || !options?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get max order
    const maxOrder = await prisma.question.aggregate({ _max: { order: true } })
    const nextOrder = (maxOrder._max.order || 0) + 1

    const question = await prisma.question.create({
      data: {
        type,
        dim: dim || '',
        text,
        order: nextOrder,
        active: active !== false,
        options: {
          create: options.map((opt: { label: string; score?: number; value?: string; trigger?: string }, i: number) => ({
            label: opt.label,
            score: opt.score ?? null,
            value: opt.value ?? null,
            trigger: opt.trigger ?? null,
            order: i,
          })),
        },
      },
      include: { options: true },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Failed to create question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
