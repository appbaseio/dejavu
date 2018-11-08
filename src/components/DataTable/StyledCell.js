import styled from 'react-emotion';
import colors from '../theme/colors';

export default styled('div')`
	display: flex;
	align-items: center;
	border-bottom: 1px solid ${colors.tableBorderColor};
	border-right: 1px solid ${colors.tableBorderColor};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	font-size: 12px;
	padding: 10px;
`;
