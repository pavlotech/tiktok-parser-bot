import { Context } from 'telegraf';

export default async function start (ctx: Context) {
  try {
    console.log(`[START] ${ctx.from?.username}`)
    await ctx.reply(`*Привет! Используй команду /get_stat*`, { parse_mode: 'Markdown' })
  } catch (error) { console.error(`[ERROR]`, error); }
}