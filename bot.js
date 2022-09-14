require("dotenv").config()
const { Telegraf, Scenes, session } = require("telegraf")
const arrScenes = require("./src/handler_scenes")

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage(arrScenes)

bot.use(session())
bot.use(stage.middleware())

bot.use(require("./commands/start"))
bot.use(require("./commands/help"))

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
