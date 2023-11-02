import { Scenes, session } from 'telegraf';
import SceneGenerator from '../types/SceneGenerator';
import { bot } from '../../index';
//import help from './commands/help';
import start from './commands/start';

const lastUsageTimes: { [key: number]: number } = {};
export async function loadTelegram() {
  try {
    // commands
    bot.start(start);

    const scene = new SceneGenerator();
    const firstDate = scene.firstDate();
    const secondDate = scene.secondDate();
    const getName = scene.getName();

    const stage = new Scenes.Stage<Scenes.SceneContext>([firstDate, secondDate, getName], {
      ttl: 10,
    });

    bot.use(session());
    bot.use(stage.middleware());
    
    bot.command('get_stat', (ctx) => {
      const userId = ctx.from.id;
      const currentTime = Date.now();

      if (lastUsageTimes[userId] && currentTime - lastUsageTimes[userId] < 0 * 60 * 1000) {
        // Если команда использована ранее
        ctx.reply("*Пожалуйста, подождите 10 минут перед следующим использованием команды /get_stat*", { parse_mode: 'Markdown' });
      } else {
        // Если команда используется впервые или прошло более 10 минут с предыдущего использования, обновите время последнего использования и выполните логику команды
        lastUsageTimes[userId] = currentTime;
        ctx.scene.enter("firstdate");
      }
    });
    bot.launch();
    // launch
    return console.log('Connecting to Telegram')
  } catch (error) { console.log(error) }

}
