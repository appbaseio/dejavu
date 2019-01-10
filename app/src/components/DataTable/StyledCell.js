import styled, { css } from 'react-emotion';
import { MODES } from '../../constants';
import colors from '../theme/colors';

export default styled('div')`
	display: flex;
	align-items: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 200px;
	font-size: 12px;
	padding: 10px;
	border-bottom: 1px solid ${colors.tableBorderColor};
	border-right: 1px solid ${colors.tableBorderColor};
	flex: 0 0 auto;
	${props =>
		props.mode === MODES.EDIT
			? css`
					min-height: 45px;
					max-height: 45px;
			  `
			: css`
					min-height: 30px;
					max-height: 30px;
			  `};
`;
