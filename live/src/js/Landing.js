import React, { Component } from 'react';
import { GithubButton, Navbar, H1, H2, Hero, Flex, Button, Text } from '@appbaseio/designkit';
import { Input, Form, Icon, Select, Tag, Button as AntButton } from 'antd';
import { css, cx } from 'react-emotion';
import UrlParser from 'url-parser-lite';
import { bool, arrayOf, object, string, func } from 'prop-types';

const colors = {
	textPrimary: '#383E43',
	textSecondary: '#30373C'
};

const button = css({
	fontSize: 16,
	color: 'white',
	background: '#0087FF',
	'&:hover, &:focus': {
		color: 'white',
		background: '#0059A8'
	}
});

const input = css({
	fontSize: 14,
	marginBottom: 30
});

// a new page but connections are still legacy
class Landing extends Component {
	state = {
		stars: '4,500',
		newApp: ''
	}

	componentDidMount() {
		fetch('https://api.github.com/repos/appbaseio/dejavu')
			.then(res => res.json())
			.then(json => this.setState({
				stars: `${String(json.stargazers_count).slice(0, -3)},${String(json.stargazers_count).slice(-3)}`
			}));
		this.selectRef = React.createRef();
	}

	render() {
		const { stars, newApp } = this.state;
		const {
			apps,
			url,
			onUrlChange,
			indexUrl,
			fetchIndices,
			showFetchIndex,
			onAppSelect,
			onConnect,
			onAppNameChange
		} = this.props;
		return (
			<section css={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: 10 }}>
				<Navbar height="80px">
					<Navbar.Logo>
						<img src="/live/assets/img/dejavu.svg" alt="Dejavu Logo" height="45px" />
					</Navbar.Logo>
					<div
						css={{
							'@media (max-width: 768px)': {
								display: 'none'
							}
						}}
					>
						<GithubButton
							target="_blank"
							href="https://github.com/appbaseio/dejavu"
							label="View Dejavu on GitHub"
							shadow
							count={stars}
						/>
					</div>
				</Navbar>
				<Hero css={{ height: '100vh', background: '#FBFBFB' }}>
					<Flex flexDirection="column" alignItems="center" justifyContent="center" css={{ height: '100%' }}>
						<H1 css={{ color: colors.textPrimary, fontSize: 52, marginBottom: 60 }}>The missing web UI for Elasticsearch</H1>
						<div
							css={{
								display: 'grid',
								gridTemplateColumns: '2fr 1fr',
								gridGap: 20,
								'@media (max-width: 768px)': {
									gridTemplateColumns: '1fr'
								}
							}}
						>
							<div css={{ padding: 50, borderRadius: 8, background: '#BFDDF9' }}>
								<Form>
									<Flex>
										<Input
											css={input}
											size="large"
											value={url}
											onChange={(urlVal) => {
												document.getElementById('gg-url').value = urlVal;
												onUrlChange(urlVal);
												setTimeout(() => {
													document.getElementById('appname-aka-index').value = newApp;
												}, 100);
											}}
											onBlur={() => fetchIndices(indexUrl)}
											placeholder="URL for cluster goes here. e.g. https://username:password@scalr.api.appbase.io"
										/>
										{
											showFetchIndex &&
											<AntButton
												size="large"
												icon="bars"
												css={{ marginLeft: 10 }}
												onClick={() => {
													fetchIndices(indexUrl);
													this.selectRef.current.focus();
												}}
											>
												Fetch Indices
											</AntButton>
										}
									</Flex>
									<Select
										onSearch={(appName) => {
											this.setState({
												newApp: appName
											});
											setTimeout(() => {
												document.getElementById('appname-aka-index').value = appName;
											}, 100);
										}}
										onChange={(appName) => {
											const appUrl = apps.find(app => app.appname === appName).url;
											if (appUrl) {
												onAppSelect(appUrl);
											}
											this.setState({
												newApp: appName
											});
											onAppNameChange(appName);
											setTimeout(() => {
												document.getElementById('appname-aka-index').value = appName;
											}, 100);
										}}
										ref={this.selectRef}
										showSearch
										css={input}
										size="large"
										placeholder="Appname (aka index) goes here"
										optionLabelProp="value"
									>
										{
											apps.find(app => app.appname === newApp) ? null :
											newApp.length && <Select.Option key={newApp}>{newApp}</Select.Option>
										}
										{
											apps.map(app => <Select.Option key={app.appname}>
												<div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
													{app.appname}
													<Tag css={{ fontSize: 12 }}>{UrlParser(app.url).host}</Tag>
												</div>
											</Select.Option>)
										}
									</Select>
									<Flex justifyContent="center">
										<Button onClick={onConnect} big uppercase shadow bold css={button}>Start Browsing</Button>
									</Flex>
								</Form>
							</div>
							<div css={{ padding: 50, borderRadius: 8, border: '1px solid rgba(56,62,67,0.19)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
								<H2 css={{ fontSize: 28 }}>New to Dejavu?</H2>
								<div>
									<Button big uppercase shadow bold css={cx(button, css({ marginBottom: 25 }))}>Try a live demo</Button>
									<Text css={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}><Icon type="play-circle-o" css={{ marginRight: 7 }} />Watch Video</Text>
								</div>
							</div>
						</div>
					</Flex>
					<Flex justifyContent="center">
						<img src="/live/assets/img/down.svg" alt="Scroll Down" />
					</Flex>
				</Hero>
			</section>
		);
	}
}

Landing.propTypes = {
	apps: arrayOf(object),
	url: string,
	onUrlChange: func,
	indexUrl: string,
	fetchIndices: func,
	showFetchIndex: bool,
	onAppSelect: func,
	onConnect: func,
	onAppNameChange: func
};

export default Landing;
