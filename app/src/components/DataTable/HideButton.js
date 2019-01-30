import React from 'react';
import { message } from 'antd';

import { getUrlParams } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';

class HideButton extends React.Component {
	state = {
		isLoading: false,
	};

	hideId = async () => {
		this.toggleLoading();
		const { id } = this.props;
		const { queryOperator, searchTerm, appname } = getUrlParams(
			window.location.search,
		);
		const { appendHiddenResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {};

		requestBody = {
			if: {
				query: searchTerm,
				operator: queryOperator,
			},
			then: {
				hide: [...hiddenResults, { doc_id: id }],
			},
		};

		if (promotedResults && promotedResults.length) {
			requestBody = {
				...requestBody,
				then: {
					...requestBody.then,
					promote: promotedResults,
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
				message.success(ruleResponse.message);

				if (appendHiddenResult) {
					appendHiddenResult(id);
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
		const { renderButton } = this.props;
		const { isLoading } = this.state;
		return renderButton({
			hideItem: this.hideId,
			isLoading,
		});
	}
}

HideButton.contextType = PromotedResultsContext;

export default HideButton;
