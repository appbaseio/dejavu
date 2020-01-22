import React from 'react';
import {
	Table,
	Button,
	message,
	Popconfirm,
	Input,
	Select,
	Row,
	Col,
} from 'antd';
import { object } from 'prop-types';
import { css } from 'emotion';

import QueryRuleModal from './QueryRuleModal';
import { getUrlParams, getHeaders } from '../../utils';
import getPromotedURL from './utils';

const { Option } = Select;

const actionButtonStyles = (color = '#1890ff') => css`
	cursor: pointer;
	border: 1px solid transparent;
	padding: 6px 8px;
	transition: all ease 0.2s;
	&:hover {
		color: ${color};
		border-radius: 2px;
		border-color: ${color};
	}
`;

const tableContainer = css`
	padding: 20px 50px;
	@media (max-width: 768px) {
		padding: 20px;
	}
`;

const tableStyles = css`
	width: 100%;
`;

class PromotedResultQueries extends React.Component {
	state = {
		isLoading: true,
		queries: [],
	};

	componentDidMount() {
		this.fetchQueries();
	}

	fetchQueries = async () => {
		const { appname, url } = getUrlParams(window.location.search);
		const requestURL = getPromotedURL(url);
		const { Authorization } = getHeaders(url);
		try {
			const queryResponse = await fetch(
				`${requestURL}/${appname}/_rules`,
				{
					headers: {
						Authorization,
					},
				},
			);
			const queryRules = await queryResponse.json();

			if (queryResponse.status >= 400) {
				message.error(queryRules.error.message);
				this.setQueries([]);
			} else {
				const filteredQueries = queryRules.map(rule => ({
					...rule.if,
					id: rule.id,
					hide: rule.then && rule.then.hide,
					promote: rule.then && rule.then.promote,
				}));

				const tableQueriesData = filteredQueries.map(rule => {
					const hiddenItems = rule.hide;
					const promotedItems = rule.promote;
					return {
						key: rule.id,
						id: rule.id,
						query: rule.query,
						operator: rule.operator,
						hiddenItems,
						promotedItems,
					};
				});

				this.setQueries(tableQueriesData);
			}
		} catch (e) {
			message.error('No Rules Found!');
			this.setState({
				isLoading: false,
			});
		}
	};

	setQueries = tableQueriesData => {
		this.setState({
			queries: tableQueriesData,
			isLoading: false,
		});
	};

	redirectURL = data => {
		const { query, operator, url, appname, rule } = data;
		const { history } = this.props;
		let baseURL = `/promoted-results?&appname=${appname}&url=${url}&searchTerm=${query}&queryOperator=${operator}&mode=edit&showActions=false&cloneApp=false&sidebar=false&footer=false&appswitcher=false&oldBanner=false`;
		if (rule) {
			baseURL = `${baseURL}&rule=${rule}`;
		}
		history.push(baseURL);
	};

	removeRow = id => {
		const { queries } = this.state;

		const filteredQueries = queries.filter(query => query.key !== id);

		this.setState({
			queries: filteredQueries,
		});
	};

