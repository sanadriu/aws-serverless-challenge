const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandlerMiddleware = require(`/opt/nodejs/resources/middlewares/httpErrorHandler.middleware`);
const validationMiddleware = require(`/opt/nodejs/resources/middlewares/validation.middleware`);
const { createBlogBodySchema } = require(`/opt/nodejs/resources/validation/blogs.validation`);
const { handler } = require(`/opt/nodejs/handlers/createBlog`);

exports.handler = middy(handler)
	.use(jsonBodyParser())
	.use(validationMiddleware(createBlogBodySchema, "body"))
	.use(httpErrorHandlerMiddleware());
