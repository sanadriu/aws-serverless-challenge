const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require("../middlewares/httpErrorHandler.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const BlogsRepository = require("../repositories/blogs.repository");
const BlogsResults = require("../services/blogs.results");
const BlogsService = require("../services/blogs.service");
const { blogParamsSchema } = require("../validation/blogs.validation");

const blogsRepository = new BlogsRepository();
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const deleteBlog = async (event) => {
	const { id } = event.pathParameters;

	const { httpStatusCode, result, success, message } = await blogsService.deleteBlog(id);

	return {
		statusCode: httpStatusCode,
		body: JSON.stringify({ ...result, success, message }),
	};
};

module.exports.handler = middy(deleteBlog)
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(httpErrorHandlerMiddleware());
