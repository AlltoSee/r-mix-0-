const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const validatePhone = phone => {
	let regex =
		/^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
	return regex.test(phone)
}

const scene = new Scenes.BaseScene("PHONE_REGISTRATION_SCENE")
scene.enter(async ctx => {
	try {
		const text = TEMPLATE.PHONE_REGISTRATION_MESSAGE
		const message = await ctx.reply(text, {
			reply_markup: KEYBOARD.PHONE_REGISTRATION_BUTTON,
			parse_mode: "HTML",
		})
		ctx.session.message = message
	} catch (err) {
		console.log(err)
	}
})

scene.on("contact", ctx => {
	try {
		ctx.deleteMessage(ctx.message.message_id)
		ctx.session.user.phone = ctx.message.contact.phone_number
		ctx.deleteMessage(ctx.session.message.message_id)
		ctx.scene.enter("CODE_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

scene.on("text", async (ctx, next) => {
	try {
		if (ctx.message.text.slice(0, 1) === "/") return next()
		ctx.deleteMessage(ctx.message.message_id)

		if (!validatePhone(ctx.message.text)) {
			ctx.deleteMessage(ctx.session.message.message_id)
			const message = await ctx.reply(TEMPLATE.PHONE_ERR_REGISTRATION_MESSAGE)
			ctx.session.message = message

			const promise = new Promise(res => setTimeout(() => res(), 2000))
			promise.then(() => {
				ctx.deleteMessage(ctx.session.message.message_id)
				ctx.scene.enter("PHONE_REGISTRATION_SCENE")
			})

			return
		}

		ctx.session.user.phone = ctx.message.text
			.replace(/[^0-9,.]/g, "")
			.replace(/^[78]?/, "+7")

		ctx.deleteMessage(ctx.session.message.message_id)
		ctx.scene.enter("CODE_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
