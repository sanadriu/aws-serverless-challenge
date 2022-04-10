const aws = require("aws-sdk");
const uuid = require("uuid");

class BlogsRepository {
	#repository = new aws.DynamoDB.DocumentClient();
	#tableName = process.env.tableName;

	async getBlogs() {
		const result = await this.#repository.scan({ TableName: this.#tableName }).promise();

		return { data: result.Items, count: result.Count };
	}

	async getBlog(id) {
		const result = await this.#repository.get({ TableName: this.#tableName, Key: { id } }).promise();

		return { data: result.Item };
	}

	async createBlog(content) {
		const result = await this.#repository
			.put({
				TableName: this.#tableName,
				Item: {
					id: uuid.v4(),
					createdAt: new Date().toISOString(),
					...content,
				},
				ReturnValues: "NONE",
			})
			.promise();

		return { data: result.Attributes };
	}

	async updateBlog(id, content) {
		const { Item } = await this.#repository.get({ TableName: this.#tableName, Key: { id } }).promise();

		if (!Item) return { data: null };

		const result = await this.#repository
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

		return { data: result.Attributes };
	}

	async deleteBlog(id) {
		const result = await this.#repository
			.delete({
				TableName: this.#tableName,
				Key: { id },
				ReturnValues: "ALL_OLD",
			})
			.promise();

		return { data: result.Attributes };
	}
}

module.exports = BlogsRepository;
