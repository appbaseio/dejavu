import styled, { css } from 'react-emotion';
import colors from '../theme/colors';

const Cell = styled('td')`
	min-width: 230px;
	max-width: 230px;
	height: 60px;
	outline: 0;
	border: 0;

	${({ isHeader }) =>
		isHeader &&
		css`
			position: sticky;
			top: 0;
			z-index: 100;
			background: ${colors.tableHead};
			font-weight: 500;
		`};

	${({ isFixed }) =>
		isFixed &&
		css`
			position: sticky;
			left: 0px;
		`};
`;

export default Cell;
