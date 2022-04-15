function httpErrorHandlerMiddleware() {
	const onError = async (request) => {
		const { statusCode, message, ...rest } = request.error;

		return {
			statusCode: statusCode,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				success: false,
				message,
				...rest,
			}),
		};
	};

	return { onError };
}

module.exports = httpErrorHandlerMiddleware;
