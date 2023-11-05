import { Scenes, session } from 'telegraf';
import SceneGenerator from '../types/SceneGenerator';
//import { bot } from '../../index';
import get_stat from './commands/get_stat';
import start from './commands/start';
import help from './commands/help';

export class Launch {
  async Telegram (bot: any) {
    try {
      const scene = new SceneGenerator()
      const stage = new Scenes.Stage<Scenes.SceneContext>([
        scene.firstDate(),
        scene.secondDate(),
        scene.getName()
      ], { ttl: 10 * 60 * 1000 });
      bot.use(session());
      bot.use(stage.middleware());

      bot.start(start);
      bot.command('get_stat', get_stat);
      bot.command('help', help)
      bot.launch();

      return 'Launch bot'
    } catch (error) { return error }
  }
}