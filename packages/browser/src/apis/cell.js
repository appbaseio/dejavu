import { unflatten } from 'flat';

import CustomError from '../utils/CustomError';
import { updateDocument } from './data';

const setCellValue = async (app, type, rawUrl, id, property, value) => {
	const doc = unflatten({ [property]: value });
	const formattedId = encodeURIComponent(id);
	try {
		return updateDocument({
			index: app,
			id: formattedId,
			url: rawUrl,
			document: doc,
		});
	} catch (error) {
		const errorMessage = error.message || 'Unable to update data';

		throw new CustomError(
			error.description || errorMessage,
			errorMessage,
			error.stack,
		);
	}
};

export default setCellValue;
