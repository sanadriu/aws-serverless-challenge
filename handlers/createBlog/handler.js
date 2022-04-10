const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandlerMiddleware = require("/opt/nodejs/resources/middlewares/httpErrorHandler.middleware");
const validationMiddleware = require("/opt/nodejs/resources/middlewares/validation.middleware");
const BlogsRepository = require("/opt/nodejs/resources/repositories/blogs.repository");
const BlogsResults = require("/opt/nodejs/resources/services/blogs.results");
const BlogsService = require("/opt/nodejs/resources/services/blogs.service");
const { createBlogBodySchema } = require("/opt/nodejs/resources/validation/blogs.validation");

const blogsRepository = new BlogsRepository();
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const createBlog = async (event) => {
	const content = event.body;

	const { httpStatusCode, result, success, message } = await blogsService.createBlog(content);

	return {
		statusCode: httpStatusCode,
		body: JSON.stringify({ ...result, success, message }),
	};
};

exports.handler = middy(createBlog)
	.use(jsonBodyParser())
	.use(validationMiddleware(createBlogBodySchema, "body"))
	.use(httpErrorHandlerMiddleware());
