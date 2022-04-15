jest.mock("../../resources/services/blogs.service");

const { handler } = require("../deleteBlog");
const BlogsResults = require("../../resources/services/blogs.results");
const BlogsService = require("../../resources/services/blogs.service");

const deleteBlogMock = jest.spyOn(BlogsService.prototype, "deleteBlog");
const blogsResults = new BlogsResults();

describe("delete-blog-handler", () => {
	const mockResult = blogsResults.blogDeleted();

	deleteBlogMock.mockImplementation(() => mockResult);

	test("It calls the corresponding service method", async () => {
		expect.assertions(2);

		const id = "foo";

		const event = { pathParameters: { id } };

		await handler(event);

		expect(deleteBlogMock).toBeCalledTimes(1);
		expect(deleteBlogMock).toBeCalledWith(id);
	});

	test("It returns the service result", async () => {
		expect.assertions(2);

		const id = "foo";

		const event = { pathParameters: { id } };

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
