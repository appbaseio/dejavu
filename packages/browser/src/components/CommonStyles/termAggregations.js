import colors from '../theme/colors';

export default {
	maxWidth: 200,
	'.ant-checkbox-input:checked + label::before': {
		borderColor: `${colors.primary} !important`,
	},
	'.ant-checkbox-input:checked + label::after': {
		left: 'calc(1px + 12px/5) !important',
		width: 'calc(12px / 2) !important',
		height: 'calc(12px / 5) !important',
		marginTop: 'calc(12px / -2 / 2 * 0.8) !important',
		top: '11px !important',
	},
	'.ant-checkbox-input + label::before': {
		borderRadius: '3px',
		color: `${colors.primary} !important`,
		borderWidth: '1px !important',
		height: '12px !important',
		width: '12px !important',
	},
	'.ant-checkbox-input:hover + label::before': {
		borderColor: `${colors.primary} !important`,
	},
	label: {
		alignItems: 'center !important',
	},
};
