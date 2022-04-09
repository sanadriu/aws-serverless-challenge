const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require("../middlewares/httpErrorHandler.middleware");
const BlogsRepository = require("../repositories/blogs.repository");
const BlogsResults = require("../services/blogs.results");
const BlogsService = require("../services/blogs.service");

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

module.exports.handler = middy(getBlogs).use(httpErrorHandlerMiddleware({}));
