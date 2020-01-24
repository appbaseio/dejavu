// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Popover, Checkbox } from 'antd';
import { mediaMin } from '@divyanshu013/media';

import StyledCell from './StyledCell';
import Flex from '../Flex';

import {
	setSelectedRows,
	setUpdatingRow,
	setSelectAll,
	setApplyQuery,
} from '../../actions';
import { getMode } from '../../reducers/mode';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getCurrentIds } from '../../reducers/currentIds';
import { getSelectAll } from '../../reducers/selectAll';
import { getApplyQuery } from '../../reducers/applyQuery';
import { getPageSize } from '../../reducers/pageSize';
import { getStats } from '../../reducers/stats';
import popoverContent from '../CommonStyles/popoverContent';
import { MODES } from '../../constants';
import colors from '../theme/colors';
import { getUrlParams, numberWithCommas } from '../../utils';
import overflowText from './overflow.style';

type Props = {
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	currentIds: string[],
	selectedRows: string[],
	mode: string,
	selectAll: boolean,
	onSetSelectAll: boolean => void,
	applyQuery: boolean,
	onSetApplyQuery: boolean => void,
	pageSize: number,
	stats: any,
};

class IdHeaderField extends PureComponent<Props> {
	handleSelectAllRows = e => {
		const {
			target: { checked },
		} = e;
		const {
			onSelectedRows,
			onSetUpdatingRow,
			currentIds,
			onSetSelectAll,
			onSetApplyQuery,
		} = this.props;

		if (checked) {
			onSelectedRows(currentIds);
			onSetSelectAll(true);
		} else {
			onSelectedRows([]);
			onSetSelectAll(false);
		}
		onSetApplyQuery(false);
		onSetUpdatingRow(null);
	};

	render() {
		const {
			selectAll,
			mode,
			selectedRows,
			applyQuery,
			pageSize,
			stats,
		} = this.props;
		const { results } = getUrlParams(window.location.search);
		const currentPage = parseInt(results || 1, 10);
		return (
			<StyledCell
				css={{
					background: colors.tableHead,
					width: 120,
					fontWeight: 'bold',
					zIndex: '101 !important',
					left: 0,
					top: 0,
					position: 'sticky',

					[mediaMin.medium]: {
						width: 250,
					},
				}}
			>
				<Flex
					css={{
						width: '100%',
					}}
					alignItems="center"
					justifyContent="left"
					wrap="nowrap"
				>
					<div css={{ visibility: 'hidden' }}>
						{pageSize * (currentPage - 1) + pageSize}
					</div>
					{mode === MODES.EDIT && (
						<Checkbox
							onChange={this.handleSelectAllRows}
							checked={selectAll || applyQuery}
							css={{
								marginLeft: 7,
							}}
						/>
					)}
					<Popover
						content={
							<div css={popoverContent}>
								Clicking on {`{...}`} displays the JSON data.
							</div>
						}
						trigger="click"
					>
						<span
							css={{
								cursor: 'pointer',
								margin: '0 7px',
							}}
						>{` {...} `}</span>
					</Popover>
					<div css={overflowText}>
						_id
						<i
							css={{
								fontSize: 12,
								fontWeight: 'normal',
							}}
						>
							{selectedRows.length > 0 &&
								`  (${
									applyQuery
										? numberWithCommas(stats.totalResults)
										: selectedRows.length
								} rows selected)`}
						</i>
					</div>
				</Flex>
			</StyledCell>
		);
	}
}

const mapStateToProps = state => ({
	currentIds: getCurrentIds(state),
	selectedRows: getSelectedRows(state),
	mode: getMode(state),
	selectAll: getSelectAll(state),
	applyQuery: getApplyQuery(state),
	pageSize: getPageSize(state),
	stats: getStats(state),
});

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
	onSetSelectAll: setSelectAll,
	onSetApplyQuery: setApplyQuery,
};

export default connect(mapStateToProps, mapDispatchToProps)(IdHeaderField);
