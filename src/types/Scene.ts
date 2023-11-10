import { Scenes } from 'telegraf';
import getTikTokInfo from '../functions/getTikTokInfo';
import isValidDate from '../functions/isValidDate';

export default class Scene {
  dataArray: string[] = [];
  firstDate () {
    const scene = new Scenes.BaseScene<Scenes.SceneContext>('first_date')
    scene.enter(async (ctx) => {
      this.dataArray.length = 0;
      await ctx.reply('*Введите дату начала в формате ДД.ММ.ГГГГ*', { parse_mode: 'Markdown' })
    })
    scene.on('text', async (ctx) => {
      const firstDateMessage = ctx.message.text
      this.dataArray.push(firstDateMessage);
      if (!isValidDate(firstDateMessage)) {
        await ctx.reply('*Дата указана неверно*', { parse_mode: 'Markdown' })
        ctx.scene.reenter()
      } else {
        ctx.scene.enter('second_date')
      }
    })
    return scene
  }
  secondDate () {
    const scene = new Scenes.BaseScene<Scenes.SceneContext>('second_date')
    scene.enter(async (ctx) => {
      await ctx.reply('*Введите дату конца в формате ДД.ММ.ГГГГ*', { parse_mode: 'Markdown' })
    })
    scene.on('text', async (ctx) => {
      const secondDateMessage = ctx.message.text
      this.dataArray.push(secondDateMessage);
      if (!isValidDate(secondDateMessage)) {
        await ctx.reply('*Дата указана неверно*', { parse_mode: 'Markdown' })
        ctx.scene.reenter()
      } else {
        console.log(this.dataArray)
        ctx.scene.leave()
        await ctx.reply('*Используйте команду /get_stat*', { parse_mode: 'Markdown' })
      }
    })
    return scene
  }
  getName () {
    const scene = new Scenes.BaseScene<Scenes.SceneContext>('get_name')
    scene.enter(async (ctx) => {
      if (this.dataArray.length == 0) {
        await ctx.reply('*Сначала укажите даты! /set_data*', { parse_mode: 'Markdown' })
        return ctx.scene.leave();
      }
      await ctx.reply('*Введите имя пользователя или ссылку*', { parse_mode: 'Markdown' })
    })
    scene.on('text', async (ctx) => {
      const name = ctx.message.text;
      this.dataArray.push(name);
      const waitMessage = await ctx.reply('*Подготовка информации, это может занять несколько минут...*', { parse_mode: 'Markdown' })
      console.log(`[GET_STAT] ${this.dataArray}`)
      await ctx.telegram.editMessageText(ctx.message?.chat.id, waitMessage.message_id, '', `${await getTikTokInfo(this.dataArray[0], this.dataArray[1], this.dataArray[2])}`, { parse_mode: 'Markdown' });
      ctx.scene.leave();
      this.dataArray.pop();
    })
    return scene
  }
}