import React from 'react';
import { Table, Button, Icon, Tooltip } from 'antd';
import { css } from 'emotion';

import { PromotedResultsContext } from './PromotedResultsContainer';
import PromotedJSONModal from './PromotedJSONModal';
import DemoteButton from '../DataTable/DemoteButton';
import EditPromotedResult from './EditPromotedResult';

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
							<Button
								css={{ marginRight: 10 }}
								shape="circle"
								style={{ background: '#1890ff' }}
								onClick={demoteResult}
							>
								<Icon
									type={isLoading ? 'loading' : 'star'}
									theme={isLoading ? 'outlined' : 'filled'}
									style={{ color: '#fff' }}
								/>
							</Button>
						</Tooltip>
					)}
				/>
				<EditPromotedResult
					item={item}
					renderButton={({ callback }) => (
						<Button
							css={{ marginRight: 10 }}
							shape="circle"
							icon="edit"
							onClick={callback}
						/>
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
			<React.Fragment>
				<div
					css={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						margin: '20px auto 10px',
					}}
				>
					<div>
						<h3 css={{ margin: 0 }}>
							<Icon type="star" theme="filled" /> Promoted Results
						</h3>
						<p css={{ paddingLeft: 20 }} className="ant-form-extra">
							Promoted results are returned by the API along with
							the organic hits. Read more on how to use them{' '}
							<a href="https://docs.appbase.io/concepts/query-rules.html" target="_blank">
								here
							</a>
							.
						</p>
					</div>
					<PromotedJSONModal
						renderButton={({ clickHandler }) => (
							<Button onClick={clickHandler} type="primary">
								Add a manual promotion (JSON)
							</Button>
						)}
					/>
				</div>

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
					<div css={noResultStyles}>
						<span css={{ fontSize: 14 }}>No Promoted Results</span>
					</div>
				)}
			</React.Fragment>
		);
	}
}

PromotedResults.contextType = PromotedResultsContext;

export default PromotedResults;
