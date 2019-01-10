// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Popover, Checkbox } from 'antd';
import { mediaMin } from '@divyanshu013/media';

import StyledCell from './StyledCell';
import Flex from '../Flex';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import { getMode } from '../../reducers/mode';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getCurrentIds } from '../../reducers/currentIds';
import popoverContent from '../CommonStyles/popoverContent';
import { MODES } from '../../constants';
import colors from '../theme/colors';

type Props = {
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	currentIds: string[],
	selectedRows: string[],
	mode: string,
};

class IdHeaderField extends PureComponent<Props> {
	handleSelectAllRows = e => {
		const {
			target: { checked },
		} = e;
		const { onSelectedRows, onSetUpdatingRow, currentIds } = this.props;

		if (checked) {
			onSelectedRows(currentIds);
		} else {
			onSelectedRows([]);
		}
		onSetUpdatingRow(null);
	};

	render() {
		const { selectedRows, mode, currentIds } = this.props;
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
					<Flex
						css={{
							width: '15%',
						}}
						alignItems="center"
						justifyContent="center"
					>
						{selectedRows.length >= 1 &&
							mode === MODES.EDIT && (
								<Checkbox
									onChange={this.handleSelectAllRows}
									checked={
										selectedRows.length ===
										currentIds.length
									}
								/>
							)}
					</Flex>
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
								maxWidth: '10%',
								minWidth: '10%',
							}}
						>{` {...} `}</span>
					</Popover>
					<div
						css={{
							marginLeft: '10px',
						}}
					>
						_id
						<i
							css={{
								fontSize: 12,
								fontWeight: 'normal',
							}}
						>
							{selectedRows.length > 0 &&
								`  (${selectedRows.length} rows selected)`}
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
});

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(IdHeaderField);
