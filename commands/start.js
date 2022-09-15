const { Composer } = require("telegraf")
const { findUniqueUser, createUser } = require("../src/db")

const command = new Composer()
command.start(async ctx => {
	const chat = ctx.message.chat

	ctx.deleteMessage(ctx.message.message_id)

	if (ctx.session.user?.message_id) {
		ctx.deleteMessage(ctx.session.user.message_id)
	}

	let user = await findUniqueUser(chat)
	if (!user) user = await createUser(chat)

	ctx.session.user = user

	if (!user.phone) return ctx.scene.enter("NEW_USER_SCENE")

	if (user.role === "user") ctx.scene.enter("USER_MAIN_SCENE")
	if (user.role === "driver") ctx.scene.enter("DRIVER_MAIN_SCENE")
	if (user.role === "partner") ctx.scene.enter("PARTNER_MAIN_SCENE")
	if (user.role === "admin") ctx.scene.enter("ADMIN_MAIN_SCENE")
})

module.exports = command
