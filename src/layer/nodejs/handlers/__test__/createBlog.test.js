jest.mock("../../resources/services/blogs.service");

const { handler } = require("../createBlog");
const BlogsResults = require("../../resources/services/blogs.results");
const BlogsService = require("../../resources/services/blogs.service");

const { generateBlogContent } = require("../../resources/seeders/blogs.seeder");

const createBlogMock = jest.spyOn(BlogsService.prototype, "createBlog");
const blogsResults = new BlogsResults();

describe("create-blog-handler", () => {
	const mockResult = blogsResults.blogCreated("dummy-id");

	createBlogMock.mockImplementation(() => mockResult);

	test("It calls the corresponding service method", async () => {
		expect.assertions(2);

		const content = generateBlogContent();
		const event = { body: content };

		await handler(event);

		expect(createBlogMock).toBeCalledTimes(1);
		expect(createBlogMock).toBeCalledWith(content);
	});

	test("It returns the service result", async () => {
		expect.assertions(2);

		const content = generateBlogContent();
		const event = { body: content };

		const result = await handler(event);

		const { statusCode, body } = result;
		const bodyObj = JSON.parse(body);

		expect(statusCode).toBe(mockResult.httpStatusCode);
		expect(bodyObj).toEqual({
			result: mockResult.result,
			success: mockResult.success,
			message: mockResult.message,
		});
	});
});
