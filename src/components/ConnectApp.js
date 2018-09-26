// @flow

import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { string, func, bool } from 'prop-types';

import {
	getAppname,
	getUrl,
	getIsLoading,
	getIsConnected,
	getError,
} from '../reducers/app';
import { connectApp } from '../actions';

const { Item } = Form;

type Props = {
	appname: string,
	url: string,
	connectApp: (string, string) => void,
	isConnected: boolean,
	isLoading: boolean,
	error: string,
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

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { appname, url } = this.state;
		if (appname && url) {
			this.props.connectApp(appname, url);
		}
	};

	render() {
		const { appname, url } = this.state;
		const { isLoading, isConnected } = this.props;
		return (
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
					/>
				</Item>
				<Item {...formItemProps}>
					<Input
						placeholder="App Name (aka Index)"
						value={appname}
						name="appname"
						onChange={this.handleChange}
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
};

ConnectApp.propTypes = {
	appname: string,
	url: string,
	connectApp: func.isRequired,
	isConnected: bool.isRequired,
	isLoading: bool.isRequired,
	error: string,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ConnectApp);
