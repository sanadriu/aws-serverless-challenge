const BlogsRepository = require("../../repositories/blogs.repository");
const { generateBlogContent } = require("../../seeders/blogs.seeder");
const BlogsResults = require("../blogs.results");
const BlogsService = require("../blogs.service");

const getBlogMock = jest.spyOn(BlogsRepository.prototype, "getBlog");
const getBlogsMock = jest.spyOn(BlogsRepository.prototype, "getBlogs");
const createBlogMock = jest.spyOn(BlogsRepository.prototype, "createBlog");
const updateBlogMock = jest.spyOn(BlogsRepository.prototype, "updateBlog");
const deleteBlogMock = jest.spyOn(BlogsRepository.prototype, "deleteBlog");

const blogsResults = new BlogsResults();
const blogsRepository = new BlogsRepository();
const blogsService = new BlogsService(blogsRepository, blogsResults);

describe("blogs-service", () => {
	describe("get-blog", () => {
		afterEach(() => {
			getBlogMock.mockReset();
		});

		test("1. Given an ID of a blog that exists, the repository is used and it returns a successful result", async () => {
			getBlogMock.mockImplementation(async () => ({}));

			const id = "foo";
			const result = await blogsService.getBlog(id);

			expect(getBlogMock).toBeCalledWith(id);
			expect(getBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				result: expect.any(Object),
				message: "Blog has been fetched successfully",
				success: true,
				httpStatusCode: 200,
			});
		});

		test("2. Given an ID of a blog that does not exist, the repository is used and it returns a not found result", async () => {
			getBlogMock.mockImplementation(async () => null);

			const id = "foo";
			const result = await blogsService.getBlog(id);

			expect(getBlogMock).toBeCalledWith(id);
			expect(getBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: "Blog not found",
				success: false,
				httpStatusCode: 404,
			});
		});

		test("3. If the repository method fails, it returns the reason of the failure", async () => {
			getBlogMock.mockImplementation(async () => {
				throw new Error("Ops!");
			});

			const result = await blogsService.getBlog();

			expect(getBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: expect.any(String),
				success: false,
				httpStatusCode: 500,
			});
		});
	});

	describe("get-blogs", () => {
		afterEach(() => {
			getBlogsMock.mockReset();
		});

		test("1. The repository is used and it returns a successful result", async () => {
			const mockResult = { items: [], count: 0 };

			getBlogsMock.mockImplementation(async () => mockResult);

			const params = "foo";
			const result = await blogsService.getBlogs(params);

			expect(getBlogsMock).toBeCalledWith(params);
			expect(getBlogsMock).toBeCalledTimes(1);
			expect(result).toEqual({
				result: mockResult,
				message: "Blogs has been fetched successfully",
				success: true,
				httpStatusCode: 200,
			});
		});

		test("2. If the repository method fails, it returns the reason of the failure", async () => {
			getBlogsMock.mockImplementation(async () => {
				throw new Error("Ops!");
			});

			const result = await blogsService.getBlogs();

			expect(getBlogsMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: expect.any(String),
				success: false,
				httpStatusCode: 500,
			});
		});
	});

	describe("create-blog", () => {
		afterEach(() => {
			createBlogMock.mockReset();
		});

		test("1. Given some content, the repository is used and it returns a succesful result", async () => {
			const mockResult = "foo";

			createBlogMock.mockImplementation(async () => mockResult);

			const content = generateBlogContent();
			const result = await blogsService.createBlog(content);

			expect(createBlogMock).toBeCalledWith(content);
			expect(createBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				result: mockResult,
				message: "Blog has been created successfully",
				success: true,
				httpStatusCode: 201,
			});
		});

		test("2. If the repository method fails, it returns the reason of the failure", async () => {
			createBlogMock.mockImplementation(async () => {
				throw new Error("Ops!");
			});

			const result = await blogsService.createBlog();

			expect(createBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: expect.any(String),
				success: false,
				httpStatusCode: 500,
			});
		});
	});

	describe("update-blog", () => {
		afterEach(() => {
			updateBlogMock.mockReset();
		});

		test("1. Given an ID and new content for a blog that exists, the repository is used and it returns a successful result", async () => {
			updateBlogMock.mockImplementation(async () => ({}));

			const id = "foo";
			const content = generateBlogContent();
			const result = await blogsService.updateBlog(id, content);

			expect(updateBlogMock).toBeCalledWith(id, content);
			expect(updateBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: "Blog has been updated successfully",
				success: true,
				httpStatusCode: 200,
			});
		});

		test("2. Given an ID of a blog that does not exist, the repository is used and it returns a not found result", async () => {
			updateBlogMock.mockImplementation(async () => null);

			const id = "foo";
			const content = generateBlogContent();
			const result = await blogsService.updateBlog(id, content);

			expect(updateBlogMock).toBeCalledWith(id, content);
			expect(updateBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: "Blog not found",
				success: false,
				httpStatusCode: 404,
			});
		});

		test("3. If the repository method fails, it returns the reason of the failure", async () => {
			updateBlogMock.mockImplementation(async () => {
				throw new Error("Ops!");
			});

			const result = await blogsService.updateBlog();

			expect(updateBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: expect.any(String),
				success: false,
				httpStatusCode: 500,
			});
		});
	});

	describe("delete-blog", () => {
		afterEach(() => {
			deleteBlogMock.mockReset();
		});

		test("1. Given an ID and new content for a blog that exists, the repository is used and it returns a successful result", async () => {
			deleteBlogMock.mockImplementation(async () => ({}));

			const id = "foo";
			const result = await blogsService.deleteBlog(id);

			expect(deleteBlogMock).toBeCalledWith(id);
			expect(deleteBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: "Blog has been deleted successfully",
				success: true,
				httpStatusCode: 200,
			});
		});

		test("2. Given an ID of a blog that does not exist, the repository is used and it returns a not found result", async () => {
			deleteBlogMock.mockImplementation(async () => null);

			const id = "foo";
			const result = await blogsService.deleteBlog(id);

			expect(deleteBlogMock).toBeCalledWith(id);
			expect(deleteBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: "Blog not found",
				success: false,
				httpStatusCode: 404,
			});
		});

		test("3. If the repository method fails, it returns the reason of the failure", async () => {
			deleteBlogMock.mockImplementation(async () => {
				throw new Error("Ops!");
			});

			const result = await blogsService.deleteBlog();

			expect(deleteBlogMock).toBeCalledTimes(1);
			expect(result).toEqual({
				message: expect.any(String),
				success: false,
				httpStatusCode: 500,
			});
		});
	});
});
