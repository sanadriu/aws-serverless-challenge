const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require("/opt/nodejs/resources/middlewares/httpErrorHandler.middleware");
const BlogsRepository = require("/opt/nodejs/resources/repositories/blogs.repository");
const BlogsResults = require("/opt/nodejs/resources/services/blogs.results");
const BlogsService = require("/opt/nodejs/resources/services/blogs.service");

const blogsRepository = new BlogsRepository();
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
