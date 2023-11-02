import { Context, Scenes } from 'telegraf';
import isValidDate from '../functions/isValidDate';
import getTikTokInfo from '../functions/getTikTokInfo';

export default class SceneGenerator {
  dataArray: string[] = [];
  firstDate () {
    const firstDate = new Scenes.BaseScene<Scenes.SceneContext>('firstdate')
    firstDate.enter(async (ctx) => {
      await ctx.reply('*Введите дату начала в формате ММ.ДД.ГГГГ*', { parse_mode: 'Markdown' })
    })
    firstDate.on('text', async (ctx) => {
      const firstDateMessage = ctx.message.text
      this.dataArray.push(firstDateMessage);
      if (!isValidDate(firstDateMessage)) {
        await ctx.reply('*Дата указана неверно*', { parse_mode: 'Markdown' })
        ctx.scene.reenter()
      } else {
        ctx.scene.enter('seconddate')
      }
    })
    return firstDate
  }
  secondDate () {
    const secondDate = new Scenes.BaseScene<Scenes.SceneContext>('seconddate')
    secondDate.enter(async (ctx) => {
      await ctx.reply('*Введите дату конца в формате ММ.ДД.ГГГГ*', { parse_mode: 'Markdown' })
    })
    secondDate.on('text', async (ctx) => {
      const secondDateMessage = ctx.message.text
      this.dataArray.push(secondDateMessage);
      if (!isValidDate(secondDateMessage)) {
        await ctx.reply('*Дата указана неверно*', { parse_mode: 'Markdown' })
        ctx.scene.reenter()
      } else {
        ctx.scene.enter('getname')
      }
    })
    return secondDate
  }
  getName () {
    const getName = new Scenes.BaseScene<Scenes.SceneContext>('getname')
    getName.enter(async (ctx) => {
      await ctx.reply('*Введите имя пользователя или ссылку*', { parse_mode: 'Markdown' })
    })
    getName.on('text', async (ctx) => {
      const name = ctx.message.text;
      this.dataArray.push(name);
      const waitMessage = await ctx.reply('*Идет сбор информации...*', { parse_mode: 'Markdown' })
      await ctx.telegram.editMessageText(ctx.message?.chat.id, waitMessage.message_id, '', `${await getTikTokInfo(this.dataArray[0], this.dataArray[1], this.dataArray[2])}`, { parse_mode: 'Markdown' });
      ctx.scene.leave(); // Завершаем сцену
      // Если пользователь отправит сообщение, отменяем таймаут
      this.dataArray.length = 0;
    })
    return getName
  }
}