import { DATA } from './constants';

const addDataRequest = (indexName, typeName, docId, data, tab, version) => ({
	type: DATA.ADD_DATA_REQUEST,
	indexName,
	typeName,
	docId,
	data,
	tab,
	version,
});

const addDataSuccess = () => ({
	type: DATA.ADD_DATA_SUCCESS,
});

const addDataFailure = () => ({
	type: DATA.ADD_DATA_FAILURE,
});

const updateReactiveList = () => ({
	type: DATA.UPDATE_REACTIVE_LIST,
});

export { addDataRequest, addDataSuccess, addDataFailure, updateReactiveList };
