const { Composer } = require("telegraf")

const bot = new Composer()
bot.help(async ctx => {
	ctx.reply("Помощь")
})

module.exports = bot
