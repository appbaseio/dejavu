import { mediaMin } from '@divyanshu013/media';
import { css } from 'react-emotion';
import colors from '../theme/colors';

const styles = css({
	position: 'relative',

	[mediaMin.medium]: {
		zIndex: '101 !important',
		left: 0,
		position: 'sticky',
		backgroundColor: colors.tableHead,
	},
});

export default styles;
