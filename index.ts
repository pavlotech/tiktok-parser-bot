import { Telegraf, Scenes } from 'telegraf';
import { loadTelegram } from './src/telegram';
import dotenv from 'dotenv';
dotenv.config()

const bot = new Telegraf<Scenes.SceneContext>(process.env.TG_TOKEN || '', { handlerTimeout: 60 * 60 * 1000 });
loadTelegram();

export { bot };