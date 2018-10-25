import React, { Component } from 'react';
import { func } from 'prop-types';
import { Button } from 'antd';

import Flex from '../Flex';
import AddFieldModal from '../AddFieldModal';
import AddRowModal from '../AddRowModal';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';

class Actions extends Component {
	state = {
		isShowingAddFieldModal: false,
		isShowingAddRowModal: false,
	};

	toggleAddFieldModal = () => {
		this.setState(({ isShowingAddFieldModal }) => ({
			isShowingAddFieldModal: !isShowingAddFieldModal,
		}));
	};

	toggleAddRowModal = () => {
		this.setState(({ isShowingAddRowModal }) => ({
			isShowingAddRowModal: !isShowingAddRowModal,
		}));
	};

	render() {
		const { isShowingAddFieldModal, isShowingAddRowModal } = this.state;
		const { onReload } = this.props;

		return (
			<div style={{ margin: '20px 0' }}>
				<AddFieldModal
					showModal={isShowingAddFieldModal}
					toggleModal={this.toggleAddFieldModal}
				/>
				<AddRowModal
					showModal={isShowingAddRowModal}
					toggleModal={this.toggleAddRowModal}
				/>
				<Flex alignItems="flex-end" justifyContent="space-between">
					<div>
						<Button
							icon="download"
							type="primary"
							onClick={this.toggleAddFieldModal}
							css={{ marginRight: '5px' }}
						>
							Export
						</Button>
						<Button
							icon="reload"
							type="primary"
							onClick={onReload}
							css={{ marginRight: '5px' }}
						>
							Reload
						</Button>
						<Button
							icon="plus"
							type="primary"
							onClick={this.toggleAddFieldModal}
							css={{ marginRight: '5px' }}
						>
							Add Column
						</Button>
						<Button
							icon="table"
							type="primary"
							onClick={this.toggleAddRowModal}
						>
							Add New Row
						</Button>
					</div>
					<div>
						<ModeSwitch />
						<ShowHideColumn />
					</div>
				</Flex>
			</div>
		);
	}
}

Actions.propTypes = {
	onReload: func.isRequired,
};

export default Actions;
