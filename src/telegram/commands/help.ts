import { Context } from 'telegraf';

export default async function help (ctx: Context) {
  try {
    console.log(`[HELP] ${ctx.from?.username}`)
    await ctx.reply(`*
    Список команд:\n/start - Начать взаимодействие с ботом\n/set_data - Установить перид\n/get_stat - Статистика TikTok Аккаунта за период\n/help - Вывести эту справку\n\nБот выдает ошибки?, попробуйте следующие шаги:\n1. Попробуйте ввести имя другого профиля.\n2. Подождите некоторое время и повторите попытку с изначально планируемым профилем.
    *`, { parse_mode: 'Markdown' });
  } catch (error) { console.error(`[ERROR] ${error}`) }
}