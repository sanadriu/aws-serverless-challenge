const path = process.env.path || "/opt/nodejs";

const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandlerMiddleware = require(`${path}/resources/middlewares/httpErrorHandler.middleware`);
const validationMiddleware = require(`${path}/resources/middlewares/validation.middleware`);
const dynamoDB = require(`${path}/resources/databases/dynamoDB`);
const BlogsRepository = require(`${path}/resources/repositories/blogs.repository`);
const BlogsResults = require(`${path}/resources/services/blogs.results`);
const BlogsService = require(`${path}/resources/services/blogs.service`);
const { updateBlogBodySchema, blogParamsSchema } = require(`${path}/resources/validation/blogs.validation`);

const blogsRepository = new BlogsRepository(dynamoDB);
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const updateBlog = async (event) => {
	const { id } = event.pathParameters;
	const content = event.body;

	const { httpStatusCode, result, success, message } = await blogsService.updateBlog(id, content);

	return {
		statusCode: httpStatusCode,
		body: JSON.stringify({ ...result, success, message }),
	};
};

exports.handler = middy(updateBlog)
	.use(jsonBodyParser())
	.use(validationMiddleware(blogParamsSchema, "pathParameters"))
	.use(validationMiddleware(updateBlogBodySchema, "body"))
	.use(httpErrorHandlerMiddleware());
