import { Context } from 'telegraf';

export default async function message (ctx: Context, next: Function) {
  try {
    if (ctx.message === undefined) return next()
    if(!('text' in ctx.message)) return next()
    //await ctx.reply(`message ${ctx.message?.text}`, { parse_mode: 'Markdown' });
  } catch (error) {
    console.log(error)
  }
}