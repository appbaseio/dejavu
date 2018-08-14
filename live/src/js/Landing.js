import React, { Component } from 'react';
import { GithubButton, Navbar, H1, H2, H4, Hero, ImageCard, GridLayout, Flex, Grid, Button, Text, Section, media } from '@appbaseio/designkit';
import { Input, Form, Icon, Select, Tag, Button as AntButton } from 'antd';
import { css, cx, injectGlobal } from 'react-emotion';
import UrlParser from 'url-parser-lite';
import { bool, arrayOf, object, string, func } from 'prop-types';

import Footer from './Footer';

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

// eslint-disable-next-line
injectGlobal`
	html {
		font-size: 16px;
	}
`;

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
			<section css={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: 10, overflow: 'auto' }}>
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
				<Hero css={{ minHeight: '100vh', background: '#FBFBFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Flex flexDirection="column" alignItems="center" justifyContent="center" css={{ height: '100%' }}>
						<H1 css={{ color: colors.textPrimary, fontSize: 52, marginBottom: 60, [media('md')]: { textAlign: 'center', marginTop: 70 } }}>The missing web UI for Elasticsearch</H1>
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
						<Icon type="down" css={{ marginTop: 25, fontSize: '2rem' }} />
					</Flex>
				</Hero>
				<Section>
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Importer</H2>
						<H4>Bring data from your JSON or CSV files into Elasticsearch, set mappings with a guided process. Can import up to 100,000 records at a time.</H4>
					</div>
				</Section>
				<Section background="#FBFBFB">
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Browser</H2>
						<H4>Browse your imported data, add new fields, edit data. Create filter views, query views and export the data back as JSON or CSV.</H4>
					</div>
				</Section>
				<Section>
					<div>
						<H2 css={{ marginBottom: 15 }}>Search Sandbox</H2>
						<H4>Build the search UI/Ux visually, set filters and result parameters. Export the code to get a functional React web app.</H4>
					</div>
				</Section>
				<Section background="#FBFBFB" innerSectionProps={{ columns: '1fr', className: css({ flex: 1, fontFamily: '"Open Sans", sans-serif', h3: { fontWeight: 'bold', marginTop: 15 } }) }}>
					<div>
						<H2 center css={{ marginBottom: 15 }}>Browse Dejavu Datasets</H2>
						<H4 center>Browse the following public Dejavu datasets, you can clone them or submit your own dataset.</H4>
					</div>
					<Grid
						size={4}
						mdSize={2}
						smSize={1}
						gutter="15px"
						smGutter="0px"
					>
						<ImageCard
							title="Airbeds data set"
							description="A dataset for building an Airbnb style house aggregation search."
							big
							src="/live/assets/img/airbed.png"
							link="https://opensource.appbase.io/reactivesearch/demos/airbeds/"
						/>
						<ImageCard
							title="Hacker News data set"
							description="Hacker news data set"
							big
							src="/live/assets/img/technews.png"
							link="https://opensource.appbase.io/reactivesearch/demos/airbeds/"
						/>
						<ImageCard
							title="Movies data set"
							description="A dataset of 14,000 movies."
							big
							src="/live/assets/img/movie.png"
							link="https://opensource.appbase.io/reactivesearch/demos/airbeds/"
						/>
						<ImageCard
							title="Your data set"
							description="Submit your own data set"
							big
							src="/live/assets/img/dataset.png"
							link="https://opensource.appbase.io/reactivesearch/demos/airbeds/"
						/>
					</Grid>
					<GridLayout css={{ maxWidth: 600, margin: '0 auto' }} gridTemplateColumns="repeat(3, auto)" gridGap={40} justifyContent="center" justifyItems="center" alignItems="center">
						<img src="/live/assets/img/chromestore.png" alt="Chrome Store" width="70%" />
						<Button css={button} shadow uppercase bold>Try Live</Button>
						<img src="/live/assets/img/docker.png" alt="Docker" width="70%" />
					</GridLayout>
				</Section>
				<Footer />
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
