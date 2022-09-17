const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")

const scene = new Scenes.BaseScene("NAME_REGISTRATION_SCENE")
scene.enter(async ctx => {
	try {
		const { message_id } = await ctx.reply(TEMPLATE.NAME_REGISTRATION_MESSAGE, {
			parse_mode: "HTML",
		})
		ctx.session.user.message_id = message_id
	} catch (err) {
		console.log(err)
	}
})

scene.on("text", (ctx, next) => {
	try {
		if (ctx.message.text.slice(0, 1) === "/") return next()
		ctx.deleteMessage(ctx.message.message_id)
		ctx.deleteMessage(ctx.session.user.message_id)
		ctx.session.user.name = ctx.message.text
		ctx.scene.enter("PHONE_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
