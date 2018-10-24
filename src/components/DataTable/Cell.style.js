import styled, { css } from 'react-emotion';
import colors from '../theme/colors';

const Cell = styled('td')`
	padding: 10px;
	min-width: 230px;
	max-width: 230px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	border-right: 1px solid ${colors.tableBorderColor};
	font-size: 15px;

	:last-child {
		border-right: 0;
	}

	${({ isHeader }) =>
		isHeader &&
		css`
			background: ${colors.tableHead};
			font-weight: 500;
			background-clip: padding-box;
			box-shadow: 0 0 1px -1px ${colors.tableBorderColor};
		`};
`;

export default Cell;
