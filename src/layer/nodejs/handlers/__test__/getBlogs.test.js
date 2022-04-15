jest.mock("../../resources/services/blogs.service");

const { handler } = require("../getBlogs");
const BlogsResults = require("../../resources/services/blogs.results");
const BlogsService = require("../../resources/services/blogs.service");

const { generateDatabaseBlogs } = require("../../resources/seeders/blogs.seeder");

const getBlogsMock = jest.spyOn(BlogsService.prototype, "getBlogs");
const blogsResults = new BlogsResults();

describe("get-blogs-handler", () => {
	const mockResult = blogsResults.blogsFetched(generateDatabaseBlogs());

	getBlogsMock.mockImplementation(() => mockResult);

	test("It calls the corresponding service method", async () => {
		expect.assertions(1);

		await handler();

		expect(getBlogsMock).toBeCalledTimes(1);
	});

	test("It returns the service result", async () => {
		expect.assertions(2);

		const result = await handler();

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
