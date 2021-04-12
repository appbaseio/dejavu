// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import { getIsConnected } from '../../reducers/app';
import { getUrlParams, normalizeSearchQuery } from '../../utils';

type Props = {
	isConnected: boolean,
};

const getImporterSearchParams = () => {
	let params = window.location.search;

	if (params) {
		params = normalizeSearchQuery(params);
		params += '&origin=dejavu';
	} else {
		params = '?origin=dejavu';
	}

	return params;
};

const cloneHandler = () => {
	window.open(`http://localhost:1360/${getImporterSearchParams()}`, '_blank');
};

const CloneApp = ({ isConnected }: Props) => {
	const { cloneApp } = getUrlParams(window.location.search);
	let isVisible = true;

	if (cloneApp && cloneApp === 'false') {
		isVisible = false;
	}
	return (
		isConnected &&
		isVisible && (
			<Button
				icon="fork"
				type="primary"
				onClick={cloneHandler}
				css={{ marginRight: 10 }}
			>
				{' '}
				Clone This App
			</Button>
		)
	);
};
const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(CloneApp);
