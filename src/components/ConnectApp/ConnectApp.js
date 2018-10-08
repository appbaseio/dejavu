// @flow

import React, { Component } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { connect } from 'react-redux';
import { string, func, bool, object } from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
	getAppname,
	getUrl,
	getIsLoading,
	getIsConnected,
	getError,
} from '../../reducers/app';
import { connectApp, disconnectApp } from '../../actions';
import { getUrlParams } from '../../utils';

const { Item } = Form;

type Props = {
	appname: string,
	url: string,
	connectApp: (string, string) => void,
	disconnectApp: () => void,
	isConnected: boolean,
	isLoading: boolean,
	error: string,
	history: object,
};

type State = {
	appname: string,
	url: string,
};

const formItemProps = {
	wrapperCol: {
		xs: {
			span: 24,
		},
	},
};

class ConnectApp extends Component<Props, State> {
	state = {
		appname: this.props.appname || '',
		url: this.props.url || '',
	};

	componentDidMount() {
		// sync state from url
		const { appname = '', url = '' } = getUrlParams(window.location.search);
		this.setState({ appname, url });
		if (appname && url) {
			this.props.connectApp(appname, url);
		}
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { appname, url } = this.state;
		if (this.props.isConnected) {
			this.props.disconnectApp();
		} else if (appname && url) {
			this.props.connectApp(appname, url);
			// update history with correct appname and url
			this.props.history.push(`?appname=${appname}&url=${url}`);
		}
	};

	render() {
		const { appname, url } = this.state;
		const { isLoading, isConnected, error } = this.props;
		return (
			<>
				{!isLoading &&
					error && (
						<Alert
							showIcon
							message={error}
							type="error"
							closable
							css={{ marginBottom: 10 }}
						/>
					)}
				<Form
					layout="inline"
					onSubmit={this.handleSubmit}
					css={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr auto',
						marginBottom: 25,
					}}
				>
					<Item {...formItemProps}>
						<Input
							placeholder="URL"
							value={url}
							name="url"
							onChange={this.handleChange}
							disabled={isConnected}
						/>
					</Item>
					<Item {...formItemProps}>
						<Input
							placeholder="App Name (aka Index)"
							value={appname}
							name="appname"
							onChange={this.handleChange}
							disabled={isConnected}
						/>
					</Item>

					<Item>
						<Button
							type={isConnected ? 'danger' : 'primary'}
							htmlType="submit"
							icon={isConnected ? 'pause-circle' : 'play-circle'}
							disabled={!(appname && url)}
							loading={isLoading}
						>
							{isConnected ? 'Disconnect' : 'Connect'}
						</Button>
					</Item>
				</Form>
				{!isLoading &&
					!isConnected && (
						<Alert
							type="info"
							showIcon
							message="Connecting to ElasticSearch"
							description={
								<div>
									<p>
										To make sure you enable CORS settings
										for your ElasticSearch instance, add the
										following lines in the ES configuration
										file:
									</p>
									<pre>
										{`http.port: 9200
http.cors.allow-origin: http://localhost:1357
http.cors.enabled: true
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true`}
									</pre>
								</div>
							}
						/>
					)}
			</>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
	error: getError(state),
});

const mapDispatchToProps = {
	connectApp,
	disconnectApp,
};

ConnectApp.propTypes = {
	appname: string,
	url: string,
	connectApp: func.isRequired,
	disconnectApp: func.isRequired,
	isConnected: bool.isRequired,
	isLoading: bool.isRequired,
	error: string,
	history: object,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(ConnectApp),
);
