const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("DRIVER_MAIN_SCENE")
scene.enter(async ctx => {
	const name = ctx.session.user.name + " Водитель"
	const date = new Date().getHours()

	let text = null

	if (date >= 0 && date < 6) text = TEMPLATE.GOOD_NIGHT(name)
	if (date >= 6 && date < 12) text = TEMPLATE.GOOD_MORNING(name)
	if (date >= 12 && date < 18) text = TEMPLATE.GOOD_AFTERNOON(name)
	if (date >= 18 && date <= 23) text = TEMPLATE.GOOD_EVENING(name)

	const message = await ctx.replyWithPhoto(
		{ source: "./img/main.jpg" },
		{
			caption: text,
			parse_mode: "HTML",
			reply_markup: KEYBOARD.USER_MAIN,
		}
	)
	ctx.session.message = message
})

scene.action("taxi", ctx => {
	ctx.scene.enter("FROM_TAXI_SCENE")
})

module.exports = scene
