// @flow

import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { string, arrayOf, func, object } from 'prop-types';
import { Button, Checkbox, Dropdown } from 'antd';

import { getColumns, getVisibleColumns } from '../../reducers/mappings';
import { setVisibleColumns } from '../../actions/mappings';
import colors from '../theme/colors';

const { Group } = Checkbox;

type Props = {
	columns: string[],
	visibleColumns: string[],
	setVisibleColumns: (string[]) => void,
};

type State = {
	showDropdown: boolean,
};
class ShowHideColumns extends Component<Props, State> {
	showHideDropdownNode = createRef();

	state = {
		showDropdown: false,
	};

	componentDidMount() {
		document.addEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);
	}

	componentWillUnmount() {
		document.removeEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);
	}

	handleDropdownOutsideClick = (e: object) => {
		if (
			this.showHideDropdownNode &&
			this.showHideDropdownNode.current &&
			this.showHideDropdownNode.current.contains &&
			this.showHideDropdownNode.current.contains(e.target)
		) {
			return;
		}

		if (e.target.id === 'show-hide-button') {
			return;
		}

		this.setState({
			showDropdown: false,
		});
	};

	handleSelectAll = e => {
		const { checked } = e.target;
		let visibleColumns;
		if (checked) {
			visibleColumns = this.props.columns;
		} else {
			visibleColumns = [];
		}
		this.props.setVisibleColumns(visibleColumns);
	};

	handleVisibleColumnsChange = visibleColumns => {
		this.props.setVisibleColumns(visibleColumns);
	};

	toggleDropDown = () => {
		this.setState(prevState => ({
			showDropdown: !prevState.showDropdown,
		}));
	};

	render() {
		const { columns: allColumns, visibleColumns } = this.props;
		const { showDropdown } = this.state;

		return (
			<Dropdown
				ref={this.showHideDropdownNode}
				overlay={
					<div
						css={{
							background: colors.white,
							borderRadius: 4,
							padding: 10,
							boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
							maxHeight: '75vh',
							overflowY: 'auto',
						}}
						ref={this.showHideDropdownNode}
					>
						<Checkbox
							checked={
								visibleColumns.length === allColumns.length
							}
							indeterminate={
								visibleColumns.length < allColumns.length &&
								visibleColumns.length
							}
							css={{
								marginBottom: 5,
								fontWeight: 'bold',
							}}
							onChange={this.handleSelectAll}
						>
							Select All
						</Checkbox>
						<Group
							options={allColumns}
							css={{
								display: 'grid',
								gridGap: 5,
							}}
							value={visibleColumns}
							onChange={this.handleVisibleColumnsChange}
						/>
					</div>
				}
				visible={showDropdown}
				trigger={['click']}
				onClick={this.toggleDropDown}
			>
				<Button
					css={{ marginLeft: '5px' }}
					id="show-hide-button"
					icon="setting"
				/>
			</Dropdown>
		);
	}
}

const mapStateToProps = state => ({
	columns: getColumns(state),
	visibleColumns: getVisibleColumns(state),
});

const mapDispatchToProps = {
	setVisibleColumns,
};

ShowHideColumns.propTypes = {
	columns: arrayOf(string).isRequired,
	visibleColumns: arrayOf(string).isRequired,
	setVisibleColumns: func.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShowHideColumns);
