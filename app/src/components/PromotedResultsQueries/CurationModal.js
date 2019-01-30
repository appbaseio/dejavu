import React from 'react';
import { string, func } from 'prop-types';
import { Modal, Select, Input, Form } from 'antd';

const { Option } = Select;

class CurationModal extends React.Component {
	constructor(props) {
		super(props);
		const { query, operator } = props;
		this.state = {
			visible: false,
			query,
			operator,
		};
	}

	handleModal = () => {
		this.setState(prevState => ({
			visible: !prevState.visible,
		}));
	};

	isCurationChanged = () => {
		const { operator: propsOperator, query: propsQuery } = this.props;
		const { operator: stateOperator, query: stateQuery } = this.state;

		if (stateQuery === '') {
			return true;
		}

		if (stateQuery !== propsQuery || propsOperator !== stateOperator) {
			return false;
		}
		return true;
	};

	handleOperator = value => {
		this.setState({
			operator: value,
		});
	};

	handleQuery = e => {
		const {
			target: { value },
		} = e;
		this.setState({
			query: value,
		});
	};

	handleCuration = async () => {
		const { operator, query } = this.state;
		const { handleSuccess } = this.props;
		handleSuccess({ operator, query });
		this.handleModal();
	};

	render() {
		const { operator, query, visible } = this.state;
		const { renderButton } = this.props;
		return (
			<React.Fragment>
				{renderButton(this.handleModal)}
				<Modal
					title="Manage Curation"
					visible={visible}
					okText="Continue"
					onOk={this.handleCuration}
					onCancel={this.handleModal}
					destroyOnClose
					okButtonProps={{
						disabled: this.isCurationChanged(),
					}}
				>
					<Form>
						<Form.Item label="Operator">
							<Select
								showSearch
								placeholder="Select a Operator"
								optionFilterProp="children"
								onChange={this.handleOperator}
								style={{ width: '100%' }}
								defaultValue={operator}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								<Option value="is">is</Option>
								<Option value="starts_with">starts_with</Option>
								<Option value="ends_with">ends_with</Option>
								<Option value="contains">contains</Option>
							</Select>
						</Form.Item>
						<Form.Item label="Query">
							<Input
								value={query}
								placeholder="Enter the Query"
								onChange={this.handleQuery}
							/>
						</Form.Item>
					</Form>
				</Modal>
			</React.Fragment>
		);
	}
}

CurationModal.propTypes = {
	handleSuccess: func.isRequired,
	operator: string,
	query: string,
	renderButton: func.isRequired,
};

CurationModal.defaultProps = {
	operator: 'is',
	query: '',
};

export default CurationModal;
