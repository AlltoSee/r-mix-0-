const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

exports.findUniqueUser = async chat => {
	return await prisma.user.findUnique({
		where: { chat_id: chat.id.toString() },
	})
}

exports.findUniqueUserPhone = async phone => {
	return await prisma.user.findUnique({
		where: { phone: phone },
	})
}

exports.createUser = async chat => {
	return await prisma.user.create({
		data: {
			chat_id: chat.id.toString(),
			first_name: chat.first_name,
			last_name: chat.last_name,
		},
	})
}

exports.updateUser = async user => {
	return await prisma.user.update({
		where: { chat_id: user.chat_id.toString() },
		data: {
			phone: user.phone,
			name: user.name,
		},
	})
}

exports.updateUserStatus = async (chat, status) => {
	return await prisma.user.update({
		where: { chat_id: chat.id.toString() },
		data: {
			status: status,
		},
	})
}

exports.findManyCityAddress = async data => {
	return await prisma.city.findMany({
		where: {
			address: {
				contains: data.slice(3),
			},
		},
	})
}

exports.findManyCityPlaces = async data => {
	return await prisma.city.findMany({
		where: {
			places: {
				contains: data.slice(3),
			},
		},
	})
}

exports.findUniqueCity = async id => {
	return await prisma.city.findUnique({
		where: { id: +id },
	})
}
