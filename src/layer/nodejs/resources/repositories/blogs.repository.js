const uuid = require("uuid");
const validator = require("validator");

class BlogsRepository {
	#ddb;
	#tableName = process.env.blogsTableName;

	constructor(ddb) {
		this.#ddb = ddb;
	}

	#getSortIndexName(sort) {
		switch (sort) {
			case "updatedAt":
				return process.env.blogsIndexNameUpdatedAt;
			case "createdAt":
				return process.env.blogsIndexNameCreatedAt;
			default:
				return undefined;
		}
	}

	async getBlog(id) {
		if (!(typeof id === "string" && validator.isUUID(id, 4))) return null;

		const result = await this.#ddb.get({ TableName: this.#tableName, Key: { id } }).promise();

		return result.Item || null;
	}

	async getBlogs(params = {}) {
		const { sort } = params;

		const result = await this.#ddb
			.scan({ TableName: this.#tableName, IndexName: this.#getSortIndexName(sort) })
			.promise();

		return { items: result.Items, count: result.Count };
	}

	async createBlog(content = {}) {
		const id = uuid.v4();

		if ([content.title, content.body].includes(undefined)) {
			throw new Error("Blog must be created with the title and body properties");
		}

		const Item = {
			id,
			type: "blog",
			createdAt: new Date().toISOString(),
			updatedAt: "never",
			title: content.title,
			body: content.body,
		};

		await this.#ddb.put({ TableName: this.#tableName, Item }).promise();

		return id;
	}

	async updateBlog(id, content = {}) {
		if (!(typeof id === "string" && validator.isUUID(id, 4))) return null;

		const { Item } = await this.#ddb.get({ TableName: this.#tableName, Key: { id } }).promise();

		if (!Item) return null;

		const result = await this.#ddb
			.update({
				TableName: this.#tableName,
				Key: { id },
				AttributeUpdates: {
					...(content?.title && {
						title: {
							Action: "PUT",
							Value: content.title,
						},
					}),
					...(content?.body && {
						body: {
							Action: "PUT",
							Value: content.body,
						},
					}),
					updatedAt: {
						Action: "PUT",
						Value: new Date().toISOString(),
					},
				},
				ReturnValues: "ALL_NEW",
			})
			.promise();

		return result.Attributes;
	}

	async deleteBlog(id) {
		if (!(typeof id === "string" && validator.isUUID(id, 4))) return null;

		const result = await this.#ddb
			.delete({
				TableName: this.#tableName,
				Key: { id },
				ReturnValues: "ALL_OLD",
			})
			.promise();

		return result.Attributes || null;
	}
}

module.exports = BlogsRepository;
