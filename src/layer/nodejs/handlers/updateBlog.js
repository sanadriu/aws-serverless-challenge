const dynamoDB = require(`../resources/databases/dynamoDB`);
const BlogsRepository = require(`../resources/repositories/blogs.repository`);
const BlogsResults = require(`../resources/services/blogs.results`);
const BlogsService = require(`../resources/services/blogs.service`);

const blogsRepository = new BlogsRepository(dynamoDB);
const blogsResults = new BlogsResults();
const blogsService = new BlogsService(blogsRepository, blogsResults);

const updateBlog = async (event) => {
	const { id } = event.pathParameters;
	const content = event.body;

	const { httpStatusCode, result, success, message } = await blogsService.updateBlog(id, content);

	return {
		statusCode: httpStatusCode,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ result, success, message }),
	};
};

module.exports.handler = updateBlog;
