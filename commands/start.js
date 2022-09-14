const { Composer } = require("telegraf")

const command = new Composer()
command.start(async ctx => {
	ctx.reply("Привет")
	ctx.scene.enter("USER_MAIN_SCENE")
})

module.exports = command
