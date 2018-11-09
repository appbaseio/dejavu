import { UPDATING_ROW } from './constants';

const setUpdatingRow = rowData => ({
	type: UPDATING_ROW.SET_UPDATING_ROW,
	rowData,
});

export default setUpdatingRow;
