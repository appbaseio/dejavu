import { DATA } from './constants';

const addDataRequest = data => ({
	type: DATA.ADD_DATA_REQUEST,
	data,
});

const addDataSuccess = () => ({
	type: DATA.ADD_DATA_SUCCESS,
});

const addDataFailure = error => ({
	type: DATA.ADD_DATA_FAILURE,
	error,
});

export { addDataRequest, addDataSuccess, addDataFailure };
