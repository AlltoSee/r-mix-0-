const { Scenes } = require("telegraf")
const axios = require("axios")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

//---------- Fynction ----------//
async function getCall(phone) {
	return axios.get(
		`https://sms.ru/code/call?phone=${phone}&ip=-1&api_id=${process.env.SMS_API}`
	)
}
function editMessageText(ctx) {
	ctx.telegram.editMessageText(
		ctx.session.user.chat_id,
		ctx.session.message.message_id,
		null,
		TEMPLATE.CODE_CALL_REGISTRATION_MESSAGE(ctx.session.user.phone),
		{
			reply_markup: KEYBOARD.REPEAR_CALL,
			parse_mode: "HTML",
		}
	)
}
//----------!!! Fynction !!!----------//

const scene = new Scenes.BaseScene("CODE_REGISTRATION_SCENE")
scene.enter(async ctx => {
	try {
		const phone = ctx.session.user.phone
		let text = TEMPLATE.CODE_REGISTRATION_MESSAGE(1, phone)

		const messageDelete = await ctx.reply("...", {
			reply_markup: KEYBOARD.REMOVE_KEYBOARD,
		})

		await ctx.deleteMessage(messageDelete.message_id)

		const promise = new Promise(res => setTimeout(() => res(), 60000))
		promise.then(() => {
			if (!ctx.session.promiseTimeout) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)

		if (result.data.status === "ERROR") {
			text = "Ошибка"
		}

		const message = await ctx.reply(text, {
			reply_markup: KEYBOARD.EDIT_NUMBER,
			parse_mode: "HTML",
		})

		ctx.session.registration.code = result.data.code
		ctx.session.message = message
		ctx.session.promiseTimeout = true
		ctx.session.registration.amount_call = 0
		ctx.session.registration.amount_code = 0
		ctx.session.flow = true
	} catch (err) {
		console.log(err)
	}
})

scene.action("edit_number", ctx => {
	try {
		ctx.session.promiseTimeout = false
		ctx.deleteMessage(ctx.session.message.message_id)
		ctx.scene.enter("PHONE_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

scene.action("repear_call", async ctx => {
	try {
		const phone = ctx.session.user.phone

		// Проверка на количесто нажатий на "Повторить звонок"
		if (ctx.session.registration.amount_call >= 1) {
			const result = await getCall(ctx.session.user.phone)
			ctx.session.registration.code = result.data.code

			ctx.editMessageText(TEMPLATE.CODE_TIME_REGISTRATION_MESSAGE(phone), {
				reply_markup: KEYBOARD.EDIT_NUMBER,
				parse_mode: "HTML",
			})
			return
		}

		ctx.editMessageText(TEMPLATE.CODE_REGISTRATION_MESSAGE(2, phone), {
			reply_markup: KEYBOARD.EDIT_NUMBER,
			parse_mode: "HTML",
		})

		const promise = new Promise(res => setTimeout(() => res(), 60000))
		promise.then(() => {
			if (!ctx.session.promiseTimeout) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)

		ctx.session.registration.code = result.data.code
		ctx.session.registration.amount_call++
	} catch (err) {
		console.log(err)
	}
})

scene.on("text", (ctx, next) => {
	try {
		if (ctx.message.text.slice(0, 1) === "/") {
			ctx.session.promiseTimeout = false
			return next()
		}

		ctx.deleteMessage(ctx.message.message_id)

		// Проверка кода
		if (ctx.message.text != ctx.session.registration.code) {
			if (ctx.session.flow === false) return
			ctx.session.flow = false
			if (ctx.session.registration.amount_code > 2) {
				ctx.telegram.editMessageText(
					ctx.session.user.chat_id,
					ctx.session.message.message_id,
					null,
					"Вы привысили количество попыток",
					{ parse_mode: "HTML" }
				)
				return
			}

			ctx.telegram.editMessageText(
				ctx.session.user.chat_id,
				ctx.session.message.message_id,
				null,
				"Не верный код",
				{ parse_mode: "HTML" }
			)

			const promise = new Promise(res => setTimeout(() => res(), 2000))
			promise.then(() => {
				ctx.session.flow = true
				ctx.telegram.editMessageText(
					ctx.session.user.chat_id,
					ctx.session.message.message_id,
					null,
					ctx.session.message.text,
					{
						parse_mode: "HTML",
						entities: ctx.session.message.entities,
						reply_markup: ctx.session.message.reply_markup,
					}
				)
			})

			return
		}

		ctx.telegram.editMessageText(
			ctx.session.user.chat_id,
			ctx.session.message.message_id,
			null,
			TEMPLATE.PHONE_SUCCESS,
			{ parse_mode: "HTML" }
		)

		const promise = new Promise(res => setTimeout(() => res(), 2000))
		promise.then(() => {
			ctx.deleteMessage(ctx.session.message.message_id)
			ctx.scene.enter("USER_MAIN_SCENE")
		})

		console.log("Проверка")
		ctx.session.promiseTimeout = false
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
