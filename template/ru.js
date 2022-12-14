module.exports = {
	NEW_USER_MESSAGE:
		'<b>Здравствуйте!</b> Чтобы воспользоваться нашими услугами, нужно подтвердить номер телефона, для это нажмите кнопку <b>"Регистрация"</b>.',
	REGISTRATION_BUTTON: "Регистрация",
	ABOUT_US_BUTTON: "О нас",
	NAME_REGISTRATION_MESSAGE: "Напишите ваше имя",
	PHONE_REGISTRATION_MESSAGE:
		'Нажмите на кнопку <b>"Поделиться номером"</b> или напишите номер телефона вручную.\n\n<i>Пример: 8 987 147 57 67\n\n💬 Если вы не видите кнопку, то просто нажмите квадратик с четырьмя точками.</i>',
	PHONE_ERR_REGISTRATION_MESSAGE: "Неверный формат номера",
	CODE_REGISTRATION_MESSAGE: (int, phone) =>
		`<b>Напишите код.</b>\nВ течение минуты вам поступит звонок на номер <b>${phone}</b> и ваш код это последний четыре цифры.\n\n<i>Пример: +7(987)147-<b>57</b>-<b>67</b>- Ваш код <b>5767</b>\n\n💬 Если не поступил звонок попробуйте нажать кнопку <b>"Повторить звонок"</b> через ${int} минуту или напишите сюда</i>`,
	CODE_TIME_REGISTRATION_MESSAGE: phone =>
		`<b>Напишите код.</b>\nВ течение минуты вам поступит звонок на номер <b>${phone}</b> и ваш код это последний четыре цифры.\n\n<i>Пример: +7(987)147-<b>57</b>-<b>67</b>- Ваш код <b>5767</b>\n\n💬 Если не поступил звонок напишите сюда</i>`,
	CODE_CALL_REGISTRATION_MESSAGE: phone =>
		`<b>Напишите код.</b>\nВам поступит звонок-сброс с уникального номера. Введите <b>последние 4 цифры</b> этого номера.\n\n<i>Пример: +7(987)147-<b>57</b>-<b>67</b>- Ваш код <b>5767</b>\n\n💬 Если не поступил звонок попробуйте нажать кнопку <b>"Повторить звонок"</b></i>\n\nВаш номер <b>${phone}</b>`,
	EDIT_NUMBER: "Сменить номер 🔄",
	REPEAT_CALL: "Повторить звонок 📞",
	PHONE_SUCCESS: "<b>Вы успешно подтвердили номер</b>",
	MANY_REQUEST:
		"‼️ 🚫 <b>Ваш номер заблокирован на 24 часа так как было выполнено более 3 запросов</b>",
	INCORRECT_CODE: "❗️ <b>Вы ввели не верный код</b>",
	CODE_EXCEEDED:
		"❗️ <b>Превышено ограничение на количчество попыток ввода кода</b>",
	PHONE_IS_LIKEN_TO_ANOTHER:
		"🚫 <b>Телефонный номер уже привязан к другому аккаунту</b>",
	GOOD_NIGHT: name => `<b>Доброй ночи, ${name}</b>`,
	GOOD_MORNING: name => `<b>Доброе утро, ${name}</b>`,
	GOOD_AFTERNOON: name => `<b>Добрый день, ${name}</b>`,
	GOOD_EVENING: name => `<b>Добрый вечер, ${name}</b>`,
	TAXI_BUTTON: "Заказать такси 🚖",
	TARIFFS_BUTTON: "Тарифы 🧾",
	PERSONAL_AREA_BUTTON: "Личный кабинет 🔑",
	SETTINGS_BUTTON: "Настройки ⚙️",
	ADDRESS_TAXI_MESSAGE: address => `<b>${address}</b>`,
	ADDRESS_BUTTON: "Адрес 🗺",
	POPULAR_PLACES_BUTTON: "Популярные места 📍",
	MY_ADDRESS: "Мои адреса 📌",
	CANCEL_BUTTON: "Отмена ❌",
	FROM_ADDRESS: "Откуда?",
	TO_ADDRESS: "Куда?",
	ORDER_BUTTON: "Заказать",
	STOP_BUTTON: "Добавить остановку",
	COMMENT_BUTTON: "Коминтарий водителю",
	ANOTHER_BUTTON: "Заказать дургому человеку",
	FROM_TAXI_MESSAGE: from => `<b>Откуда:</b> ${from.city}, ${from.address}`,
	STOP_TAXI_MESSAGE: stop => `<b>Остановка:</b> ${stop.city}, ${stop.address}`,
	TO_TAXI_MESSAGE: to => `<b>Куда:</b> ${to.city}, ${to.address}`,
	PRICE_TAXI_MESSAGE: price => `<b>Цена:</b> ${price} р (предварительно)`,
	COMMENT_TAXI_MESSAGE: comment => `<b>Коминтарий водителю:</b>\n${comment}`,
	TAXI_MESSAGE: data =>
		`<b>Откуда:</b> ${data.from}\n${data.stop}<b>Куда:</b> ${data.to}\n\n<b>Стоймость:</b> ${data.price} р (предворительно)\n<b>Коментарий водителю:</b>\n${data.comment}\n\nЕсли все верно нажмите <b>"Заказать"</b>`,
}
