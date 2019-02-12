import React, { Component } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon } from 'antd';

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
			<Row
				type="flex"
				justify="space-between"
				gutter={16}
				css={{
					padding: '20px 50px',
					boxShadow: '0 2px 5px rgba(0,0,0,.2)',
					margin: '0 !important',
					background: 'white',
				}}
			>
				<Col md={18} css={{ padding: '0 !important' }}>
					<h2
						css={{
							fontWeight: 700,
							lineHeight: '2.5rem',
							margin: '0 0 8px',
							padding: 0,
						}}
					>
						Unlock Promoted Results
					</h2>
					<Row>
						<Col span={18}>
							<p
								css={{
									fontSize: 16,
									letterSpacing: '0.01rem',
									lineHeight: '26px',
								}}
							>
								Get a paid plan to enable Promoted Results.
							</p>
						</Col>
					</Row>
				</Col>
				<Col
					md={6}
					css={{
						display: 'flex',
						flexDirection: 'column-reverse',
						padding: '0 0 20px !important',
					}}
				>
					<Button
						size="large"
						type="primary"
						href={`https://dashboard.appbase.io/app/${appName}/billing`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon type="info-circle" />
						Upgrade to Paid Plan
					</Button>
				</Col>
			</Row>
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
