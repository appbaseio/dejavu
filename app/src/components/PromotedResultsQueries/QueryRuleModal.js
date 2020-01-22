import React from 'react';
import { string, func } from 'prop-types';
import { Modal, Select, Input, Form } from 'antd';
import { css } from 'emotion';

const { Option } = Select;

const formWrapper = css`
	.ant-form-item-label {
		line-height: 16px;
	}
`;

class QueryRuleModal extends React.Component {
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

		if (stateQuery === '' && stateOperator !== 'match_all') {
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
					title="Create Query Rule"
					visible={visible}
					okText="Continue"
					onOk={this.handleCuration}
					onCancel={this.handleModal}
					destroyOnClose
					okButtonProps={{
						disabled: this.isCurationChanged(),
					}}
				>
					<Form className={formWrapper}>
						<Form.Item label="Query" colon={false}>
							<div
								style={{ margin: '0 0 6px' }}
								className="ant-form-extra"
							>
								When this query is typed by the user, this rule
								will get triggered.
							</div>
							<Input
								value={query}
								disabled={operator === 'match_all'}
								placeholder={
									operator === 'match_all'
										? `A query value isn't needed for match_all operator`
										: 'Enter Query'
								}
								onChange={this.handleQuery}
							/>
						</Form.Item>
						<Form.Item label="Operator" colon={false}>
							<div
								style={{ margin: '0 0 6px' }}
								className="ant-form-extra"
							>
								Operator specifies how the match should be
								performed.
							</div>
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
								<Option value="match_all">match_all</Option>
							</Select>
						</Form.Item>
					</Form>
				</Modal>
			</React.Fragment>
		);
	}
}

QueryRuleModal.propTypes = {
	handleSuccess: func.isRequired,
	operator: string,
	query: string,
	renderButton: func.isRequired,
};

QueryRuleModal.defaultProps = {
	operator: 'is',
	query: '',
};

export default QueryRuleModal;
