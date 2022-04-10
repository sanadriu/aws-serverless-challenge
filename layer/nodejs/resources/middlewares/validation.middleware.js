const createHttpError = require("http-errors");
const { ValidationError } = require("yup");

function validationMiddleware(schema, property) {
	const before = async (request) => {
		try {
			request.event[property] = await schema.validate(request.event[property], {
				abortEarly: false,
				stripUnknown: true,
				strict: true,
			});
		} catch (error) {
			if (error instanceof ValidationError) {
				const reasons = {};

				error.inner.forEach(({ path, message }) => {
					reasons[path] = reasons[path] || message;
				});

				throw new createHttpError(400, { message: "Validation failed", reasons });
			} else {
				throw new createHttpError(500, { message: error.message });
			}
		}
	};

	return { before };
}

module.exports = validationMiddleware;
