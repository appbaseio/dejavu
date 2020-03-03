// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSortAlphaDown,
	faSortAlphaUp,
} from '@fortawesome/free-solid-svg-icons';

import Flex from '../Flex';

import { getSort } from '../../reducers/sort';
import { resetSort } from '../../actions';
import colors from '../theme/colors';
import overflowStyles from '../CommonStyles/overflowText';

type Props = {
	onResetSort: () => void,
	field: string,
	order: string,
};

const SortFiler = ({ field, order, onResetSort }: Props) => (
	<Fragment>
		{field !== '_score' && (
			<Flex
				alignItems="center"
				css={{
					marginRight: 5,
					background: colors.background,
					minHeight: 30,
					borderRadius: 3,
					padding: '5px 8px',
					lineHeight: '1.2rem',
					maxWidth: 200,
					fontSize: 13,
					'&:hover': {
						backgroundColor: colors.hoverBackground,
						color: colors.hoverLink,
						span: {
							textDecoration: 'line-through',
						},
					},
				}}
				className={overflowStyles}
			>
				<FontAwesomeIcon
					icon={order === 'asc' ? faSortAlphaUp : faSortAlphaDown}
				/>
				<span
					css={{
						padding: '0 8px',
						maxWidth: '80%',
					}}
					className={overflowStyles}
				>
					{field}
				</span>
				<button
					type="button"
					css={{
						outline: 0,
						border: 0,
						cursor: 'pointer',
						background: 'none',
					}}
					onClick={onResetSort}
				>
					✕
				</button>
			</Flex>
		)}
	</Fragment>
);

const mapStateToProps = state => {
	const { field, order } = getSort(state);
	return {
		field,
		order,
	};
};

const mapDispatchToProps = {
	onResetSort: resetSort,
};

export default connect(mapStateToProps, mapDispatchToProps)(SortFiler);
