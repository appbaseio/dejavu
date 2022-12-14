// @flow

import React, { Component } from 'react';
import {
	GithubButton,
	Navbar,
	H1,
	H2,
	H4,
	Hero,
	ImageCard,
	GridLayout,
	Flex,
	Grid,
	Button,
	Text,
	Section,
	media,
} from '@appbaseio/designkit';
import { PlayCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Input, Form, Modal, Select, Tag, Alert } from 'antd';
import { css, cx, injectGlobal } from 'react-emotion';
import UrlParser from 'url-parser-lite';
import { CrossStorageClient } from 'cross-storage';

import Footer from './components/Footer';
import logo from './images/dejavu-logo.svg';
import dataImporter from './images/data-importer.png';
import dataBrowser from './images/data-browser.png';
import searchSandbox from './images/search-sandbox.png';
import airbed from './images/airbed.png';
import technews from './images/technews.png';
import movies from './images/movie.png';
import dataset from './images/dataset.png';
import chromestore from './images/chromestore.png';
import docker from './images/docker.png';

const LOCAL_CONNECTIONS = 'localConnections';

const colors = {
	textPrimary: '#383E43',
	textSecondary: '#30373C',
};

const button = css({
	fontSize: 16,
	color: 'white',
	background: '#0087FF',
	'&:hover, &:focus': {
		color: 'white',
		background: '#0059A8',
	},
});

const input = css({
	fontSize: 14,
	marginBottom: '30px !important',
});

const featImage = css({
	[media('md')]: {
		maxWidth: 400,
		margin: '0 auto',
	},
});

const featImageReverse = css(featImage, {
	[media('md')]: {
		order: 1,
	},
});

// eslint-disable-next-line
injectGlobal`
	html {
		font-size: 16px;
	}
`;

const imgLink = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

type State = {
	stars: string,
	showModal: boolean,
	url: string,
	appname: string,
	pastApps: any,
	error: string,
};

class App extends Component<null, State> {
	state = {
		stars: '4,500',
		showModal: false,
		url: '',
		appname: '',
		pastApps: [],
		error: '',
	};

	componentDidMount() {
		fetch('https://api.github.com/repos/appbaseio/dejavu')
			.then(res => res.json())
			.then(json =>
				this.setState({
					stars: `${String(json.stargazers_count).slice(
						0,
						-3,
					)},${String(json.stargazers_count).slice(-3)}`,
				}),
			);

		const storage = new CrossStorageClient('https://dejavu.appbase.io');

		storage
			.onConnect()
			.then(() => storage.get(LOCAL_CONNECTIONS))
			.then(res => {
				if (res) {
					const { pastApps } = JSON.parse(res);

					if (pastApps.length) {
						this.setPastApps(pastApps);
					}
				}
			});
	}

