require("dotenv").config()
const { Telegraf, Scenes, session } = require("telegraf")
const arrScenes = require("./src/handler_scenes")
const db = require("./src/db")
const axios = require("axios")

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage(arrScenes)

const dataConstructor = (current, data) => {
	// let id = data.id
	// let title = data.address
	// let description = data.address
	// let message_text = data.address

	let id = current == "#a" ? data.id : data.id
	let title = current == "#a" ? data.address : data.address
	let description = current == "#a" ? data.description : data.address
	let message_text = "..."

	return {
		id: id,
		type: "article",
		title: title,
		description: description,
		input_message_content: {
			message_text: message_text,
		},
	}
}

bot.use(session())
bot.use(stage.middleware())

bot.use(require("./commands/start"))
bot.use(require("./commands/help"))

bot.on("message", ctx => {
	try {
		ctx.deleteMessage(ctx.message.message_id)
	} catch (err) {
		console.log(err)
	}
})

bot.action(/^\d+$/, async ctx => {
	console.log(ctx.callbackQuery)
	const driver = await db.findManyDriver(ctx.callbackQuery.message.chat.id)
	await db.updateOrders(ctx.callbackQuery.data, driver[0])
	ctx.editMessageText(`вы взяли заказ ${ctx.callbackQuery.data}`)
})

bot.on("inline_query", async ctx => {
	const chat = { id: ctx.inlineQuery.from.id }
	const data = ctx.inlineQuery.query.toLowerCase()
	const arr = []

	let text = ""

	const user = await db.findUniqueUser(chat)
	if (user.status === "from") text = "Откуда? Введите адрес"
	if (user.status === "to") text = "Куда? Введите адрес"

	if (data.includes("#a")) {
		if (data.slice(3).length < 1) {
			arr.push({
				id: 0,
				type: "article",
				title: text,
				description: `Начните писать адрес, а затем выберете подходящий вариант`,
				input_message_content: {
					message_text: "...",
				},
			})
		} else {
			const result = await db.findManyCityAddress(data)

			result.forEach(element => {
				if (arr.length >= 50) return
				arr.push({
					id: element.id,
					type: "article",
					title: element.address,
					description: `${element.sub_region}, ${element.city}`,
					input_message_content: {
						message_text: element.id,
					},
				})
			})
		}
	}
	if (data.includes("#p")) {
		const result = await db.findManyCityPlaces(data)

		result.forEach(element => {
			if (arr.length >= 50) return
			if (element.places.length <= 0) return
			arr.push({
				id: element.id,
				type: "article",
				title: element.places,
				description: `${element.sub_region}, ${element.address}`,
				input_message_content: {
					message_text: element.id,
				},
			})
		})
	}
	if (arr.length <= 0) {
		ctx.answerInlineQuery(
			[
				{
					id: 0,
					type: "article",
					title: "Нет результатов",
					input_message_content: {
						message_text: "...",
					},
				},
			],
			{ cache_time: 0 }
		)
		return
	}
	ctx.answerInlineQuery(arr, {
		cache_time: 0,
	})
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
