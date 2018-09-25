// @flow

import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { object } from 'prop-types';

const { Item } = Form;

type Props = {
	form: object,
};

class ConnectApp extends Component<Props> {
	handleSubmit = e => {
		e.preventDefault();
	};

	render() {
		const {
			form: { getFieldDecorator, getFieldError, isFieldTouched },
		} = this.props;
		const isAppError = isFieldTouched('app') && getFieldError('app');
		const isUrlError = isFieldTouched('url') && getFieldError('url');
		return (
			<Form layout="inline" onSubmit={this.handleSubmit}>
				<Item
					validateStatus={isUrlError ? 'error' : ''}
					help={isUrlError || ''}
				>
					{getFieldDecorator('url', {
						rules: [
							{
								required: true,
								message: 'Please enter your ElasticSearch URL',
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="lock"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							type="password"
							placeholder="Password"
						/>,
					)}
				</Item>
				<Item
					validateStatus={isAppError ? 'error' : ''}
					help={isAppError || ''}
				>
					{getFieldDecorator('app', {
						rules: [
							{
								required: true,
								message: 'Please input your app name',
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="user"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							placeholder="App Name (aka Index)"
						/>,
					)}
				</Item>

				<Item>
					<Button type="primary" htmlType="submit" icon="play">
						Connect
					</Button>
				</Item>
			</Form>
		);
	}
}

ConnectApp.propTypes = {
	form: object.isRequired,
};

export default Form.create()(ConnectApp);
