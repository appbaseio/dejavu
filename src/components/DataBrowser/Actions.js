// @flow

import React from 'react';
import { func } from 'prop-types';
import { Button } from 'antd';

import Flex from '../Flex';
import AddFieldModal from './AddFieldModal';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';
import ExportData from './ExportData';

type Props = { onReload: () => void };

const Actions = ({ onReload }: Props) => (
	<div css={{ margin: '20px 0' }}>
		<Flex alignItems="flex-end" justifyContent="space-between">
			<div>
				<ExportData />
				<Button
					icon="reload"
					type="primary"
					onClick={onReload}
					css={{ marginRight: '5px' }}
				>
					Reload
				</Button>
				<AddFieldModal />
			</div>
			<div>
				<ModeSwitch />
				<ShowHideColumn />
			</div>
		</Flex>
	</div>
);

Actions.propTypes = {
	onReload: func.isRequired,
};

export default Actions;
