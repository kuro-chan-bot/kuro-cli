import { Bot } from '@kuro-chan/framework'
import { botConfig } from './config/bot'

const bot = new Bot(botConfig)

bot.login(process.env.BOT_TOKEN)
