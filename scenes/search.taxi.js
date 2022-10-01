const { Scenes } = require("telegraf")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("SEARCH_TAXI_SCENE")
scene.enter(async ctx => {
	const { from, stop, to, comment } = ctx.session.taxi
	const user = ctx.session.user

	ctx.editMessageMedia(
		{
			type: "photo",
			media: { source: "./img/main.jpg" },
			caption: "Поиск водителей",
			parse_mode: "HTML",
		},
		{
			reply_markup: KEYBOARD.CANCEL_BUTTON,
		}
	)

	const result = await db.createOrder(
		from,
		stop,
		to,
		ctx.session.taxi.price,
		comment,
		user
	)
	ctx.session.order = result
	const drivers = await db.findManyDriver()
	console.log(drivers)
	const promise = new Promise(res => {
		drivers.forEach(element => {
			ctx.telegram.sendMessage(element.chat_id, "Заказ", {
				reply_markup: {
					inline_keyboard: [
						[{ text: "взять заказ", callback_data: ctx.session.order.id }],
					],
				},
			})
			setTimeout(async () => {
				const result = await db.findUniqueOrder(ctx.session.order.id)
				if (result.status == "go") return res(result.driver)
			}, 15000)
		})
	})
	promise.then(async data => {
		ctx.telegram.editMessageCaption(
			ctx.session.user.chat_id,
			ctx.session.message.message_id,
			null,
			data.name
		)
	})
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
