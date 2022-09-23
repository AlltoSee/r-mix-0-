const { Scenes } = require("telegraf")

const TEMPLATE = require("../template/ru")
const KEYBOARD = require("../src/keyboards")

const scene = new Scenes.BaseScene("FROM_TAXI_SCENE")
scene.enter(async ctx => {
	ctx.editMessageMedia(
		{
			type: "photo",
			media: { source: "./img/from.jpg" },
			caption: `<b>Откуда?</b>

Нажмите <b>"Адрес"</b> или <b>"Популярные места"</b> и начните писать. После выберите подходящий вариант.

<i>Что уже написано в поле вода лучше не стирать</i>`,
			parse_mode: "HTML",
		},
		{
			reply_markup: {
				inline_keyboard: [
					[{ text: "Адрес", switch_inline_query_current_chat: "#a " }],
					[
						{
							text: "Популярные места",
							switch_inline_query_current_chat: "#p ",
						},
					],
					[{ text: "Мои адреса", switch_inline_query_current_chat: "#m " }],
					[{ text: "Отмена", callback_data: "cancel" }],
				],
			},
		}
	)
})

scene.action("cancel", ctx => {
	ctx.deleteMessage(ctx.session.message.message_id)
	ctx.scene.enter("USER_MAIN_SCENE")
})

module.exports = scene
