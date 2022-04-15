const {
	generateBlogContent,
	generateBlogContents,
	generateDatabaseBlog,
	generateDatabaseBlogs,
} = require("../blogs.seeder");
const { toBeUUIDv4, toBeDate, toBeOptionalDate } = require("../../matchers");

expect.extend({
	toBeUUIDv4,
	toBeDate,
	toBeOptionalDate,
});

describe("blog-generator", () => {
	describe("generate-blog-content", () => {
		test("It returns an object with 'title' and 'body' text properties", () => {
			const result = generateBlogContent();

			expect(result).toEqual({
				title: expect.any(String),
				body: expect.any(String),
			});
		});
	});

	describe("generate-blog-contents", () => {
		test("By default, it returns an array of blog content objects", () => {
			const result = generateBlogContents();

			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: expect.any(String),
						body: expect.any(String),
					}),
				])
			);
		});

		test("When specifying thee number of items, it returns an array of the same length", () => {
			const length = 5;
			const result = generateBlogContents(length);

			expect(result.length).toBe(length);
		});
	});

	describe("generate-database-blog", () => {
		test("It returns an object with 'id', 'title', 'body', 'createdAt', 'updatedAt' and 'type' properties", () => {
			const result = generateDatabaseBlog();

			expect(result).toEqual({
				id: expect.toBeUUIDv4(),
				createdAt: expect.toBeDate(),
				updatedAt: expect.toBeOptionalDate(),
				body: expect.any(String),
				title: expect.any(String),
				type: "blog",
			});
		});
	});

	describe("generate-database-blogs", () => {
		test("By default, it returns an array of database blog objects", () => {
			const result = generateDatabaseBlogs();

			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.toBeUUIDv4(),
						createdAt: expect.toBeDate(),
						updatedAt: expect.toBeOptionalDate(),
						body: expect.any(String),
						title: expect.any(String),
						type: "blog",
					}),
				])
			);
		});

		test("When specifying thee number of items, it returns an array of the same length", () => {
			const length = 5;
			const result = generateDatabaseBlogs(length);

			expect(result.length).toBe(length);
		});
	});
});
