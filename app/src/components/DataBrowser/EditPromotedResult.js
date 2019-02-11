import React from 'react';
import { Modal, message } from 'antd';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { PromotedResultsContext } from './PromotedResultsContainer';
import { getUrlParams } from '../../utils';

class EditPromotedResult extends React.Component {
	constructor(props) {
		super(props);
		const { item } = props;
		this.state = {
			visible: false,
			item,
			isLoading: false,
		};
	}

	toggleLoading = () => {
		this.setState(prevState => ({
			isLoading: !prevState.isLoading,
		}));
	};

	handleModal = () => {
		this.setState(prevState => ({
			visible: !prevState.visible,
		}));
	};

	handleEditor = value => {
		try {
			JSON.parse(value);
			this.setState({
				item: JSON.parse(value),
			});
		} catch (e) {
			console.warn('Invalid JSON');
		}
	};

	isItemUpdated = () => {
		const { item: updatedItem } = this.state;
		const { item } = this.props;

		if (JSON.stringify(updatedItem) === JSON.stringify(item)) {
			return true;
		}
		return false;
	};

	updateJSON = async () => {
		this.toggleLoading();

		const {
			promotedResults,
			hiddenResults,
			appendResult,
			removeResult,
		} = this.context;
		const { item: updatedItem } = this.state;
		const { item } = this.props;
		const { rule, queryOperator, searchTerm, appname } = getUrlParams(
			window.location.search,
		);

		const filteredPromotedResults = promotedResults.filter(
			promotedItem => promotedItem._id !== item._id,
		);

		const newItem = {
			_id: item._id,
			_index: item._index,
			_type: item._type,
			...updatedItem,
		};

		const requestBody = {
			id: rule,
			if: {
				query: searchTerm,
				operator: queryOperator,
			},
			then: {
				promote: [
					...filteredPromotedResults,
					{
						...newItem,
					},
				],
				hide: hiddenResults,
			},
		};

		if (hiddenResults && hiddenResults.length === 0) {
			delete requestBody.then.hide;
		}

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
			if (ruleRequest.status >= 400) {
				message.error(ruleResponse.message);
			} else {
				message.success('Promotion Updated!');
				removeResult(item._id);
				appendResult({
					...newItem,
				});
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}
		this.toggleLoading();
	};

	render() {
		const { visible, item, isLoading } = this.state;
		const { renderButton } = this.props;
		const { _id, _type, _index, ...filteredJSON } = item;
		return (
			<React.Fragment>
				{renderButton({ callback: this.handleModal })}
				<Modal
					visible={visible}
					title="Edit Promoted Result"
					onOk={this.updateJSON}
					onCancel={this.handleModal}
					okButtonProps={{
						disabled: this.isItemUpdated(),
						loading: isLoading,
					}}
				>
					<AceEditor
						tabSize={2}
						mode="json"
						onChange={this.handleEditor}
						theme="github"
						value={JSON.stringify(filteredJSON, null, 2)}
						name="edit-promoted-item-modal"
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

EditPromotedResult.contextType = PromotedResultsContext;

export default EditPromotedResult;
