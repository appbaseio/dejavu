import React from 'react';
import { Table, Button, message, Popconfirm, Input, Select } from 'antd';
import { object } from 'prop-types';

import CurationModal from './CurationModal';
import { getUrlParams } from '../../utils';

const { Option } = Select;

class PromotedResultQueries extends React.Component {
	state = {
		isLoading: true,
		queries: [],
	};

	componentDidMount() {
		this.fetchQueries();
	}

	fetchQueries = async () => {
		const { appname } = getUrlParams(window.location.search);

		try {
			const queryResponse = await fetch(
				`https://accapi.appbase.io/app/${appname}/rules`,
				{
					credentials: 'include',
				},
			);
			const queryRules = await queryResponse.json();

			if (queryResponse.status >= 400) {
				message.error(queryRules.message);
				this.setQueries([]);
			} else {
				const filteredQueries = queryRules.map(rule => ({
					...rule.if,
					id: rule.id,
					hide: rule.then && rule.then.hide,
					promote: rule.then && rule.then.promote,
				}));

				const tableQueriesData = filteredQueries.map(rule => {
					const hiddenItems = rule.hide ? rule.hide.length : 0;
					const promotedItems = rule.promote
						? rule.promote.length
						: 0;
					return {
						key: rule.id,
						query: rule.query,
						operators: rule.operator,
						hiddenItems,
						promotedItems,
					};
				});

				this.setQueries(tableQueriesData);
			}
		} catch (e) {
			message.error('Something went Wrong!');
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
		history.push(
			`/promoted-results?&appname=${appname}&url=${url}&searchTerm=${query}&queryOperator=${operator}&mode=edit&showActions=false&cloneApp=false&sidebar=false&footer=false&rule=${rule}`,
		);
	};

	removeRow = id => {
		const { queries } = this.state;

		const filteredQueries = queries.filter(query => query.key !== id);

		this.setState({
			queries: filteredQueries,
		});
	};

	deleteRule = async id => {
		const { appname } = getUrlParams(window.location.search);

		try {
			const deleteResponse = await fetch(
				`https://accapi.appbase.io/app/${appname}/rule/${id}`,
				{
					method: 'DELETE',
					credentials: 'include',
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

	handleInputChange = () => {
		/* Arguments : e, id
		TODO Add Fetch Request to POST data along with the Body
		*/
	};

	handleOperatorChange = () => {
		/* Arguments value, id
		TODO Add Fetch Request to POST data along with the Body
		*/
	};

	render() {
		const { queries, isLoading } = this.state;
		const { appname, url } = getUrlParams(window.location.search);
		const tableStructure = [
			{
				title: 'Queries',
				key: 'query',
				render: data => (
					<Input
						defaultValue={data.query}
						onBlur={e => this.handleInputChange(e, data.key)}
						placeholder="Enter Query"
					/>
				),
			},
			{
				title: 'Operators',
				key: 'operators',
				render: data => (
					<Select
						showSearch
						placeholder="Select a Operator"
						optionFilterProp="children"
						onChange={value =>
							this.handleOperatorChange(value, data.key)
						}
						style={{ width: '100%' }}
						defaultValue={data.operators}
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
			},
			{
				title: 'Hidden Items',
				dataIndex: 'hiddenItems',
				key: 'hiddenItems',
			},
			{
				title: 'Action',
				width: '200px',
				render: data => (
					<div
						style={{
							justifyContent: 'space-around',
							display: 'flex',
						}}
					>
						<span
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
							<span>Delete</span>
						</Popconfirm>
					</div>
				),
			},
		];

		return (
			<React.Fragment>
				<Table
					bordered={false}
					dataSource={queries}
					loading={isLoading}
					columns={tableStructure}
					title={() => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h1
								style={{
									margin: 0,
									color: 'rgba(0,0,0,.85)',
								}}
							>
								Query Rules
							</h1>
							<CurationModal
								handleSuccess={data =>
									this.redirectURL({ ...data, appname, url })
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
						</div>
					)}
				/>
			</React.Fragment>
		);
	}
}

PromotedResultQueries.propTypes = {
	history: object,
};

export default PromotedResultQueries;
