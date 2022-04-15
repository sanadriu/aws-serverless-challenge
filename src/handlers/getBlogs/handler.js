const path = process.env.path || "/opt/nodejs";

const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require(`${path}/resources/middlewares/httpErrorHandler.middleware`);
const dynamoDB = require(`${path}/resources/databases/dynamoDB`);
const BlogsRepository = require(`${path}/resources/repositories/blogs.repository`);
const BlogsResults = require(`${path}/resources/services/blogs.results`);
const BlogsService = require(`${path}/resources/services/blogs.service`);

const blogsRepository = new BlogsRepository(dynamoDB);
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const getBlogs = async (event) => {
	const { httpStatusCode, result, success, message } = await blogsService.getBlogs();

	return {
		statusCode: httpStatusCode,
		body: JSON.stringify({ ...result, success, message }),
	};
};

exports.handler = middy(getBlogs).use(httpErrorHandlerMiddleware({}));
