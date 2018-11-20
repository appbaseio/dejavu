import React from 'react';
import { Popover, Button } from 'antd';

class TermFilter extends React.Component {
	state = {
		visible: false,
	};

	hide = () => {
		this.setState({
			visible: false,
		});
	};

	handleVisibleChange = visible => {
		this.setState({ visible });
	};

	render() {
		return (
			<Popover
				content={<Button onClick={this.hide}>Close</Button>}
				title="Title"
				trigger="click"
				visible={this.state.visible}
				onVisibleChange={this.handleVisibleChange}
			>
				<Button type="primary">Click me</Button>
			</Popover>
		);
	}
}

export default TermFilter;
