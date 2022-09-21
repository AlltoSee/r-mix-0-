const { Scenes } = require("telegraf")
const axios = require("axios")
const db = require("../src/db")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

//---------- Fynction ----------//
async function getCall(phone) {
	return axios.get(
		`https://sms.ru/code/call?phone=${phone}&ip=-1&api_id=${process.env.SMS_API}`
	)
}

async function editMessageText(ctx) {
	const message = await ctx.telegram.editMessageText(
		ctx.session.user.chat_id,
		ctx.session.message.message_id,
		null,
		TEMPLATE.CODE_CALL_REGISTRATION_MESSAGE(ctx.session.user.phone),
		{
			reply_markup: KEYBOARD.REPEAR_CALL,
			parse_mode: "HTML",
		}
	)
	console.log(message)
	ctx.session.message = message
}

const promise = (ctx, time) => {
	return new Promise(res => {
		let current = 0
		setTimeout(function go() {
			if (!ctx.session.promiseTimeout) return
			if (current >= time) return res()
			setTimeout(go, 1000)
			current++
		}, 1000)
	})
}
//----------!!! Fynction !!!----------//

const scene = new Scenes.BaseScene("CODE_REGISTRATION_SCENE")
scene.enter(async ctx => {
	try {
		let text = TEMPLATE.CODE_REGISTRATION_MESSAGE(1, ctx.session.user.phone)

		const messageDelete = await ctx.reply("...", {
			reply_markup: KEYBOARD.REMOVE_KEYBOARD,
		})

		await ctx.deleteMessage(messageDelete.message_id)

		promise(ctx, 60).then(() => {
			if (!ctx.session.promiseTimeout) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)

		if (result.data.status === "ERROR") {
			ctx.session.promiseTimeout = false
			text = TEMPLATE.MANY_REQUEST
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
		let text = TEMPLATE.CODE_REGISTRATION_MESSAGE(2, ctx.session.user.phone)

		if (ctx.session.registration.amount_call >= 1) {
			text = TEMPLATE.CODE_TIME_REGISTRATION_MESSAGE(ctx.session.user.phone)
			ctx.session.promiseTimeout = false
		}

		promise(ctx, 120).then(() => {
			if (!ctx.session.promiseTimeout) return
			editMessageText(ctx)
		})

		const result = await getCall(ctx.session.user.phone)

		if (result.data.status === "ERROR") {
			ctx.session.promiseTimeout = false
			text = TEMPLATE.MANY_REQUEST
		}

		ctx.editMessageText(text, {
			reply_markup: KEYBOARD.EDIT_NUMBER,
			parse_mode: "HTML",
		})

		ctx.session.registration.code = result.data.code
		ctx.session.registration.amount_call++
	} catch (err) {
		console.log(err)
	}
})

scene.on("text", async (ctx, next) => {
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

			let text = TEMPLATE.INCORRECT_CODE

			if (ctx.session.registration.amount_code > 2) {
				text = TEMPLATE.CODE_EXCEEDED
				ctx.session.promiseTimeout = false
			}

			ctx.telegram.editMessageText(
				ctx.session.user.chat_id,
				ctx.session.message.message_id,
				null,
				text,
				{ parse_mode: "HTML" }
			)

			promise(ctx, 1).then(() => {
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

			ctx.session.registration.amount_code++
			return
		}

		const uniquePhone = await db.findUniqueUserPhone(ctx.session.user.phone)
		if (uniquePhone != null) {
			ctx.telegram.editMessageText(
				ctx.session.user.chat_id,
				ctx.session.message.message_id,
				null,
				TEMPLATE.PHONE_IS_LIKEN_TO_ANOTHER,
				{ parse_mode: "HTML", reply_markup: KEYBOARD.EDIT_NUMBER }
			)
			ctx.session.promiseTimeout = false
			return
		}

		ctx.telegram.editMessageText(
			ctx.session.user.chat_id,
			ctx.session.message.message_id,
			null,
			TEMPLATE.PHONE_SUCCESS,
			{ parse_mode: "HTML" }
		)

		await db.updateUser(ctx.session.user)

		promise(ctx, 1).then(() => {
			ctx.deleteMessage(ctx.session.message.message_id)
			ctx.session.promiseTimeout = false
			ctx.scene.enter("USER_MAIN_SCENE")
		})
	} catch (err) {
		ctx.session.promiseTimeout = false
		console.log(err)
	}
})

module.exports = scene
