// @flow

import React, { Component } from 'react';
import { func, string, object } from 'prop-types';
import { Select } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMode } from '../../reducers/mode';
import setMode from '../../actions/mode';
import { updateQueryStringParameter } from '../../utils';
import colors from '../theme/colors';
import { MODES } from '../../constants';

const { Option } = Select;

type Props = {
	mode: string,
	setMode: string => void,
	history: object,
	location: object,
};

class ModeSwitch extends Component<Props> {
	handleModeChange = value => {
		this.props.setMode(value);
		// this.setSearchQuery(value);
	};

	setSearchQuery = mode => {
		const searchQuery = this.props.location.search;
		this.props.history.push({
			search: updateQueryStringParameter(searchQuery, 'mode', mode),
		});
	};

	render() {
		const { mode } = this.props;

		return (
			<Select
				value={mode}
				onChange={this.handleModeChange}
				css={{
					'.dejavu-browser-select-selection': {
						backgroundColor: `${
							mode === MODES.VIEW
								? colors.viewing
								: colors.editing
						}`,
						color: `${colors.white}`,
					},
					'.dejavu-browser-select-arrow': {
						color: `${colors.white}`,
					},
				}}
			>
				<Option value="view">
					<EyeOutlined /> &nbsp; Viewing
				</Option>
				<Option value="edit">
					<EditOutlined type="edit" /> &nbsp; Editing
				</Option>
			</Select>
		);
	}
}

ModeSwitch.propTypes = {
	mode: string.isRequired,
	setMode: func.isRequired,
	history: object,
	location: object,
};

const mapStateToProps = state => ({
	mode: getMode(state),
});

const mapDispatchToProps = {
	setMode,
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ModeSwitch),
);
