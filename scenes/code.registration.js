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
		ctx.session.user.message_id,
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
		let message = TEMPLATE.CODE_REGISTRATION_MESSAGE(1, phone)

		const message_delete = await ctx.reply("...", {
			reply_markup: KEYBOARD.REMOVE_KEYBOARD,
		})

		await ctx.deleteMessage(message_delete.message_id)

		const promise = new Promise(res => setTimeout(() => res(), 60000))
		promise.then(() => {
			if (!ctx.session.user.set_time) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)
		console.log(result)

		if (result.data.status === "ERROR") {
			message = "Ошибка"
		}

		const { message_id } = await ctx.reply(message, {
			reply_markup: KEYBOARD.EDIT_NUMBER,
			parse_mode: "HTML",
		})

		ctx.session.user.code_call = result.data.code
		ctx.session.user.message_id = message_id
		ctx.session.user.set_time = true
		ctx.session.user.set_int = 0
		ctx.session.user.int_code = 0
	} catch (err) {
		console.log(err)
	}
})

scene.action("edit_number", ctx => {
	try {
		ctx.session.user.set_time = false
		ctx.deleteMessage(ctx.session.user.message_id)
		ctx.scene.enter("PHONE_REGISTRATION_SCENE")
	} catch (err) {
		console.log(err)
	}
})

scene.action("repear_call", async ctx => {
	try {
		const phone = ctx.session.user.phone

		// Проверка на количесто нажатий на "Повторить звонок"
		if (ctx.session.user.set_int >= 1) {
			const result = await getCall(ctx.session.user.phone)
			ctx.session.user.code_call = result.data.code

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
			if (!ctx.session.user.set_time) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)

		ctx.session.user.code_call = result.data.code
		ctx.session.user.set_int++
	} catch (err) {
		console.log(err)
	}
})

scene.on("text", (ctx, next) => {
	try {
		if (ctx.message.text.slice(0, 1) === "/") {
			ctx.session.user.set_time = false
			return next()
		}

		ctx.deleteMessage(ctx.message.message_id)

		if (ctx.message.text != ctx.session.user.code_call) {
			if (ctx.session.user.int_code > 2) {
				ctx.telegram.editMessageText(
					ctx.session.user.chat_id,
					ctx.session.user.message_id,
					null,
					"Вы привысили количество попыток",
					{ parse_mode: "HTML" }
				)
				return
			}

			ctx.telegram.editMessageText(
				ctx.session.user.chat_id,
				ctx.session.user.message_id,
				null,
				"Не верный код",
				{ parse_mode: "HTML" }
			)
			return
		}

		ctx.telegram.editMessageText(
			ctx.session.user.chat_id,
			ctx.session.user.message_id,
			null,
			TEMPLATE.PHONE_SUCCESS,
			{ parse_mode: "HTML" }
		)

		const promise = new Promise(res => setTimeout(() => res(), 2000))
		promise.then(() => {
			ctx.deleteMessage(ctx.session.user.message_id)
			ctx.scene.enter("USER_MAIN_SCENE")
		})

		ctx.session.user.set_time = false
	} catch (err) {
		console.log(err)
	}
})

module.exports = scene
