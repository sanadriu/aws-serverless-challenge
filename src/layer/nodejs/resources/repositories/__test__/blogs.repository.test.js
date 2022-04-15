const uuid = require("uuid");
const dynamoDB = require("../../databases/dynamoDB");
const createTableInputs = require("../../databases/dynamoDB.tables");
const { createTables, deleteTables, deleteTableData } = require("../../databases/dynamoDB.utils");
const { generateDatabaseBlogs, generateBlogContent, generateDatabaseBlog } = require("../../seeders/blogs.seeder");
const { toBeUUIDv4, toBeDate, toBeOptionalDate } = require("../../matchers");

const BlogsRepository = require("../blogs.repository");

const blogsRepository = new BlogsRepository(dynamoDB);
const tableName = "Blogs";

expect.extend({
	toBeUUIDv4,
	toBeDate,
	toBeOptionalDate,
});

describe("blogs-repository", () => {
	beforeAll(async () => {
		await deleteTables();
		await createTables(createTableInputs);
	});

	afterAll(async () => {
		await deleteTables();
	});

	describe("get-blog", () => {
		afterEach(async () => {
			await deleteTableData(tableName);
		});

		test("1. It must return a blog by its ID", async () => {
			expect.assertions(1);

			const blog = generateDatabaseBlog();

			await dynamoDB.put({ TableName: tableName, Item: blog }).promise();

			const result = await blogsRepository.getBlog(blog.id);

			expect(result).toEqual(blog);
		});

		test("2. It must return 'null' if a blog does not exist", async () => {
			expect.assertions(1);

			const id = uuid.v4();
			const result = await blogsRepository.getBlog(id);

			expect(result).toEqual(null);
		});

		test("3. It must return 'null' if a ID is not provided", async () => {
			expect.assertions(1);

			const result = await blogsRepository.getBlog();

			expect(result).toEqual(null);
		});

		test("4. It must return 'null' if a ID is not a UUID", async () => {
			expect.assertions(1);

			const id = "foo";
			const result = await blogsRepository.getBlog(id);

			expect(result).toEqual(null);
		});
	});

	describe("get-blogs", () => {
		beforeAll(async () => {
			const blogs = generateDatabaseBlogs(5);
			const insertion = blogs.map((blog) => dynamoDB.put({ TableName: tableName, Item: blog }).promise());

			await Promise.all(insertion);
		});

		afterAll(async () => {
			await deleteTableData(tableName);
		});

		test("1. If table has content, it must return an array of blogs and the number of items", async () => {
			expect.assertions(3);

			const result = await blogsRepository.getBlogs();

			expect(result.items.length).toBeGreaterThan(0);
			expect(result.count).toBe(result.items.length);
			expect(result.items).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						updatedAt: expect.toBeOptionalDate(),
						createdAt: expect.toBeDate(),
						title: expect.any(String),
						body: expect.any(String),
					}),
				])
			);
		});

		test("2. If table has 2 or more items, it must return an array of blogs sorted by 'createdAt' when specified", async () => {
			expect.assertions(2);

			const result = await blogsRepository.getBlogs({ sort: "createdAt" });

			const items = result.items;
			const itemsSorted = [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

			expect(items.length).toBeGreaterThanOrEqual(2);
			expect(items).toEqual(itemsSorted);
		});

		test("3. If table has 2 or more items, it must return an array of blogs sorted by 'updatedAt' when specified", async () => {
			expect.assertions(2);

			const result = await blogsRepository.getBlogs({ sort: "updatedAt" });

			const items = result.items;
			const itemsSorted = [...items].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

			expect(items.length).toBeGreaterThanOrEqual(2);
			expect(items).toEqual(itemsSorted);
		});
	});

	describe("create-blog", () => {
		afterEach(async () => {
			await deleteTableData(tableName);
		});

		test("1. It creates a blog in the table", async () => {
			expect.assertions(1);

			const content = generateBlogContent();

			const numItemsBeforeCreate = (await dynamoDB.scan({ TableName: tableName }).promise()).Count;

			await blogsRepository.createBlog(content);

			const numItemsAfterCreate = (await dynamoDB.scan({ TableName: tableName }).promise()).Count;

			expect(numItemsAfterCreate - numItemsBeforeCreate).toBe(1);
		});

		test("2. It return the blog ID as uuid", async () => {
			expect.assertions(1);

			const content = generateBlogContent();
			const result = await blogsRepository.createBlog(content);

			expect(result).toBeUUIDv4();
		});

		test("3. Item is created with the passed content + 'id' attribute + 'createdAt' attribute", async () => {
			expect.assertions(5);

			const content = generateBlogContent();
			const result = await blogsRepository.createBlog(content);
			const createdBlog = await blogsRepository.getBlog(result);

			expect(createdBlog).toHaveProperty("id", expect.toBeUUIDv4());
			expect(createdBlog).toHaveProperty("createdAt", expect.toBeDate());
			expect(createdBlog).toHaveProperty("updatedAt", "never");
			expect(createdBlog).toHaveProperty("title", expect.any(String));
			expect(createdBlog).toHaveProperty("body", expect.any(String));
		});

		test("3. Error is thrown if 'title' or 'body' are missing", () => {
			expect.assertions(1);

			expect(blogsRepository.createBlog()).rejects.toBeInstanceOf(Error);
		});
	});

	describe("update-blog", () => {
		afterEach(async () => {
			await deleteTableData(tableName);
		});

		test("1. Given a blog ID and a new content, It only updates the 'title' and the 'body'", async () => {
			expect.assertions(5);

			const createdBlog = generateDatabaseBlog();
			const newFullBlog = generateDatabaseBlog();

			await dynamoDB.put({ TableName: tableName, Item: createdBlog }).promise();
			await blogsRepository.updateBlog(createdBlog.id, newFullBlog);

			const { Item: updatedBlog } = await dynamoDB.get({ TableName: tableName, Key: { id: createdBlog.id } }).promise();

			expect(updatedBlog).toHaveProperty("id", createdBlog.id);
			expect(updatedBlog).toHaveProperty("createdAt", createdBlog.createdAt);
			expect(updatedBlog).toHaveProperty("updatedAt", expect.toBeDate());
			expect(updatedBlog).toHaveProperty("title", newFullBlog.title);
			expect(updatedBlog).toHaveProperty("body", newFullBlog.body);
		});

		test("2. Given a blog ID of a blog that does not exists, it return 'null'", async () => {
			expect.assertions(1);

			const id = uuid.v4();
			const content = generateBlogContent();

			const result = await blogsRepository.updateBlog(id, content);

			expect(result).toEqual(null);
		});

		test("3. It must return 'null' if a ID is not provided", async () => {
			expect.assertions(1);

			const result = await blogsRepository.updateBlog();

			expect(result).toEqual(null);
		});

		test("4. It must return 'null' if a ID is not a UUID", async () => {
			expect.assertions(1);

			const id = "foo";
			const result = await blogsRepository.updateBlog(id);

			expect(result).toEqual(null);
		});
	});

	describe("delete-blog", () => {
		afterEach(async () => {
			await deleteTableData(tableName);
		});

		test("1. Given a blog ID, it deletes a blog in the table", async () => {
			expect.assertions(1);

			const blog = generateDatabaseBlog();
			await dynamoDB.put({ TableName: tableName, Item: blog }).promise();

			const numItemsBeforeDelete = (await dynamoDB.scan({ TableName: tableName }).promise()).Count;

			await blogsRepository.deleteBlog(blog.id);

			const numItemsAfterDelete = (await dynamoDB.scan({ TableName: tableName }).promise()).Count;

			expect(numItemsBeforeDelete - numItemsAfterDelete).toBe(1);
		});

		test("2. Given a blog ID of a blog that does not exists, it return 'null'", async () => {
			expect.assertions(1);

			const id = uuid.v4();

			const result = await blogsRepository.deleteBlog(id);

			expect(result).toEqual(null);
		});

		test("3. It must return 'null' if a ID is not provided", async () => {
			expect.assertions(1);

			const result = await blogsRepository.deleteBlog();

			expect(result).toEqual(null);
		});

		test("4. It must return 'null' if a ID is not a UUID", async () => {
			expect.assertions(1);

			const id = "foo";
			const result = await blogsRepository.deleteBlog(id);

			expect(result).toEqual(null);
		});
	});
});
