import { Context } from 'telegraf';

export default async function help (ctx: Context) {
  try {
    await ctx.reply(`*
    Список команд:\n/start - Начать взаимодействие с ботом\n/get_stat - Статистика TikTok Аккаунта за период\n/help - Вывести эту справку\n\nБот выдает ошибки?, попробуйте следующие шаги:\n1. Попробуйте ввести имя другого профиля.\n2. Подождите некоторое время и повторите попытку с изначально планируемым профилем.
    *`, { parse_mode: 'Markdown' });
  } catch (error) { console.log(error) }
}