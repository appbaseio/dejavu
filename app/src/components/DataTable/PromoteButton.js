import React from 'react';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

import { getUrlParams, getHeaders } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';
import getPromotedURL from '../PromotedResultsQueries/utils';

class PromoteButton extends React.Component {
	state = {
		isLoading: false,
	};

	promoteId = async () => {
		this.toggleLoading();
		const { item } = this.props;
		const { rule, queryOperator, searchTerm, appname, url } = getUrlParams(
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
			const requestURL = getPromotedURL(url);
			const { Authorization } = getHeaders(url);
			const ruleRequest = await fetch(`${requestURL}/${appname}/_rule`, {
				method: 'POST',
				headers: {
					Authorization,
				},
				body: JSON.stringify(requestBody),
			});

			const ruleResponse = await ruleRequest.json();
			if (ruleRequest.status >= 400) {
				message.error(ruleResponse.message);
			} else {
				if (!rule) {
					// Appending rule id to URL

					const {
						history,
						location: { pathname, search },
					} = this.props;
					history.push(
						`${pathname}${search}&rule=${ruleResponse.id}`,
					);
				}

				message.success('Query Rule Updated!');

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

export default withRouter(PromoteButton);

PromoteButton.contextType = PromotedResultsContext;
