import styled, { css } from 'react-emotion';
import colors from '../theme/colors';

const Cell = styled('td')`
	min-width: 230px;
	max-width: 230px;
	height: 30px;
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
			min-width: 260px;
			max-width: 260px;
			position: sticky;
			left: 0px;
		`};
	${({ isEditing }) =>
		isEditing &&
		css`
			height: 35px !important;
		`};
`;

export default Cell;
