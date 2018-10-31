// @flow

import React, { Component } from 'react';
import { func, string, object } from 'prop-types';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMode } from '../../reducers/mode';
import setMode from '../../actions/mode';
import { updateQueryStringParameter } from '../../utils';

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
		this.setSearchQuery(value);
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
			<Select value={mode} onChange={this.handleModeChange}>
				<Option value="view">
					<Icon type="eye" /> &nbsp; Viewing
				</Option>
				<Option value="edit">
					<Icon type="edit" /> &nbsp; Editing
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
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(ModeSwitch),
);
