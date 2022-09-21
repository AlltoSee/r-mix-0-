const { Scenes } = require("telegraf")

const scene = new Scenes.BaseScene("USER_MAIN_SCENE")
scene.enter(async ctx => {
	const message = await ctx.reply("Новая сцена")
	ctx.session.message = message
})

module.exports = scene
