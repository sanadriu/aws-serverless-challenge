jest.mock("../../resources/services/blogs.service");

const { handler } = require("../getBlog");
const BlogsResults = require("../../resources/services/blogs.results");
const BlogsService = require("../../resources/services/blogs.service");

const { generateDatabaseBlog } = require("../../resources/seeders/blogs.seeder");

const getBlogMock = jest.spyOn(BlogsService.prototype, "getBlog");
const blogsResults = new BlogsResults();

describe("get-blog-handler", () => {
	const mockResult = blogsResults.blogFetched(generateDatabaseBlog());

	getBlogMock.mockImplementation(() => mockResult);

	test("It calls the corresponding service method", async () => {
		expect.assertions(2);

		const id = "foo";
		const event = {
			pathParameters: { id },
		};

		await handler(event);

		expect(getBlogMock).toBeCalledTimes(1);
		expect(getBlogMock).toBeCalledWith(id);
	});

	test("It returns the service result", async () => {
		expect.assertions(2);

		const id = "foo";
		const event = {
			pathParameters: { id },
		};

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
