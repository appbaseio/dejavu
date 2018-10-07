import styled from 'react-emotion';

const Cell = styled('div')(
	{
		width: 250,
		height: 42,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		outline: 'none',
		position: 'relative',
	},
	({ overflow, padding }) =>
		Object.assign({}, overflow && { overflow }, padding && { padding }),
);

export default Cell;
