import React from 'react';
import { message } from 'antd';

import { getUrlParams } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';

class PromoteButton extends React.Component {
	state = {
		isLoading: false,
	};

	promoteId = async () => {
		this.toggleLoading();
		const { item } = this.props;
		const { rule, queryOperator, searchTerm, appname } = getUrlParams(
			window.location.search,
		);
		const { appendResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {};

		requestBody = {
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

		// After first request we get the id from the API, which we append in the URL and pass it in Body
		if (rule) {
			requestBody = {
				...requestBody,
				id: rule,
			};
		}

		// If we have hidden results pass it on the body
		if (hiddenResults && hiddenResults.length) {
			requestBody = {
				...requestBody,
				then: {
					...requestBody.then,
					hide: hiddenResults,
				},
			};
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
				if (!rule) {
					// Appending rule id to URL
					const searchParams = new URLSearchParams(
						window.location.search,
					);
					searchParams.set('rule', ruleResponse.id);
					window.location.search = searchParams.toString();
				}
				message.success(ruleResponse.message);

				if (appendResult) {
					appendResult({
						...item,
					});
				}
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

	render() {
		const { renderButton, item } = this.props;
		const { isLoading } = this.state;
		const { promotedResults, hiddenResults } = this.context;
		const promotedIds = promotedResults.map(
			promotedItem => promotedItem._id,
		);
		const hiddenIds = hiddenResults.map(hiddenItem => hiddenItem.doc_id);
		const isAlreadyPresent =
			promotedIds.includes(item._id) || hiddenIds.includes(item._id);
		return renderButton({
			promoteResult: this.promoteId,
			isLoading,
			disabled: isAlreadyPresent,
		});
	}
}

PromoteButton.contextType = PromotedResultsContext;

export default PromoteButton;
