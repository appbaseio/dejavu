import React from 'react';
import { message } from 'antd';

import { getUrlParams } from '../../utils';

export const PromotedResultsContext = React.createContext({});

class PromotedResultsContainer extends React.Component {
	state = {
		promotedResults: [],
		hiddenResults: [],
	};

	componentDidMount() {
		this.fetchResults();
	}

	fetchResults = async () => {
		const { rule, appname } = getUrlParams(window.location.search);

		if (rule) {
			try {
				const rulesResponse = await fetch(
					`https://accapi.appbase.io/app/${appname}/rule/${rule}`,
					{
						method: 'GET',
						credentials: 'include',
					},
				);

				const rules = await rulesResponse.json();

				if (rulesResponse.status >= 400) {
					message.error(rules.message);
				} else {
					const {
						then: { promote, hide },
					} = rules;
					this.setState({
						promotedResults: promote || [],
						hiddenResults: hide || [],
					});
				}
			} catch (e) {
				message.error('Something went Wrong!');
			}
		}
	};

	appendResult = ruleAdded => {
		this.setState(prevState => ({
			promotedResults: [...prevState.promotedResults, ruleAdded],
		}));
	};

	removeResult = id => {
		const { promotedResults } = this.state;
		const filteredResults = promotedResults.filter(
			resultItem => resultItem._id !== id,
		);

		this.setState({
			promotedResults: filteredResults,
		});
	};

	appendHiddenResult = id => {
		this.setState(prevState => ({
			hiddenResults: [...prevState.hiddenResults, { doc_id: id }],
		}));
	};

	removeHiddenResult = id => {
		const { hiddenResults } = this.state;
		const filteredResults = hiddenResults.filter(
			resultItem => resultItem.doc_id !== id,
		);

		this.setState({
			hiddenResults: filteredResults,
		});
	};

	render() {
		const { promotedResults, hiddenResults } = this.state;
		return (
			<PromotedResultsContext.Provider
				value={{
					promotedResults,
					hiddenResults,
					appendResult: this.appendResult,
					removeResult: this.removeResult,
					appendHiddenResult: this.appendHiddenResult,
					removeHiddenResult: this.removeHiddenResult,
				}}
			>
				{this.props.children}
			</PromotedResultsContext.Provider>
		);
	}
}

export default PromotedResultsContainer;
