import React, { Component } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

import { getAppPlan } from '../../batteries/modules/actions';
import { getAppPlanByName } from '../../batteries/modules/selectors';

class AppPlanWrapper extends Component {
	componentDidMount() {
		// Fetch some common api calls
		const {
			appName,
			fetchAppPlan,
			fetchUserPlan,
			shouldFetchUserPlan,
			shouldFetchAppPlan,
			isAppPlanFetched,
		} = this.props;
		if (shouldFetchAppPlan && !isAppPlanFetched) {
			fetchAppPlan(appName);
		}
		if (shouldFetchUserPlan) {
			fetchUserPlan();
		}
	}

	render() {
		const { isLoading, plan, appName, ...props } = this.props;
		let isPaid = false;
		if (plan && plan[appName]) {
			({ isPaid } = plan[appName]);
		}

		if (isLoading) {
			return null;
		}

		return isPaid ? (
			<React.Fragment>{props.children}</React.Fragment>
		) : (
			<Alert
				type="warning"
				showIcon
				message="Require Paid Plan"
				description="Promoted Results are only supported in Paid Plans."
			/>
		);
	}
}

AppPlanWrapper.defaultProps = {
	isLoading: false,
	errors: [],
	shouldFetchAppPlan: true,
};

AppPlanWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	errors: PropTypes.array,
	shouldFetchAppPlan: PropTypes.bool,
	fetchAppPlan: PropTypes.func.isRequired,
	isAppPlanFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const appName = get(ownProps, 'appName');
	return {
		appName,
		isLoading: get(state, '$getAppPlan.isFetching'),
		plan: get(state, '$getAppPlan.results'),
		isAppPlanFetched: !!getAppPlanByName(state),
		errors: [
			ownProps.shouldFetchAppPlan !== false &&
				get(state, '$getAppPlan.error'),
		],
	};
};

const mapDispatchToProps = dispatch => ({
	fetchAppPlan: appName => dispatch(getAppPlan(appName)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppPlanWrapper);
