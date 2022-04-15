const path = process.env.path || "/opt/nodejs";

const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require(`${path}/resources/middlewares/httpErrorHandler.middleware`);
const validationMiddleware = require(`${path}/resources/middlewares/validation.middleware`);
const dynamoDB = require(`${path}/resources/databases/dynamoDB`);
const BlogsRepository = require(`${path}/resources/repositories/blogs.repository`);
const BlogsResults = require(`${path}/resources/services/blogs.results`);
const BlogsService = require(`${path}/resources/services/blogs.service`);
const { blogParamsSchema } = require(`${path}/resources/validation/blogs.validation`);

const blogsRepository = new BlogsRepository(dynamoDB);
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const getBlog = async (event) => {
	const { id } = event.pathParameters;

	const { httpStatusCode, result, success, message } = await blogsService.getBlog(id);

	return {
		statusCode: httpStatusCode,
		body: JSON.stringify({ ...result, success, message }),
	};
};

exports.handler = middy(getBlog)
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(httpErrorHandlerMiddleware());
