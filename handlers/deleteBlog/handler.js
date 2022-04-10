const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require("/opt/nodejs/middlewares/httpErrorHandler.middleware");
const validationMiddleware = require("/opt/nodejs/resources/middlewares/validation.middleware");
const BlogsRepository = require("/opt/nodejs/resources/repositories/blogs.repository");
const BlogsResults = require("/opt/nodejs/resources/services/blogs.results");
const BlogsService = require("/opt/nodejs/resources/services/blogs.service");
const { blogParamsSchema } = require("/opt/nodejs/resources/validation/blogs.validation");

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

exports.handler = middy(deleteBlog)
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(httpErrorHandlerMiddleware());
