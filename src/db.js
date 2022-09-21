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
