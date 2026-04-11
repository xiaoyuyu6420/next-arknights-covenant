import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { text, dim, active, options } = body

    const updateData: Record<string, unknown> = {}
    if (text !== undefined) updateData.text = text
    if (dim !== undefined) updateData.dim = dim
    if (active !== undefined) updateData.active = active

    // If options are provided, replace them
    if (options) {
      await prisma.option.deleteMany({ where: { questionId: Number(id) } })
      updateData.options = {
        create: options.map((opt: { label: string; score?: number; value?: string; trigger?: string }, i: number) => ({
          label: opt.label,
          score: opt.score ?? null,
          value: opt.value ?? null,
          trigger: opt.trigger ?? null,
          order: i,
        })),
      }
    }

    const question = await prisma.question.update({
      where: { id: Number(id) },
      data: updateData,
      include: { options: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Failed to update question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.question.delete({ where: { id: Number(id) } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
