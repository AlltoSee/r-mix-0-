const axios = require("axios")

exports.axiosCarrouting = async points => {
	return await axios({
		method: "POST",
		url: "https://routing.api.2gis.com/carrouting/6.0.0/global?key=rurbbn3446",
		header: "Content-Type: application/json",
		data: {
			locale: "ru",
			type: "jam",
			output: "simple",
			exclude: [
				{
					type: "point",
					points: [{ y: 55.40919317647197, x: 58.60024236176287 }],
					extent: 10,
					severity: "hard",
				},
				{
					type: "point",
					points: [{ y: 55.411872, x: 58.59974 }],
					extent: 10,
					severity: "hard",
				},
			],
			points: points,
		},
	})
}
