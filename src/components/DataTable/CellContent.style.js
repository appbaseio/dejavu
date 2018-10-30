import styled from 'react-emotion';
import colors from '../theme/colors';

const CellContent = styled('div')`
	height: 100%;
	width: 100%;
	font-size: 15px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	border-right: 1px solid ${colors.tableBorderColor};
	border-bottom: 1px solid ${colors.tableBorderColor};
	display: flex;
	justify-content: left;
	align-items: center;
`;

export default CellContent;
