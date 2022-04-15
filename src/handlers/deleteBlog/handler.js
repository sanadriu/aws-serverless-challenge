const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require(`/opt/nodejs/middlewares/httpErrorHandler.middleware`);
const validationMiddleware = require(`/opt/nodejs/resources/middlewares/validation.middleware`);
const { blogParamsSchema } = require(`/opt/nodejs/resources/validation/blogs.validation`);
const { handler } = require(`/opt/nodejs/handlers/deleteBlog`);

exports.handler = middy(handler)
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(httpErrorHandlerMiddleware());
