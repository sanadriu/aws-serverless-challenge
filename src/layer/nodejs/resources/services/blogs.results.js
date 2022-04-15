class BlogsResults {
	unexpected(message) {
		return {
			message: process.env.mode === "prod" ? "Something went wrong" : message,
			success: false,
			httpStatusCode: 500,
		};
	}

	blogNotFound() {
		return {
			message: "Blog not found",
			success: false,
			httpStatusCode: 404,
		};
	}

	blogCreated(result) {
		return {
			result,
			message: "Blog has been created successfully",
			success: true,
			httpStatusCode: 201,
		};
	}

	blogUpdated() {
		return {
			message: "Blog has been updated successfully",
			success: true,
			httpStatusCode: 200,
		};
	}

	blogDeleted() {
		return {
			message: "Blog has been deleted successfully",
			success: true,
			httpStatusCode: 200,
		};
	}

	blogFetched(result) {
		return {
			result,
			message: "Blog has been fetched successfully",
			success: true,
			httpStatusCode: 200,
		};
	}

	blogsFetched(result) {
		return {
			result,
			message: "Blogs has been fetched successfully",
			success: true,
			httpStatusCode: 200,
		};
	}
}

module.exports = BlogsResults;
