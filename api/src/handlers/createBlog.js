const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandlerMiddleware = require("../middlewares/httpErrorHandler.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const BlogsRepository = require("../repositories/blogs.repository");
const BlogsResults = require("../services/blogs.results");
const BlogsService = require("../services/blogs.service");
const { createBlogBodySchema } = require("../validation/blogs.validation");

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

module.exports.handler = middy(createBlog)
	.use(jsonBodyParser())
	.use(validationMiddleware(createBlogBodySchema, "body"))
	.use(httpErrorHandlerMiddleware());
