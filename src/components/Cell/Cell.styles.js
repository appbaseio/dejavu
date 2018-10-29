import styled from 'react-emotion';

const Cell = styled('div')(
	{
		height: 'auto',
		width: '100%',
		outline: 'none',
		position: 'relative',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	({ overflow, padding }) =>
		Object.assign({}, overflow && { overflow }, padding && { padding }),
);

export default Cell;
