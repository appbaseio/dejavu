import React from 'react';
import { Table, Button, Icon, Tooltip } from 'antd';
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
							style={{ background: '#174aff' }}
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
				<Table
					dataSource={filteredResults}
					scroll={{ x: true }}
					title={() => (
						<PromotedJSONModal
							renderButton={({ clickHandler }) => (
								<Button onClick={clickHandler} type="primary">
									Add JSON
								</Button>
							)}
						/>
					)}
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
										css={{ maxWidth: '1000px !important' }}
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
			</React.Fragment>
		);
	}
}

PromotedResults.contextType = PromotedResultsContext;

export default PromotedResults;
