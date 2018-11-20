// @flow

import React, { Component } from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';

type Props = {
	field: string,
};

type State = {
	isVisible: boolean,
};
class TermFilter extends Component<Props, State> {
	state = {
		isVisible: false,
	};

	onHide = () => {
		this.setState({
			isVisible: false,
		});
	};

	handleVisibleChange = (isVisible: boolean) => {
		this.setState({ isVisible });
	};

	render() {
		const { field } = this.props;
		const { isVisible } = this.state;
		return (
			<Popover
				content={
					<MultiList
						componentId={field}
						dataField={field}
						size={100}
					/>
				}
				title="Filter"
				trigger="click"
				visible={isVisible}
				onVisibleChange={this.handleVisibleChange}
				placement="bottomRight"
			>
				<i className="fa fa-filter" />
			</Popover>
		);
	}
}

export default TermFilter;
