import styled, { css } from 'react-emotion';
import colors from '../theme/colors';

const Cell = styled('tr')`
	display: table;
	border-bottom: 1px solid ${colors.tableBorderColor};

	${({ isHeader }) =>
		isHeader &&
		css`
			position: sticky;
			top: 0;
			z-index: 100;
			box-shadow: 0 1px 1px -1px ${colors.tableBorderColor};
		`};
`;

export default Cell;
