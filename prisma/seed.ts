import { PrismaClient } from '@prisma/client'
import { QUIZ_DATA } from '../src/lib/quiz-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.personalityType.deleteMany()
  await prisma.specialType.deleteMany()

  // Seed regular questions
  for (let i = 0; i < QUIZ_DATA.questions.length; i++) {
    const q = QUIZ_DATA.questions[i]
    const question = await prisma.question.create({
      data: {
        type: 'regular',
        dim: q.dim,
        text: q.text,
        order: i,
        active: true,
        options: {
          create: q.options.map((opt, j) => ({
            label: opt.label,
            score: opt.score,
            order: j,
          })),
        },
      },
    })
    console.log(`  Question ${i + 1}: ${q.dim} ✓`)
  }

  // Seed gate question
  const gateQ = await prisma.question.create({
    data: {
      type: 'gate',
      dim: '',
      text: QUIZ_DATA.gateQuestion.text,
      order: QUIZ_DATA.questions.length,
      active: true,
      options: {
        create: QUIZ_DATA.gateQuestion.options.map((opt, j) => ({
          label: opt.label,
          value: opt.value,
          order: j,
        })),
      },
    },
  })
  console.log(`  Gate question ✓`)

  // Seed trigger question
  const triggerQ = await prisma.question.create({
    data: {
      type: 'trigger',
      dim: '',
      text: QUIZ_DATA.triggerQuestion.text,
      order: QUIZ_DATA.questions.length + 1,
      active: true,
      options: {
        create: QUIZ_DATA.triggerQuestion.options.map((opt, j) => ({
          label: opt.label,
          value: opt.value,
          trigger: (opt as { trigger?: string }).trigger || null,
          order: j,
        })),
      },
    },
  })
  console.log(`  Trigger question ✓`)

  // Seed personality types
  for (const t of QUIZ_DATA.types) {
    await prisma.personalityType.create({
      data: {
        code: t.code,
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
    console.log(`  Type ${t.code}: ${t.name} ✓`)
  }

  // Seed special types
  for (const t of QUIZ_DATA.specialTypes) {
    await prisma.specialType.create({
      data: {
        code: t.code,
        name: t.name,
        emoji: t.emoji,
        color: t.color,
        img: t.img,
        trigger: t.trigger,
        desc: t.desc,
        slogan: t.slogan,
      },
    })
    console.log(`  Special ${t.code}: ${t.name} ✓`)
  }

  console.log(`\nDone! Seeded ${QUIZ_DATA.questions.length + 2} questions, ${QUIZ_DATA.types.length} types, ${QUIZ_DATA.specialTypes.length} special types.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
