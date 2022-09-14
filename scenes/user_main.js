const { Scenes } = require("telegraf")

const scene = new Scenes.BaseScene("USER_MAIN_SCENE")
scene.enter(ctx => {
	ctx.reply("Новая сцена")
})

module.exports = scene
