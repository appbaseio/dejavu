// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';

import Flex from '../Flex';

import { setIsShwoingNestedColumn } from '../../actions';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';

type Props = {
	isShowingNestedColumns: boolean,
	setIsShwoingNestedColumn: boolean => void,
};

class NestedColumnToggle extends PureComponent<Props> {
	handleNestedColumnToggle = e => {
		const {
			target: { checked },
		} = e;

		this.props.setIsShwoingNestedColumn(checked);
	};

	render() {
		const { isShowingNestedColumns } = this.props;
		return (
			<Flex
				justifyContent="flex-end"
				css={{
					width: '100%',
					marginBottom: 10,
				}}
			>
				<Checkbox
					checked={isShowingNestedColumns}
					onChange={this.handleNestedColumnToggle}
					css={{
						marginLeft: 10,
					}}
				>
					{isShowingNestedColumns ? 'Hide ' : 'Show '}
					object data as columns
				</Checkbox>
			</Flex>
		);
	}
}

const mapStateToProps = state => ({
	isShowingNestedColumns: getIsShowingNestedColumns(state),
});

const mapDispatchToProps = {
	setIsShwoingNestedColumn,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NestedColumnToggle);
