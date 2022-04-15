jest.mock("../../resources/services/blogs.service");

const { handler } = require("../updateBlog");
const BlogsResults = require("../../resources/services/blogs.results");
const BlogsService = require("../../resources/services/blogs.service");

const { generateBlogContent } = require("../../resources/seeders/blogs.seeder");

const updateBlogMock = jest.spyOn(BlogsService.prototype, "updateBlog");
const blogsResults = new BlogsResults();

describe("update-blog-handler", () => {
	const mockResult = blogsResults.blogUpdated();

	updateBlogMock.mockImplementation(() => mockResult);

	test("It calls the corresponding service method", async () => {
		expect.assertions(2);

		const id = "foo";
		const content = generateBlogContent();

		const event = { body: content, pathParameters: { id } };

		await handler(event);

		expect(updateBlogMock).toBeCalledTimes(1);
		expect(updateBlogMock).toBeCalledWith(id, content);
	});

	test("It returns the service result", async () => {
		expect.assertions(2);

		const id = "foo";
		const content = generateBlogContent();

		const event = { body: content, pathParameters: { id } };

		const result = await handler(event);

		const { statusCode, body } = result;
		const bodyObj = JSON.parse(body);

		expect(statusCode).toBe(mockResult.httpStatusCode);
		expect(bodyObj).toEqual({
			success: mockResult.success,
			message: mockResult.message,
		});
	});
});
