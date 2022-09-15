const TEMPLATE = require("../template/ru")

module.exports = {
	NEW_USER_BUTTON: {
		inline_keyboard: [
			[{ text: TEMPLATE.REGISTRATION_BUTTON, callback_data: "registration" }],
			[{ text: TEMPLATE.ABOUT_US_BUTTON, callback_data: "about_us" }],
		],
	},
	PHONE_REGISTRATION_BUTTON: { keyboard: [[{ text: "Поделиться номером" }]] },
}
