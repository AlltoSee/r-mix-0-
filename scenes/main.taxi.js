const { Scenes } = require("telegraf")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("MAIN_TAXI_SCENE")
scene.enter(async ctx => {
	ctx.telegram.editMessageMedia(
		ctx.session.user.chat_id,
		ctx.session.message.message_id,
		null,
		{
			type: "photo",
			media: { source: "./img/to.jpg" },
			caption: `<b>Откуда:</b> ${ctx.session.taxi.from.city}, ${ctx.session.taxi.from.address}
<b>Остановка:</b> ${ctx.session.taxi.to.city}, ${ctx.session.taxi.to.address}
<b>Куда:</b> ${ctx.session.taxi.to.city}, ${ctx.session.taxi.to.address}

<b>Цена:</b> ${ctx.session.taxi.from.price} р (предварительно)
<b>Коминтарий водителю:</b>
Пожалуйста зеберите со двора

Если все верно нажмите <b>"Заказать"</b>`,
			parse_mode: "HTML",
		},
		{
			reply_markup: {
				inline_keyboard: [
					[{ text: "Заказать", callback_data: "1" }],
					[{ text: "Добавить остановку", callback_data: "2" }],
					[{ text: "Коминтарий водителю", callback_data: "3" }],
					[{ text: "Заказать дургому человеку", callback_data: "4" }],
					[{ text: TEMPLATE.CANCEL_BUTTON, callback_data: "cancel" }],
				],
			},
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
	ctx.session.taxi.to = result
	ctx.scene.enter("")
})

module.exports = scene
