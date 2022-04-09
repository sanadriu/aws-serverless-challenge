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

const getBlog = async (event) => {
	const { id } = event.pathParameters;

	const { httpStatusCode, result, success, message } = await blogsService.getBlog(id);

	return {
		statusCode: httpStatusCode,
		Headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ...result, success, message }),
	};
};

module.exports.handler = middy(getBlog)
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(httpErrorHandlerMiddleware());