	setPastApps = (pastApps: any) => {
		this.setState({
			pastApps,
		});
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	setUrl = (url: string) => {
		this.setState({ url });
	};

	setAppName = (appname: string) => {
		this.setState({ appname });
	};

	handleConnect = () => {
		const { appname, url } = this.state;
		if (
			url.toString().startsWith('http://') &&
			window.location.protocol === 'https:'
		) {
			this.setState({
				error:
					'You are trying to load http content over https. You might have to enable mixed content for your browser <a href="https://kb.iu.edu/d/bdny#view" target="_blank">https://kb.iu.edu/d/bdny#view</a>',
			});
		}
		if (!appname || !url) {
			this.setState({
				error: 'Url or appname should not be empty.',
			});
		} else {
			window.location.href = `https://dejavu.appbase.io?appname=${appname}&url=${url}`;
		}
	};

	handleAlertClose = () => {
		this.setState({
			error: '',
		});
	};

	render() {
		const {
			stars,
			showModal,
			url,
			pastApps,
			appname: newApp,
			error,
		} = this.state;
		return (
			<section
				css={{
					height: '100%',
					width: '100%',
					background: 'white',
					position: 'absolute',
					zIndex: 10,
					overflow: 'auto',
					scrollBehavior: 'smooth',
				}}
			>
				{error && (
					<Alert
						message="Error"
						description={
							<div dangerouslySetInnerHTML={{ __html: error }} />
						}
						type="error"
						closable
						css={{
							position: 'absolute',
							zIndex: 1000,
							right: 10,
							top: 10,
							maxWidth: 300,
						}}
						onClose={this.handleAlertClose}
					/>
				)}
				<Navbar height="80px">
					<Navbar.Logo>
						<img src={logo} alt="Dejavu Logo" height="45px" />
					</Navbar.Logo>
					<div
						css={{
							'@media (max-width: 768px)': { display: 'none' },
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
				<Modal
					destroyOnClose
					open={showModal}
					onCancel={this.toggleModal}
					footer={null}
					width={610}
				>
					<div css={{ marginTop: 20 }}>
						<iframe
							title="youtube-video"
							width="560"
							height="315"
							src="https://www.youtube.com/embed/qhDuRd2pJIY?rel=0&amp;showinfo=0"
							frameBorder="0"
							allow="autoplay; encrypted-media"
							allowFullscreen
						/>
					</div>
				</Modal>
				<Hero
					css={{
						minHeight: '100vh',
						background: '#FBFBFB',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<Flex
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						css={{ height: '100%' }}
					>
						<H1
							css={{
								color: colors.textPrimary,
								fontSize: 52,
								marginBottom: 60,
								[media('md')]: {
									textAlign: 'center',
									marginTop: 70,
								},
							}}
						>
							The missing web UI for Elasticsearch
						</H1>
						<div
							css={{
								display: 'grid',
								gridTemplateColumns: '2fr 1fr',
								gridGap: 20,
								'@media (max-width: 768px)': {
									gridTemplateColumns: '1fr',
								},
							}}
						>
							<div
								css={{
									padding: 50,
									borderRadius: 8,
									background: '#BFDDF9',
								}}
							>
								<Form>
									<Flex>
										<Input
											css={input}
											size="large"
											value={url}
											onChange={e => {
												this.setUrl(e.target.value);
											}}
											placeholder="URL for cluster goes here. e.g. https://username:password@scalr.api.appbase.io"
										/>
									</Flex>
									<Select
										onSearch={appName => {
											this.setAppName(appName);
										}}
										onChange={appName => {
											const appUrl = pastApps.find(
												app => app.appname === appName,
											);
											if (appUrl) {
												this.setUrl(appUrl.url);
											}
											this.setAppName(appName);
										}}
										showSearch
										css={input}
										size="large"
										placeholder="Appname (aka index) goes here"
										optionLabelProp="value"
									>
										{pastApps.find(
											app => app.appname === newApp,
										)
											? null
											: newApp.length && (
													<Select.Option key={newApp}>
														{newApp}
													</Select.Option>
											  )}
										{pastApps.map(app => (
											<Select.Option key={app.appname}>
												<div
													css={{
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'space-between',
													}}
												>
													{app.appname}
													<Tag css={{ fontSize: 12 }}>
														{
															UrlParser(app.url)
																.host
														}
													</Tag>
												</div>
											</Select.Option>
										))}
									</Select>
									<Flex justifyContent="center">
										<Button
											onClick={this.handleConnect}
											big
											uppercase
											shadow
											bold
											css={button}
										>
											Start Browsing
										</Button>
									</Flex>
								</Form>
							</div>
							<div
								css={{
									padding: 50,
									borderRadius: 8,
									border: '1px solid rgba(56,62,67,0.19)',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<H2 css={{ fontSize: 28 }}>New to Dejavu?</H2>
								<Flex
									alignItems="center"
									justifyContent="center"
									flexDirection="column"
								>
									<Button
										big
										uppercase
										shadow
										bold
										css={cx(
											button,
											css({
												marginBottom: 25,
											}),
										)}
										href="https://dejavu.appbase.io/?appname=gitxplore-live&url=https://2FPZ2UJQW:1c50c6df-4652-4d74-906b-7bc0a6a731b6@scalr.api.appbase.io"
										target="_blank"
									>
										Try a live demo
									</Button>
									<Button
										onClick={this.toggleModal}
										transparent
									>
										<Text
											css={{
												fontSize: 14,
												textTransform: 'uppercase',
												fontWeight: 600,
												textAlign: 'center',
												cursor: 'pointer',
											}}
										>
											<PlayCircleOutlined
												css={{ marginRight: 7 }}
											/>
											Watch Video
										</Text>
									</Button>
								</Flex>
							</div>
						</div>
					</Flex>
					<a
						css={{
							position: 'absolute',
							left: '50%',
							bottom: 25,
							cursor: 'pointer',
							[media('md')]: {
								display: 'none',
							},
						}}
						href="#landing-sections"
					>
						<DownOutlined
							css={{ marginTop: 25, fontSize: '2rem' }}
						/>
					</a>
				</Hero>
				<Section id="landing-sections">
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Importer</H2>
						<H4>
							Bring data from your JSON or CSV files to
							Elasticsearch, and set data mappings with a guided
							process.
						</H4>
					</div>
					<img
						src={dataImporter}
						alt="Data Importer GIF"
						width="100%"
						css={featImage}
					/>
				</Section>
				<Section background="#FBFBFB">
					<img
						src={dataBrowser}
						alt="Data Browser GIF"
						width="100%"
						css={featImageReverse}
					/>
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Browser</H2>
						<H4>
							Browse your imported data, edit it, and add new
							fields. Create rich filtered and query views. Export
							data in JSON and CSV formats.
						</H4>
					</div>
				</Section>
				<Section>
					<div>
						<H2 css={{ marginBottom: 15 }}>Search Preview</H2>
						<H4>
							Create search UI and test search relevancy of your
							dataset with zero lines of code. Export the code to
							get a functional React web app.
						</H4>
					</div>
					<img
						src={searchSandbox}
						alt="Search sandbox"
						width="100%"
						css={featImage}
					/>
				</Section>
				<Section
					background="#FBFBFB"
					innerSectionProps={{
						columns: '1fr',
						className: css({
							flex: 1,
							fontFamily: '"Open Sans", sans-serif',
							h3: { fontWeight: 'bold', marginTop: 15 },
						}),
					}}
				>
					<div>
						<H2 center css={{ marginBottom: 15 }}>
							Browse Dejavu Datasets
						</H2>
						<H4 center>
							Browse the following public dejavu datasets,
							available in read-only formats. You can clone them
							to create your own Elasticsearch index.
						</H4>
					</div>
					<Grid
						size={4}
						mdSize={2}
						smSize={1}
						gutter="15px"
						smGutter="0px"
					>
						<ImageCard
							title="Airbeds"
							description="A ~3,000 listings dataset for building an airbeds search."
							big
							src={airbed}
							link="https://dejavu.appbase.io/?&appname=housing&url=https://0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5@scalr.api.appbase.io&mode=view"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Hacker News"
							description="A Hacker News dataset of 6,000+ posts."
							big
							src={technews}
							link="https://dejavu.appbase.io/?&appname=hackernews-live&url=https://kxBY7RnNe:4d69db99-6049-409d-89bd-e1202a2ad48e@scalr.api.appbase.io&mode=view"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Movies"
							description="A TMDB derived dataset of 13,000 popular movies."
							big
							src={movies}
							link="https://dejavu.appbase.io/?appname=MovieAppFinal&url=https%3A%2F%2FRxIAbH9Jc%3A6d3a5016-5e9d-448f-bd2b-63c80b401484%40scalr.api.appbase.io&mode=view"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Add your dataset"
							description="Submit your own dataset to our public gallery."
							big
							src={dataset}
							link="https://github.com/appbaseio/dejavu/issues/new?template=dataset.md"
							linkText="SUBMIT"
						/>
					</Grid>
					<GridLayout
						css={{ maxWidth: 600, margin: '0 auto' }}
						gridTemplateColumns="repeat(3, auto)"
						gridGap={40}
						justifyContent="center"
						justifyItems="center"
						alignItems="center"
					>
						<a
							css={imgLink}
							href="https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={chromestore}
								alt="Chrome Store"
								width="70%"
							/>
						</a>
						<Button
							css={button}
							shadow
							uppercase
							bold
							href="https://dejavu.appbase.io/?appname=gitxplore-live&url=https://2FPZ2UJQW:1c50c6df-4652-4d74-906b-7bc0a6a731b6@scalr.api.appbase.io"
						>
							Try Live
						</Button>
						<a
							css={imgLink}
							href="https://hub.docker.com/r/appbaseio/dejavu/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img src={docker} alt="Docker" width="70%" />
						</a>
					</GridLayout>
				</Section>
				<Footer />
			</section>
		);
	}
}

export default App;
