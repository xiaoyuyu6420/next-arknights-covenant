'use client'

import { QuizApp } from '@/components/QuizApp'
import { ja } from '@/i18n/ja'

export default function JaPage() {
  return <QuizApp text={ja} locale="ja" />
}
