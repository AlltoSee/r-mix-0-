const { Scenes } = require("telegraf")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("FROM_TAXI_SCENE")
scene.enter(async ctx => {
	ctx.session.taxi = {}
	ctx.session.taxi.price = 0
	const chat = ctx.callbackQuery.message.chat
	await db.updateUserStatus(chat, "from")
	ctx.editMessageMedia(
		{
			type: "photo",
			media: { source: "./img/from.jpg" },
			caption: TEMPLATE.ADDRESS_TAXI_MESSAGE(TEMPLATE.FROM_ADDRESS),
			parse_mode: "HTML",
		},
		{
			reply_markup: KEYBOARD.ADDRESS_BUTTON,
		}
	)
})

scene.action("cancel", ctx => {
	ctx.deleteMessage(ctx.session.message.message_id)
	ctx.scene.enter("USER_MAIN_SCENE")
})

scene.on("message", async ctx => {
	ctx.deleteMessage(ctx.message.message_id)
	if (!ctx.message.via_bot?.is_bot || isNaN(ctx.message.text)) return
	const result = await db.findUniqueCity(ctx.message.text)
	ctx.session.taxi.from = result
	ctx.scene.enter("TO_TAXI_SCENE")
})

module.exports = scene
