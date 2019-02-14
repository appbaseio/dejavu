import React from 'react';
import { message } from 'antd';

import { getUrlParams, getHeaders } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';
import getPromotedURL from '../PromotedResultsQueries/utils';

class UnHideButton extends React.Component {
	state = {
		isLoading: false,
	};

	deleteQuery = async rule => {
		const { appname, url } = getUrlParams(window.location.search);
		const { removeHiddenResult } = this.context;
		const { id } = this.props;
		try {
			const requestURL = getPromotedURL(url);
			const { Authorization } = getHeaders(url);
			const deleteResponse = await fetch(
				`${requestURL}/${appname}/_rule/${rule}`,
				{
					method: 'DELETE',
					headers: {
						Authorization,
					},
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
		const { rule, queryOperator, searchTerm, appname, url } = getUrlParams(
			window.location.search,
		);
		const { removeHiddenResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {};

		const filteredResults = hiddenResults.filter(
			item => item.doc_id !== id,
		);

		if (filteredResults.length === 0 && promotedResults.length === 0) {
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
				const requestURL = getPromotedURL(url);
				const { Authorization } = getHeaders(url);
				const ruleRequest = await fetch(
					`${requestURL}/${appname}/_rule`,
					{
						method: 'POST',
						headers: {
							Authorization,
						},
						body: JSON.stringify(requestBody),
					},
				);

				const ruleResponse = await ruleRequest.json();
				if (ruleRequest.status >= 400) {
					message.error(ruleResponse.message);
				} else {
					message.success('Query Rule Updated!');

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
			unHideItem: this.unHideId,
			isLoading,
		});
	}
}

UnHideButton.contextType = PromotedResultsContext;

export default UnHideButton;
