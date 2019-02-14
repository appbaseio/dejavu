import React from 'react';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';

import { PromotedResultsContext } from './PromotedResultsContainer';
import QueryRuleModal from '../PromotedResultsQueries/QueryRuleModal';
import { getUrlParams, getHeaders } from '../../utils';
import getPromotedURL from '../PromotedResultsQueries/utils';

class UpdateQueryRule extends React.Component {
	redirectURL = data => {
		const { query, operator, url, appname, rule } = data;
		const { history } = this.props;
		let baseURL = `/promoted-results?&appname=${appname}&url=${url}&searchTerm=${query}&queryOperator=${operator}&mode=edit&showActions=false&cloneApp=false&sidebar=false&footer=false&appswitcher=false&oldBanner=false`;
		if (rule) {
			baseURL = `${baseURL}&rule=${rule}`;
		}
		history.push(baseURL);
	};

	updateQueryRule = async data => {
		const { appname, query, rule, operator, url } = data;
		if (rule) {
			const { promotedResults, hiddenResults } = this.context;
			const requestBody = {
				if: {
					query,
					operator,
				},
				then: {
					promote: promotedResults,
					hide: hiddenResults,
				},
				id: rule,
			};

			if (hiddenResults && hiddenResults.length === 0) {
				delete requestBody.then.hide;
			}

			if (promotedResults && promotedResults.length === 0) {
				delete requestBody.then.promote;
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
				if (ruleResponse.status >= 400) {
					message.error(ruleResponse.message);
				} else {
					message.success('Query Rule Updated!');
					this.redirectURL(data);
				}
			} catch (e) {
				message.error('Something went Wrong!');
			}
		} else {
			this.redirectURL(data);
		}
	};

	render() {
		const { appname, queryOperator, searchTerm, rule, url } = getUrlParams(
			window.location.search,
		);
		return (
			<QueryRuleModal
				handleSuccess={data =>
					this.updateQueryRule({ ...data, appname, url, rule })
				}
				renderButton={callback => (
					<Button type="primary" onClick={callback}>
						Manage Query Rule
					</Button>
				)}
				query={searchTerm}
				operator={queryOperator}
				appName={appname}
			/>
		);
	}
}

export default withRouter(UpdateQueryRule);

UpdateQueryRule.contextType = PromotedResultsContext;
