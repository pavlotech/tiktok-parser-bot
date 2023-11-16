import { Scenes } from 'telegraf';
import getTikTokInfo from '../functions/getTikTokInfo';
import isValidDate from '../functions/isValidDate';

export default class Scene {
  dataArray: Map<number, string[]> = new Map<number, string[]>;
  firstDate () {
    const scene = new Scenes.BaseScene<Scenes.SceneContext>('first_date')
    scene.enter(async (ctx) => {
      await ctx.reply('*Введите дату начала в формате ДД.ММ.ГГГГ*', { parse_mode: 'Markdown' })
    })
    scene.on('text', async (ctx) => {
      const firstDateMessage = ctx.message.text

      let dates = this.dataArray.get(ctx.from?.id)
      if (!dates) {
        if (!ctx.from) { return }
        this.dataArray.set(ctx.from.id, [])
        dates = []
      }
      if (dates.length > 0) dates = []
      dates.push(ctx.message.text)
      if (!ctx.from) { return }
      this.dataArray.set(ctx.from.id, dates)

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

      let dates = this.dataArray.get(ctx.from?.id)
      if (!dates) {
        this.dataArray.set(ctx.from?.id, [])
        dates = []
      }
      dates.push(ctx.message.text)
      if (!ctx.from) return
      this.dataArray.set(ctx.from.id, dates)

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
      if (!ctx.from) return
      const dates = this.dataArray.get(ctx.from.id)
      if (!dates) {
        await ctx.reply('*Сначала укажите даты! /set_data*', { parse_mode: 'Markdown' })
        return ctx.scene.leave();
      }
      await ctx.reply('*Введите имя пользователя или ссылку*', { parse_mode: 'Markdown' })
    })
    scene.on('text', async (ctx) => {
      if (!ctx.from) return
      const dates = this.dataArray.get(ctx.from.id)

      const name = ctx.message.text;
      if (!dates) {
        await ctx.reply('*Сначала укажите даты! /set_data*', { parse_mode: 'Markdown' })
        return ctx.scene.leave();
      }
      if (dates.length >= 3) { dates[2] = name } else { dates.push(name) }
      const waitMessage = await ctx.reply('*Подготовка информации, это может занять несколько минут...*', { parse_mode: 'Markdown' });

      console.log(`[GET_STAT] ${dates}`);
      const result = await getTikTokInfo(dates[0], dates[1], dates[2]);
      
      await ctx.telegram.editMessageText(ctx.message?.chat.id, waitMessage.message_id, '', '*Отправлен файл с данными*', { parse_mode: 'Markdown' });

      // Отправка файла txt, если существует
      if (result?.tableFilePath) {
        await ctx.replyWithDocument({ source: result.tableFilePath });
      }

      console.log(`[GET_STAT] ${ctx.from.username} completed`);
      ctx.scene.leave();
    })
    return scene
  }
}