class CustomError extends Error {
	constructor(description, ...params) {
		super(...params);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError);
		}

		this.description = description;
		this.date = new Date();
	}
}

export default CustomError;
