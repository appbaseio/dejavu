import React from 'react';
import { Table, Button, Icon, Tooltip, Alert } from 'antd';
import { css } from 'emotion';

import { PromotedResultsContext } from './PromotedResultsContainer';
import PromotedJSONModal from './PromotedJSONModal';
import DemoteButton from '../DataTable/DemoteButton';
import EditPromotedResult from './EditPromotedResult';
import Container from './Container';

const tableStyles = css`
	.ant-table td {
		white-space: nowrap;
		max-width: 250px;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const noResultStyles = css`
	margin-top: 10;
	padding: 12px 20px;
	background: #eee;
	border-radius: 2px;
`;

const { Column } = Table;

class PromotedResults extends React.Component {
	getAllColumns = results => {
		if (results.length > 0) {
			let columnNames = [];
			results.forEach(item =>
				Object.keys(item).forEach(itemProperty => {
					if (
						itemProperty !== 'key' &&
						itemProperty !== '_index' &&
						itemProperty !== '_type'
					) {
						if (!columnNames.includes(itemProperty)) {
							columnNames = [...columnNames, itemProperty];
						}
					}
				}),
			);
			return columnNames;
		}
		return [];
	};

	renderButtons = id => {
		const item = this.context.promotedResults.find(
			promotedItem => promotedItem._id === id,
		);
		return (
			<React.Fragment>
				<DemoteButton
					item={{ _id: id }}
					renderButton={({ demoteResult, isLoading }) => (
						<Tooltip placement="top" title="Demote">
							<Icon
								onClick={demoteResult}
								type={isLoading ? 'loading' : 'star'}
								theme={isLoading ? 'outlined' : 'filled'}
								style={{
									color: '#1890ff',
									marginRight: 10,
									cursor: 'pointer',
								}}
							/>
						</Tooltip>
					)}
				/>
				<EditPromotedResult
					item={item}
					renderButton={({ callback }) => (
						<Tooltip placement="top" title="Edit">
							<Icon
								onClick={callback}
								type="edit"
								style={{
									color: 'rgba(0,0,0,.65)',
									marginRight: 10,
									cursor: 'pointer',
								}}
							/>
						</Tooltip>
					)}
				/>
			</React.Fragment>
		);
	};

	render() {
		const { promotedResults } = this.context;

		const filteredResults = promotedResults.map(resultItem => ({
			...resultItem,
			key: resultItem._id,
		}));

		const allColumns = this.getAllColumns(filteredResults);
		return (
			<div
				css={{
					boxShadow: '0 1px 10px -2px rgba(0,0,0,0.2)',
					borderLeft: '4px solid #1890ff',
					margin: '40px 0 20px',
				}}
			>
				<Container
					icon="star"
					title="Promoted Results"
					description={
						<React.Fragment>
							Promoted results are returned by the API along with
							the organic hits. Read more on how to use them{' '}
							<a
								href="https://docs.appbase.io/concepts/query-rules.html"
								target="_blank"
							>
								here
							</a>
							.
						</React.Fragment>
					}
					button={
						<PromotedJSONModal
							renderButton={({ clickHandler }) => (
								<Button onClick={clickHandler} type="primary">
									Add a manual promotion (JSON)
								</Button>
							)}
						/>
					}
				/>
				{filteredResults && filteredResults.length > 0 ? (
					<Table
						dataSource={filteredResults}
						scroll={{ x: true }}
						pagination={false}
						className={tableStyles}
					>
						{allColumns.length > 0
							? allColumns.map(columnName =>
									columnName === '_id' ? (
										<Column
											title="Actions"
											key={columnName}
											dataIndex={columnName}
											fixed
											css={{
												maxWidth: '1000px !important',
											}}
											render={columnValue =>
												this.renderButtons(columnValue)
											}
										/>
									) : (
										<Column
											title={columnName}
											key={columnName}
											dataIndex={columnName}
										/>
									),
							  )
							: null}
					</Table>
				) : (
					<Alert
						css={{
							border: 0,
							borderRadius: 0,
						}}
						type="info"
						message="No Hidden Results"
					/>
				)}
			</div>
		);
	}
}

PromotedResults.contextType = PromotedResultsContext;

export default PromotedResults;
