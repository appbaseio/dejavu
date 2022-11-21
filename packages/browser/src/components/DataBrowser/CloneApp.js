// @flow
import React from 'react';
import { connect } from 'react-redux';
import { ForkOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { getIsConnected, getAppname, getUrl } from '../../reducers/app';

type Props = {
	isConnected: boolean,
	rawUrl?: string,
	appname?: string,
};

const cloneHandler = (appname, rawUrl) => {
	window.open(
		`https://importer.appbase.io/?appname=${appname}&url=${rawUrl}&origin=dejavu`,
		'_blank',
	);
};

const CloneApp = ({ appname, rawUrl, isConnected }: Props) => {
	return isConnected && (
        <Button
            icon={<ForkOutlined />}
            type="primary"
            onClick={() => cloneHandler(appname, rawUrl)}
            css={{ marginRight: 10 }}
        >
            {' '}
            Clone This App
        </Button>
    );
};
const mapStateToProps = state => ({
	appname: getAppname(state),
	rawUrl: getUrl(state),
	isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(CloneApp);
