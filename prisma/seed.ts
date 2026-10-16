import { PrismaClient } from '@prisma/client'
import { QUIZ_DATA } from '../src/lib/quiz-data'
import { QUIZ_DATA_JA } from '../src/lib/quiz-data-ja'

const prisma = new PrismaClient()

interface QuizDataSource {
  questions: { dim: string; text: string; options: { label: string; score: number }[] }[]
  gateQuestion: { text: string; options: { label: string; value: string }[] }
  triggerQuestion: { text: string; options: { label: string; value: string; trigger?: string }[] }
  types: { code: string; name: string; group: string; emoji: string; color: string; img: string; vector: string; desc: string; slogan: string }[]
  specialTypes: { code: string; name: string; emoji: string; color: string; img: string; trigger: string; desc: string; slogan: string }[]
}

async function seedLocale(prisma: PrismaClient, data: QuizDataSource, locale: string) {
  console.log(`\nSeeding locale: ${locale}`)

  // Seed regular questions
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i]
    await prisma.question.create({
      data: {
        type: 'regular',
        dim: q.dim,
        text: q.text,
        order: i,
        active: true,
        locale,
        options: {
          create: q.options.map((opt, j) => ({
            label: opt.label,
            score: opt.score,
            order: j,
          })),
        },
      },
    })
    console.log(`  [${locale}] Question ${i + 1}: ${q.dim} ✓`)
  }

  // Seed gate question
  await prisma.question.create({
    data: {
      type: 'gate',
      dim: '',
      text: data.gateQuestion.text,
      order: data.questions.length,
      active: true,
      locale,
      options: {
        create: data.gateQuestion.options.map((opt, j) => ({
          label: opt.label,
          value: opt.value,
          order: j,
        })),
      },
    },
  })
  console.log(`  [${locale}] Gate question ✓`)

  // Seed trigger question
  await prisma.question.create({
    data: {
      type: 'trigger',
      dim: '',
      text: data.triggerQuestion.text,
      order: data.questions.length + 1,
      active: true,
      locale,
      options: {
        create: data.triggerQuestion.options.map((opt, j) => ({
          label: opt.label,
          value: opt.value,
          trigger: (opt as { trigger?: string }).trigger || null,
          order: j,
        })),
      },
    },
  })
  console.log(`  [${locale}] Trigger question ✓`)

  // Seed personality types
  for (const t of data.types) {
    await prisma.personalityType.create({
      data: {
        code: t.code,
        locale,
        name: t.name,
        group: t.group,
        emoji: t.emoji,
        color: t.color,
        img: t.img,
        vector: t.vector,
        desc: t.desc,
        slogan: t.slogan,
      },
    })
    console.log(`  [${locale}] Type ${t.code}: ${t.name} ✓`)
  }

  // Seed special types
  for (const t of data.specialTypes) {
    await prisma.specialType.create({
      data: {
        code: t.code,
        locale,
        name: t.name,
        emoji: t.emoji,
        color: t.color,
        img: t.img,
        trigger: t.trigger,
        desc: t.desc,
        slogan: t.slogan,
      },
    })
    console.log(`  [${locale}] Special ${t.code}: ${t.name} ✓`)
  }
}

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.personalityType.deleteMany()
  await prisma.specialType.deleteMany()

  // Seed both locales
  await seedLocale(prisma, QUIZ_DATA as unknown as QuizDataSource, 'zh')
  await seedLocale(prisma, QUIZ_DATA_JA as unknown as QuizDataSource, 'ja')

  console.log(`\nDone! Seeded both zh and ja locales.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
