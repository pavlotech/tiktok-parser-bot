import { Context } from 'telegraf';

export default async function start (ctx: Context) {
  try {
    await ctx.reply(`*Привет! Используй команду /get_stat*`, { parse_mode: 'Markdown' })
  } catch (error) { console.log(error) }
}