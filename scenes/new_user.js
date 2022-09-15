const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("NEW_USER_SCENE")
scene.enter(async ctx => {
	try {
		const { message_id } = await ctx.replyWithPhoto(
			{ source: "./img/main.jpg" },
			{
				caption: TEMPLATE.NEW_USER_MESSAGE,
				reply_markup: KEYBOARD.NEW_USER_BUTTON,
				parse_mode: "HTML",
			}
		)
		ctx.session.user.message_id = message_id
	} catch (err) {
		console.log(err)
	}
})

scene.action("registration", async ctx => {
	try {
		ctx.answerCbQuery()
		ctx.deleteMessage(ctx.session.user.message_id)
		ctx.scene.enter("NAME_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
