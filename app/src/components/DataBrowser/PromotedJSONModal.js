import React from 'react';
import AceEditor from 'react-ace';
import { Modal, message } from 'antd';

import 'brace/mode/json';
import 'brace/theme/github';

import { getUrlParams, isVaildJSON } from '../../utils';

import { PromotedResultsContext } from './PromotedResultsContainer';

class PromotedJSONModal extends React.Component {
	state = {
		visible: false,
		jsonValue: '',
		isLoading: false,
	};

	handleJsonInput = value => {
		this.setState({
			jsonValue: value,
		});
	};

	handleAddJson = async () => {
		const { jsonValue } = this.state;
		const { rule, queryOperator, searchTerm, appname } = getUrlParams(
			window.location.search,
		);
		const jsonObject = JSON.parse(jsonValue);
		jsonObject._id = jsonObject._id || Date.now();
		const { _id, ...restProperties } = jsonObject;
		const item = { _id, ...restProperties };
		const { appendResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {
			if: {
				query: searchTerm,
				operator: queryOperator,
			},
			then: {
				promote: [
					...promotedResults,
					{
						...item,
					},
				],
			},
		};

		if (rule) {
			requestBody = {
				...requestBody,
				id: rule,
			};
		}

		if (hiddenResults && hiddenResults.length) {
			requestBody = {
				...requestBody,
				then: {
					...requestBody.then,
					hide: hiddenResults,
				},
			};
		}

		this.toggleLoading();

		try {
			const ruleRequest = await fetch(
				`https://accapi.appbase.io/app/${appname}/rule`,
				{
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify(requestBody),
				},
			);

			const ruleResponse = await ruleRequest.json();
			if (ruleResponse.status >= 400) {
				message.error(ruleResponse.message);
			} else {
				if (!rule) {
					const searchParams = new URLSearchParams(
						window.location.search,
					);
					searchParams.set('rule', ruleResponse.id);
					window.location.search = searchParams.toString();
				}
				message.success(ruleResponse.message);
				appendResult({
					...item,
				});
				this.resetModal();
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}

		this.toggleLoading();
	};

	toggleLoading = () => {
		this.setState(prevState => ({
			isLoading: !prevState.isLoading,
		}));
	};

	resetModal = () => {
		this.setState({
			visible: false,
			jsonValue: '',
		});
	};

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	render() {
		const { jsonValue, visible, isLoading } = this.state;
		const { renderButton } = this.props;
		return (
			<React.Fragment>
				{renderButton({ clickHandler: this.showModal })}
				<Modal
					visible={visible}
					onOk={this.handleAddJson}
					onCancel={this.resetModal}
					okText="Add JSON"
					okButtonProps={{
						disabled: !isVaildJSON(jsonValue),
						loading: isLoading,
					}}
				>
					<AceEditor
						tabSize={2}
						mode="json"
						theme="github"
						value={jsonValue}
						onChange={this.handleJsonInput}
						name="add-row-modal"
						height="auto"
						width="100%"
						css={{
							minHeight: '200px',
							maxHeight: '500px',
							flex: 1,
							fontSize: 14,
						}}
					/>
				</Modal>
			</React.Fragment>
		);
	}
}

PromotedJSONModal.contextType = PromotedResultsContext;

export default PromotedJSONModal;
