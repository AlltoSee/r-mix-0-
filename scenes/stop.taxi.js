const { Scenes } = require("telegraf")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("STOP_TAXI_SCENE")
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
			caption: TEMPLATE.ADDRESS_TAXI_MESSAGE("Где нужно остановиться"),
			parse_mode: "HTML",
		},
		{
			reply_markup: KEYBOARD.ADDRESS_BUTTON,
		}
	)
})

scene.action("cancel", ctx => {
	ctx.scene.enter("MAIN_TAXI_SCENE")
})

scene.on("message", async ctx => {
	ctx.deleteMessage(ctx.message.message_id)
	if (!ctx.message.via_bot?.is_bot || isNaN(ctx.message.text)) return
	const result = await db.findUniqueCity(ctx.message.text)
	ctx.session.taxi.stop.push(result)
	ctx.scene.enter("MAIN_TAXI_SCENE")
})

module.exports = scene
