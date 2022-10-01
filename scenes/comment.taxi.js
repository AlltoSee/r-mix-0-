const { Scenes } = require("telegraf")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("COMMENT_TAXI_SCENE")
scene.enter(async ctx => {
	const chat = ctx.callbackQuery.message.chat
	await db.updateUserStatus(chat, "to")
	ctx.telegram.editMessageMedia(
		ctx.session.user.chat_id,
		ctx.session.message.message_id,
		null,
		{
			type: "photo",
			media: { source: "./img/to.jpg" },
			caption: TEMPLATE.ADDRESS_TAXI_MESSAGE("Напишите коментарий водителю"),
			parse_mode: "HTML",
		},
		{
			reply_markup: {
				inline_keyboard: [
					[{ text: TEMPLATE.CANCEL_BUTTON, callback_data: "cancel" }],
				],
			},
		}
	)
})

scene.action("cancel", ctx => {
	ctx.scene.enter("MAIN_TAXI_SCENE")
})

scene.on("message", async ctx => {
	ctx.deleteMessage(ctx.message.message_id)
	ctx.session.taxi.comment = ctx.message.text
	ctx.scene.enter("MAIN_TAXI_SCENE")
})

module.exports = scene
