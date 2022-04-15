const validator = require("validator");

function toBeUUIDv4(received) {
	pass = typeof received === "string" && validator.isUUID(received, 4);
	if (pass) {
		return {
			pass: true,
			message: () => `expected ${received} not to be a UUID v4`,
		};
	} else {
		return {
			pass: false,
			message: () => `expected ${received} to be a UUID v4`,
		};
	}
}

function toBeDate(received) {
	const dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;
	const pass = typeof received === "string" && dateRegex.test(received);
	if (pass) {
		return {
			pass: true,
			message: () => `expected ${received} not to be a ISO date`,
		};
	} else {
		return {
			pass: false,
			message: () => `expected ${received} to be a ISO date`,
		};
	}
}

function toBeOptionalDate(received) {
	const dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;
	const pass = received === "never" || (typeof received === "string" && dateRegex.test(received));
	if (pass) {
		return {
			pass: true,
			message: () => `expected ${received} not to be an optional ISO date`,
		};
	} else {
		return {
			pass: false,
			message: () => `expected ${received} to be an optional ISO date`,
		};
	}
}

module.exports = {
	toBeUUIDv4,
	toBeDate,
	toBeOptionalDate,
};
