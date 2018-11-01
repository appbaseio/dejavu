import styled from 'react-emotion';

const Cell = styled('div')(
	{
		height: '100%',
		width: '100%',
		position: 'relative',
	},
	({ overflow, padding }) =>
		Object.assign({}, overflow && { overflow }, padding && { padding }),
);

export default Cell;
