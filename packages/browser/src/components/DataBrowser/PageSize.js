// @flow

import React, { Fragment, PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';

import { getPageSize } from '../../reducers/pageSize';
import { setPageSize, updateReactiveList } from '../../actions';

const { Option } = Select;

type Props = {
	pageSize: number,
	onPageSizeChange: any => void,
	onUpdateReactiveList: () => void,
};

class PageSize extends PureComponent<Props> {
	handlePageSizeChange = pageSize => {
		const { onPageSizeChange, onUpdateReactiveList } = this.props;
		onPageSizeChange(pageSize);
		onUpdateReactiveList();
	};

	render() {
		const { pageSize } = this.props;

		return (
			<Fragment>
				<Select value={pageSize} onChange={this.handlePageSizeChange}>
					<Option value={10}>10</Option>
					<Option value={15}>15</Option>
					<Option value={25}>25</Option>
					<Option value={50}>50</Option>
					<Option value={100}>100</Option>
				</Select>
			</Fragment>
		);
	}
}

const mpaStateToProps = state => ({
	pageSize: getPageSize(state),
});

const mapDispatchToProps = {
	onPageSizeChange: setPageSize,
	onUpdateReactiveList: updateReactiveList,
};

export default connect(mpaStateToProps, mapDispatchToProps)(PageSize);
