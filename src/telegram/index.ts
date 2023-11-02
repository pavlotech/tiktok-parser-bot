import { Scenes, session } from 'telegraf';
import SceneGenerator from '../types/SceneGenerator';
import { bot } from '../../index';
import help from './commands/help';
import start from './commands/start';

const lastUsageTimes: { [key: number]: number } = {};
export async function loadTelegram() {
  try {
    bot.start(start);

    const scene = new SceneGenerator()
    const firstDate = scene.firstDate(), secondDate = scene.secondDate(), getName = scene.getName();

    const stage = new Scenes.Stage<Scenes.SceneContext>([firstDate, secondDate, getName], { ttl: 10 * 60 * 1000 });
    bot.use(session());
    bot.use(stage.middleware());

    bot.command('get_stat', (ctx) => { ctx.scene.enter("firstdate") });
    bot.command('help', help)
    bot.launch();

    return console.log('Connecting to Telegram')
  } catch (error) { console.log(error) }
}
