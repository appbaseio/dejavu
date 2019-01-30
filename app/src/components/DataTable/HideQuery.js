import React from 'react';
import { message } from 'antd';

import { getUrlParams } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';

class HideQuery extends React.Component {
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

	deleteQuery = async rule => {
		const { appname } = getUrlParams(window.location.search);
		const { removeHiddenResult } = this.context;
		const { id } = this.props;
		try {
			const deleteResponse = await fetch(
				`https://accapi.appbase.io/app/${appname}/rule/${rule}`,
				{
					method: 'DELETE',
					credentials: 'include',
				},
			);
			const deleteObject = await deleteResponse.json();
			if (deleteResponse.status >= 400) {
				message.error(deleteObject.message);
			} else {
				removeHiddenResult(id);
				message.success(deleteObject.message);
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}
	};

	unHideId = async () => {
		this.toggleLoading();
		const { id } = this.props;
		const { rule, queryOperator, searchTerm, appname } = getUrlParams(
			window.location.search,
		);
		const { removeHiddenResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {};

		const filteredResults = hiddenResults.filter(
			item => item.doc_id !== id,
		);

		if (filteredResults.length === 0 && hiddenResults.length === 0) {
			this.deleteQuery(rule);
			this.toggleLoading();
		} else {
			const thenBody = {
				hide: [...filteredResults],
			};

			requestBody = {
				if: {
					query: searchTerm,
					operator: queryOperator,
				},
				then: thenBody,
				id: rule,
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

			if (filteredResults.length === 0) {
				requestBody = {
					...requestBody,
					then: {
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

					removeHiddenResult(id);
				}
			} catch (e) {
				message.error('Something went Wrong!');
			}

			this.toggleLoading();
		}
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
			unHideItem: this.unHideId,
			isLoading,
		});
	}
}

HideQuery.contextType = PromotedResultsContext;

export default HideQuery;
