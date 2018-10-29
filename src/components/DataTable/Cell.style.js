import styled, { css } from 'react-emotion';
import colors from '../theme/colors';

const Cell = styled('td')`
	padding: 10px;
	min-width: 230px;
	max-width: 230px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 15px;
	border-right: 1px solid ${colors.tableBorderColor};
	border-bottom: 1px solid ${colors.tableBorderColor};

	:last-child {
		border-right: 0;
	}

	${({ isHeader }) =>
		isHeader &&
		css`
			position: sticky;
			top: 0;
			z-index: 100;
			background: ${colors.tableHead};
			font-weight: 500;
			top: 0px;
			border-bottom: 0;
			box-shadow: 0px 1px 1px 0px ${colors.tableBorderColor};
		`};

	${({ isFixed }) =>
		isFixed &&
		css`
			position: sticky;
			left: 0px;
			border-bottom: 1px solid ${colors.tableBorderColor};
			box-shadow: 0px 1px 1px 0px ${colors.tableBorderColor};
		`};
`;

export default Cell;
