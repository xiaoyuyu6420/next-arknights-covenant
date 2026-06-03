'use client'

import { QuizApp } from '@/components/QuizApp'
import { zh } from '@/i18n/zh'

export default function Home() {
  return <QuizApp text={zh} locale="zh" />
}
