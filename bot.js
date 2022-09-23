require("dotenv").config()
const { Telegraf, Scenes, session } = require("telegraf")
const arrScenes = require("./src/handler_scenes")
const db = require("./src/db")

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage(arrScenes)

const dataConstructor = (current, data) => {
	const id = data.id
	const title = data.address
	const description = data.address
	const message_text = data.address

	if (current === "#a") {
		const id = data.id
		const title = data.address
		const description = data.description
		const message_text = "..."
	}

	return {
		id,
		type: "article",
		title,
		description,
		input_message_content: {
			message_text,
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

bot.on("inline_query", async ctx => {
	const data = ctx.inlineQuery.query.toLowerCase()
	const arr = []

	if (data.includes("#a")) {
		if (data.slice(3).length < 1) {
			arr.push(
				dataConstructor("#a", {
					id: 0,
					address: "Откуда?",
					description: "Пожалуйста напишите адрес откда вас забрать",
				})
			)
		} else {
			const result = await db.findManyCityAddress(data)

			result.forEach(element => {
				if (arr.length >= 50) return
				arr.push({
					id: element.id,
					type: "article",
					title: element.address,
					description: `${element.region}, ${element.sub_region}`,
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
						message_text: "Нет результатов",
					},
				},
			],
			{
				cache_time: 0,
			}
		)
		return
	}
	ctx.answerInlineQuery(arr, {
		cache_time: 0,
		switch_pm_text: "Откуда?",
		switch_pm_parameter: "hi",
	})
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
