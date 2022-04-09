const { ValidationError } = require("yup");
const createError = require("http-errors");

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

				throw new createError(400, {
					message: "Validation failed",
					reasons,
				});
			} else {
				throw new createError(500, {
					message: error.message,
				});
			}
		}
	};

	return { before };
}

module.exports = validationMiddleware;
