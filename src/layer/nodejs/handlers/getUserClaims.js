const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require(`../resources/middlewares/httpErrorHandler.middleware`);

const getUserClaims = async (event) => {
	try {
		if (!event.headers.authorization) {
			return {
				statusCode: 200,
				body: JSON.stringify({ payload: null }),
			};
		}

		const token = event.headers.authorization.split(" ")[1];
		const payload = jwt.decode(token);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ payload }),
		};
	} catch (error) {
		throw createHttpError(500, { message: error.message });
	}
};

exports.handler = middy(getUserClaims).use(httpErrorHandlerMiddleware());
