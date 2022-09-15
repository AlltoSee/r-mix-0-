const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("PHONE_REGISTRATION_SCENE")
scene.enter(async ctx => {
	try {
		const text = TEMPLATE.PHONE_REGISTRATION_MESSAGE
		const { message_id } = await ctx.reply(text, {
			reply_markup: KEYBOARD.PHONE_REGISTRATION_BUTTON,
			parse_mode: "HTML",
		})
		ctx.session.user.message_id = message_id
	} catch (err) {
		console.log(err)
	}
})

scene.on("message", ctx => {
	try {
		ctx.deleteMessage(ctx.message.message_id)
		ctx.session.user.name = ctx.message.text
		ctx.scene.enter()
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
