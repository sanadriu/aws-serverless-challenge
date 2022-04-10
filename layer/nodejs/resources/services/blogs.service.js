class BlogsService {
	#blogsRepository;
	#blogsResults;

	constructor(blogsRepository, blogsResults) {
		this.#blogsRepository = blogsRepository;
		this.#blogsResults = blogsResults;
	}

	async getBlog(id) {
		try {
			const result = await this.#blogsRepository.getBlog(id);

			if (!result.data) return this.#blogsResults.blogNotFound();

			return this.#blogsResults.blogFetched(result);
		} catch (error) {
			return this.#blogsResults.unexpected(error.message);
		}
	}

	async getBlogs() {
		try {
			const result = await this.#blogsRepository.getBlogs();

			return this.#blogsResults.blogsFetched(result);
		} catch (error) {
			return this.#blogsResults.unexpected(error.message);
		}
	}

	async createBlog(content) {
		try {
			await this.#blogsRepository.createBlog(content);

			return this.#blogsResults.blogCreated();
		} catch (error) {
			return this.#blogsResults.unexpected(error.message);
		}
	}

	async updateBlog(id, content) {
		try {
			const result = await this.#blogsRepository.updateBlog(id, content);

			if (!result.data) return this.#blogsResults.blogNotFound();

			return this.#blogsResults.blogUpdated();
		} catch (error) {
			return this.#blogsResults.unexpected(error.message);
		}
	}

	async deleteBlog(id) {
		try {
			const result = await this.#blogsRepository.deleteBlog(id);

			if (!result.data) return this.#blogsResults.blogNotFound();

			return this.#blogsResults.blogDeleted();
		} catch (error) {
			return this.#blogsResults.unexpected(error.message);
		}
	}
}

module.exports = BlogsService;
