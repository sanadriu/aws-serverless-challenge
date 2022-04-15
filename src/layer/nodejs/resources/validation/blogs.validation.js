const { object, string } = require("yup");
const validator = require("validator");

const createBlogBodySchema = object({
	title: string().required().trim().min(1).max(64).label("Title"),
	body: string().required().min(1).max(512).label("Body"),
});

const updateBlogBodySchema = object({
	title: string().trim().min(1).max(64).label("Title"),
	body: string().min(1).max(512).label("Body"),
});

const blogParamsSchema = object({
	id: string()
		.required()
		.trim()
		.label("Blog ID")
		.test("test-id", "Blog ID must be a UUID value", function (value) {
			return typeof value === "string" && validator.isUUID(value, 4);
		}),
});

module.exports = {
	createBlogBodySchema,
	updateBlogBodySchema,
	blogParamsSchema,
};
