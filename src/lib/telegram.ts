const BASE = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function sendMessage(text: string, chatId = process.env.TELEGRAM_CHAT_ID): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return
  await fetch(`${BASE()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}