	deleteRule = async id => {
		const { appname, url } = getUrlParams(window.location.search);

		try {
			const requestURL = getPromotedURL(url);
			const { Authorization } = getHeaders(url);
			const deleteResponse = await fetch(
				`${requestURL}/${appname}/_rule/${id}`,
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
				message.success(deleteObject.message);
				this.removeRow(id);
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}
	};

	handleInputChange = (e, id) => {
		const { queries } = this.state;
		const { value } = e.target;
		const rule = queries.find(queryRule => queryRule.id === id);

		if (rule.query !== value) {
			rule.query = value;
			this.updateQueryRule(rule);
		}
	};

	handleOperatorChange = (value, id) => {
		const { queries } = this.state;
		const rule = queries.find(queryRule => queryRule.id === id);

		if (rule.operator !== value) {
			rule.operator = value;
			this.updateQueryRule(rule);
		}
	};

	updateQueryRule = async ruleData => {
		const { id, hiddenItems, promotedItems, query, operator } = ruleData;
		const { appname, url } = getUrlParams(window.location.search);

		const requestBody = {
			id,
			if: {
				query,
				operator,
			},
			then: {
				hide: hiddenItems,
				promote: promotedItems,
			},
		};

		if (!promotedItems || promotedItems.length === 0) {
			delete requestBody.then.promote;
		}

		if (!hiddenItems || hiddenItems.length === 0) {
			delete requestBody.then.hide;
		}

		try {
			const requestURL = getPromotedURL(url);
			const { Authorization } = getHeaders(url);
			const updateRequest = await fetch(
				`${requestURL}/${appname}/_rule`,
				{
					method: 'POST',
					headers: {
						Authorization,
					},
					body: JSON.stringify(requestBody),
				},
			);
			const updateQueryResponse = await updateRequest.json();
			if (updateRequest.status >= 400) {
				message.error(updateQueryResponse.message);
			} else {
				message.success('Query Rule Updated!');
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}
	};

	render() {
		const { queries, isLoading } = this.state;
		const { appname, url } = getUrlParams(window.location.search);
		const tableStructure = [
			{
				title: 'Query',
				key: 'query',
				render: data => (
					<Input
						defaultValue={data.query}
						disabled={data.operator === 'match_all'}
						onBlur={e => this.handleInputChange(e, data.key)}
						placeholder={
							data.operator === 'match_all'
								? `A query value isn't needed for match_all operator`
								: 'Enter Query'
						}
					/>
				),
			},
			{
				title: 'Operator',
				key: 'operator',
				render: data => (
					<Select
						showSearch
						placeholder="Select a Operator"
						optionFilterProp="children"
						onChange={value =>
							this.handleOperatorChange(value, data.key)
						}
						style={{ width: '100%' }}
						defaultValue={data.operator}
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
					</Select>
				),
			},
			{
				title: 'Promoted Items',
				dataIndex: 'promotedItems',
				key: 'promotedItems',
				render: data => {
					if (data) {
						return data.length || 0;
					}
					return 0;
				},
			},
			{
				title: 'Hidden Items',
				dataIndex: 'hiddenItems',
				key: 'hiddenItems',
				render: data => {
					if (data) {
						return data.length || 0;
					}
					return 0;
				},
			},
			{
				title: 'Actions',
				width: '200px',
				render: data => (
					<div
						style={{
							justifyContent: 'space-around',
							display: 'flex',
						}}
					>
						<span
							css={actionButtonStyles()}
							onClick={() =>
								this.redirectURL({
									query: data.query,
									operator: data.operator,
									appname,
									url,
									rule: data.key,
								})
							}
						>
							Update
						</span>
						<Popconfirm
							title="Are you sure delete this Rule?"
							onConfirm={() => this.deleteRule(data.key)}
							okText="Yes"
							cancelText="No"
						>
							<span css={actionButtonStyles('#f5222d')}>
								Delete
							</span>
						</Popconfirm>
					</div>
				),
			},
		];

		return (
			<React.Fragment>
				<Row
					type="flex"
					justify="space-between"
					gutter={16}
					css={{
						padding: '20px 50px',
						boxShadow: '0 2px 5px rgba(0,0,0,.2)',
						margin: '0 0 10px !important',
						background: 'white',
					}}
				>
					<Col md={18} css={{ padding: '0 !important' }}>
						<h2
							css={{
								fontWeight: 700,
								lineHeight: '2.5rem',
								margin: '0 0 8px',
								padding: 0,
							}}
						>
							Promoted Results
						</h2>
						<Row>
							<Col span={18}>
								<p
									css={{
										fontSize: 16,
										letterSpacing: '0.01rem',
										lineHeight: '26px',
									}}
								>
									Promote and hide your results for search
									queries.
								</p>
							</Col>
						</Row>
					</Col>
					<Col
						md={6}
						css={{
							display: 'flex',
							flexDirection: 'column-reverse',
							padding: '0 0 20px !important',
						}}
					>
						<QueryRuleModal
							handleSuccess={data =>
								this.redirectURL({
									...data,
									appname,
									url,
								})
							}
							renderButton={callback => (
								<Button
									type="primary"
									size="large"
									onClick={callback}
								>
									Create Query Rule
								</Button>
							)}
							appName={appname}
						/>
					</Col>
				</Row>
				<div className={tableContainer}>
					<Table
						bordered
						dataSource={queries}
						loading={isLoading}
						pagination={false}
						scroll={{ x: 700 }}
						className={tableStyles}
						columns={tableStructure}
					/>
				</div>
			</React.Fragment>
		);
	}
}

PromotedResultQueries.propTypes = {
	history: object,
};

export default PromotedResultQueries;
