#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addColumnIfMissing(table, column, definition) {
  const columns = await prisma.$queryRawUnsafe(`PRAGMA table_info(${table})`)
  const exists = columns.some(existing => existing.name === column)

  if (!exists) {
    await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
    console.log(`Added ${table}.${column}`)
  }
}

async function main() {
  await addColumnIfMissing('TestRecord', 'locale', 'TEXT NOT NULL DEFAULT "zh"')
  await addColumnIfMissing('TestRecord', 'utmSource', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'utmMedium', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'utmCampaign', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'referrer', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'referralCode', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'referralName', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'challengeId', 'TEXT NOT NULL DEFAULT ""')
  await addColumnIfMissing('TestRecord', 'landingPath', 'TEXT NOT NULL DEFAULT ""')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ShareVisit (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL DEFAULT '',
      locale TEXT NOT NULL DEFAULT 'zh',
      utmSource TEXT NOT NULL DEFAULT '',
      utmMedium TEXT NOT NULL DEFAULT '',
      utmCampaign TEXT NOT NULL DEFAULT '',
      referrer TEXT NOT NULL DEFAULT '',
      referralCode TEXT NOT NULL DEFAULT '',
      referralName TEXT NOT NULL DEFAULT '',
      challengeId TEXT NOT NULL DEFAULT '',
      landingPath TEXT NOT NULL DEFAULT '',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await addColumnIfMissing('ShareVisit', 'challengeId', 'TEXT NOT NULL DEFAULT ""')
}

main()
  .catch(error => {
    console.error('Failed to ensure database schema:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
