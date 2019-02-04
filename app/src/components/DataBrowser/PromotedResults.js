import React from 'react';
import { Table, Button, Icon, Tooltip, Alert } from 'antd';
import { css } from 'emotion';

import { PromotedResultsContext } from './PromotedResultsContainer';
import PromotedJSONModal from './PromotedJSONModal';
import DemoteButton from '../DataTable/DemoteButton';

const tableStyles = css`
	.ant-table td {
		white-space: nowrap;
		max-width: 250px;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const { Column } = Table;

class PromotedResults extends React.Component {
	getAllColumns = results => {
		if (results.length > 0) {
			let columnNames = [];
			results.forEach(item =>
				Object.keys(item).forEach(itemProperty => {
					if (!columnNames.includes(itemProperty)) {
						columnNames = [...columnNames, itemProperty];
					}
				}),
			);
			return columnNames;
		}
		return [];
	};

	renderButtons = id => (
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

			<span>{id}</span>
		</React.Fragment>
	);

	render() {
		const { promotedResults } = this.context;

		const filteredResults = promotedResults.map(resultItem => ({
			...resultItem,
			key: resultItem._id,
		}));

		const allColumns = this.getAllColumns(filteredResults).filter(
			name => name !== 'key',
		);

		return (
			<React.Fragment>
				<div
					css={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '20px',
					}}
				>
					<h3 css={{ fontSize: 15, margin: 0 }}>
						<Icon type="star" theme="filled" /> Promoted Results
					</h3>
					<PromotedJSONModal
						renderButton={({ clickHandler }) => (
							<Button onClick={clickHandler} type="primary">
								Add JSON
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
											title={columnName}
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
						css={{ marginTop: 10 }}
						message="No Promoted Results"
						type="info"
					/>
				)}
			</React.Fragment>
		);
	}
}

PromotedResults.contextType = PromotedResultsContext;

export default PromotedResults;
