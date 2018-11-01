import styled from 'react-emotion';
import colors from '../theme/colors';

const CellContent = styled('div')`
	height: 100%;
	width: 100%;
	font-size: 15px;
	border-right: 1px solid ${colors.tableBorderColor};
	border-bottom: 1px solid ${colors.tableBorderColor};
	display: flex;
	justify-content: left;
	align-items: center;
	padding: 10px;
`;

export default CellContent;
