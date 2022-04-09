function httpErrorHandlerMiddleware() {
	const onError = async (request) => {
		const { statusCode, message, ...rest } = request.error;

		return {
			statusCode: statusCode,
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
