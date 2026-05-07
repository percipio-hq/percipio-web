import { NextRequest, NextResponse } from 'next/server'

type CardMap = Record<string, { email: string; password: string }>

const cards: CardMap = JSON.parse(process.env.RFID_CARDS ?? '{}')

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const card_uid = body?.card_uid
  if (!card_uid || typeof card_uid !== 'string') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }
  const card = cards[card_uid.toUpperCase()]
  if (!card) {
    return NextResponse.json({ error: 'unknown_card' }, { status: 404 })
  }
  return NextResponse.json({ email: card.email, password: card.password })
}
