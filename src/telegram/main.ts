import { Telegraf, Scenes, session } from 'telegraf';
import { TTScraper } from "../tiktok/src/main";
import Scene from '../types/Scene';
import dotenv from 'dotenv'; dotenv.config()
import getStat from './commands/getStat';
import start from './commands/start';
import help from './commands/help';

export class Launch {
  bot: any = new Telegraf<Scenes.SceneContext>(process.env.TG_TOKEN || '', { handlerTimeout: 60 * 60 * 1000 });
  //tiktokscraper: any = new TTScraper()
  async Telegram () {
    try {
      const scene = new Scene()
      const stage = new Scenes.Stage<Scenes.SceneContext>([
        scene.firstDate(),
        scene.secondDate(),
        scene.getName(),
      ], { ttl: 10 * 60 * 1000 });
      this.bot.use(session());
      this.bot.use(stage.middleware());

      this.bot.start(start);
      this.bot.command('get_stat', getStat);
      this.bot.command('help', help)
      this.bot.launch();

      return 'Launch bot'
    } catch (error) { return error }
  }
}