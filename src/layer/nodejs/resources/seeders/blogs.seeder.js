const { faker } = require("@faker-js/faker");
const uuid = require("uuid");

function generateBlogContent() {
	return {
		title: faker.lorem.sentence(1),
		body: faker.lorem.paragraphs(4),
	};
}

function generateBlogContents(numItems = 10) {
	return Array.from({ length: numItems }, () => generateBlogContent());
}

function generateDatabaseBlog() {
	const hasBeenUpdated = Math.random() > 0.5;

	return {
		id: uuid.v4(),
		type: "blog",
		createdAt: faker.date.past().toISOString(),
		updatedAt: hasBeenUpdated ? faker.date.recent().toISOString() : "never",
		...generateBlogContent(),
	};
}

function generateDatabaseBlogs(numItems = 10) {
	return Array.from({ length: numItems }, () => generateDatabaseBlog());
}

module.exports = {
	generateBlogContent,
	generateBlogContents,
	generateDatabaseBlog,
	generateDatabaseBlogs,
};
