import React, { Component } from 'react';
import { func, string, object } from 'prop-types';
import { Radio, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMode } from '../../reducers/mode';
import setMode from '../../actions/mode';
import { updateQueryStringParameter } from '../../utils';

class ModeSwitch extends Component {
	handleModeChange = e => {
		const {
			target: { value },
		} = e;
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
			<Radio.Group
				value={mode}
				buttonStyle="solid"
				onChange={this.handleModeChange}
			>
				<Radio.Button value="view">
					<Icon type="eye" /> &nbsp; View
				</Radio.Button>
				<Radio.Button value="edit">
					<Icon type="edit" /> &nbsp; Edit
				</Radio.Button>
			</Radio.Group>
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
