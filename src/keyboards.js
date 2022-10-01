const TEMPLATE = require("../template/ru")

module.exports = {
	NEW_USER_BUTTON: {
		inline_keyboard: [
			[{ text: TEMPLATE.REGISTRATION_BUTTON, callback_data: "registration" }],
			[{ text: TEMPLATE.ABOUT_US_BUTTON, callback_data: "about_us" }],
		],
	},
	PHONE_REGISTRATION_BUTTON: {
		keyboard: [[{ text: "Поделиться номером", request_contact: true }]],
		resize_keyboard: true,
	},
	REMOVE_KEYBOARD: { remove_keyboard: true },
	EDIT_NUMBER: {
		inline_keyboard: [
			[{ text: TEMPLATE.EDIT_NUMBER, callback_data: "edit_number" }],
		],
	},
	REPEAR_CALL: {
		inline_keyboard: [
			[{ text: TEMPLATE.EDIT_NUMBER, callback_data: "edit_number" }],
			[{ text: TEMPLATE.REPEAT_CALL, callback_data: "repear_call" }],
		],
	},
	USER_MAIN: {
		inline_keyboard: [
			[{ text: TEMPLATE.TAXI_BUTTON, callback_data: "taxi" }],
			[{ text: TEMPLATE.TARIFFS_BUTTON, callback_data: "tariffs" }],
			[{ text: TEMPLATE.PERSONAL_AREA_BUTTON, callback_data: "personal_area" }],
			[{ text: TEMPLATE.SETTINGS_BUTTON, callback_data: "settings" }],
		],
	},
	ADDRESS_BUTTON: {
		inline_keyboard: [
			[
				{
					text: TEMPLATE.ADDRESS_BUTTON,
					switch_inline_query_current_chat: "#a ",
				},
			],
			[
				{
					text: TEMPLATE.POPULAR_PLACES_BUTTON,
					switch_inline_query_current_chat: "#p ",
				},
			],
			[
				{
					text: TEMPLATE.MY_ADDRESS,
					switch_inline_query_current_chat: "#m ",
				},
			],
			[{ text: TEMPLATE.CANCEL_BUTTON, callback_data: "cancel" }],
		],
	},
	MAIN_TAXI_BUTTON: {
		inline_keyboard: [
			[{ text: TEMPLATE.ORDER_BUTTON, callback_data: "order" }],
			[{ text: TEMPLATE.STOP_BUTTON, callback_data: "stop" }],
			[{ text: TEMPLATE.COMMENT_BUTTON, callback_data: "comment" }],
			[{ text: TEMPLATE.ANOTHER_BUTTON, callback_data: "another" }],
			[{ text: TEMPLATE.CANCEL_BUTTON, callback_data: "cancel" }],
		],
	},
	CANCEL_BUTTON: {
		inline_keyboard: [
			[{ text: TEMPLATE.CANCEL_BUTTON, callback_data: "cancel" }],
		],
	},
}
