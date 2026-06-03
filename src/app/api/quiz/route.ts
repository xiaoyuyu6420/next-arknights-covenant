import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'zh'

  const questions = await prisma.question.findMany({
    where: { active: true, locale },
    include: { options: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })

  const types = await prisma.personalityType.findMany({ where: { locale }, orderBy: { id: 'asc' } })
  const specialTypes = await prisma.specialType.findMany({ where: { locale }, orderBy: { id: 'asc' } })

  const regularQuestions = questions.filter(q => q.type === 'regular')
  const gateQuestion = questions.find(q => q.type === 'gate')
  const triggerQuestion = questions.find(q => q.type === 'trigger')

  return NextResponse.json({
    questions: regularQuestions.map(q => ({
      dim: q.dim,
      text: q.text,
      options: q.options.map(o => ({ label: o.label, score: o.score! })),
    })),
    gateQuestion: gateQuestion ? {
      text: gateQuestion.text,
      options: gateQuestion.options.map(o => ({ label: o.label, value: o.value! })),
    } : null,
    triggerQuestion: triggerQuestion ? {
      text: triggerQuestion.text,
      options: triggerQuestion.options.map(o => ({
        label: o.label,
        value: o.value!,
        trigger: o.trigger || undefined,
      })),
    } : null,
    types,
    specialTypes,
  })
}
