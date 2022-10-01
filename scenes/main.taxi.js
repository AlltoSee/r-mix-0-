const { Scenes } = require("telegraf")
const db = require("../src/db")
const axios = require("../src/axios")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const adressText = ({ city, address, places }) => {
	return `${city}, ${address} ${places ? `(${places})` : ""}`
}

const grade = async (ctx, array, int = 0) => {
	const { from, to } = ctx.session.taxi
	const distance = ctx.session.taxi.distance
	const rt = []

	if (array.length <= int) return
	rt.push({
		type: "walking",
		y: from.latitude,
		x: from.longityde,
	})

	array.forEach((element, index) => {
		if (index > int) return
		rt.push({
			type: "pref",
			y: element.latitude,
			x: element.longityde,
		})
	})

	rt.push({
		type: "walking",
		y: to.latitude,
		x: to.longityde,
	})

	const result = await axios.axiosCarrouting(rt)
	if (result.data.result[0].length - distance > 500) {
		const pr = +array[int].price
		ctx.session.taxi.price = ctx.session.taxi.price + pr
	}

	return grade(ctx, array, int + 1)
}

const scene = new Scenes.BaseScene("MAIN_TAXI_SCENE")
scene.enter(async ctx => {
	try {
		const { from, stop, to, comment } = ctx.session.taxi
		let stopText = ""
		const rt = []
		let price = 0

		stop.forEach(element => {
			const result = adressText(element)
			stopText = stopText + `<b>Остановка:</b> ${result}\n`
		})

		rt.push({
			type: "walking",
			y: from.latitude,
			x: from.longityde,
		})

		rt.push({
			type: "walking",
			y: to.latitude,
			x: to.longityde,
		})

		if (from.price >= to.price) {
			price = price + +from.price
		} else {
			price = price + +to.price
		}

		ctx.session.taxi.price = price

		if (stopText) {
			const result = await axios.axiosCarrouting(rt)
			ctx.session.taxi.distance = result.data.result[0].length

			await grade(ctx, stop)
		}

		const data = {
			from: adressText(from),
			stop: stopText ? stopText : "",
			to: adressText(to),
			price: ctx.session.taxi.price,
			comment: comment ? comment : "Коментарий не указано",
		}

		ctx.telegram.editMessageMedia(
			ctx.session.user.chat_id,
			ctx.session.message.message_id,
			null,
			{
				type: "photo",
				media: { source: "./img/main.jpg" },
				caption: TEMPLATE.TAXI_MESSAGE(data),
				parse_mode: "HTML",
			},
			{ reply_markup: KEYBOARD.MAIN_TAXI_BUTTON }
		)
	} catch (err) {
		console.log(err)
	}
})

scene.action("cancel", ctx => {
	ctx.deleteMessage(ctx.session.message.message_id)
	ctx.scene.enter("USER_MAIN_SCENE")
})

scene.action("stop", ctx => {
	ctx.scene.enter("STOP_TAXI_SCENE")
})

scene.action("comment", ctx => {
	ctx.scene.enter("COMMENT_TAXI_SCENE")
})

scene.action("order", ctx => {
	ctx.scene.enter("SEARCH_TAXI_SCENE")
})

scene.on("message", async (ctx, next) => {
	if (ctx.message.text.slice(0, 1) === "/") return next()
})

module.exports = scene
