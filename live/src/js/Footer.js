import React from 'react';
import {
	Footer,
	Flex,
	GridLayout as Grid,
	Title,
	media
} from '@appbaseio/designkit';
import { css } from 'react-emotion';

const footer = css`
	display: flex;
	width: 100%;
	justify-content: space-around;
	${media('lg')} {
		flex-direction: column;
	}
`;

const listStyles = css`
	ul h4 {
		color: #fff;
		opacity: 0.5;
		margin-bottom: 10px;
	}
	li a {
		color: #fff;
		transition: all 0.3s ease-in-out;
	}
	${media('lg')} {
		width: 100%;
	}
`;

const brand = css`
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	${media('lg')} {
		grid-template-columns: 1fr;
		justify-items: center;
	}
	img {
		max-width: 250px;
	}
`;

const link = css`
	color: #fff;
	transition: 0.3s ease-in-out;
	font-size: 0.9rem;
	font-weight: 600;
	text-decoration: none;
	border-bottom: 1px solid #fff;
	&:hover {
		color: #eee;
		border-color: #eee;
	}
`;

const AppFooter = () => (
	<Footer className={css({ background: '#013563' })}>
		<Flex
			flexDirection="column"
			alignItems="center"
			className={css({ width: '100%' })}
		>
			<div className={footer}>
				<Footer.Links className={listStyles}>
					<Footer.List>
						<Title>Products</Title>
						<li>
							<a href="https://appbase.io">Appbase.io</a>
						</li>
						<li>
							<a href="https://opensource.appbase.io/reactivemaps">
								Reactive Maps
							</a>
						</li>
						<li>
							<a href="https://opensource.appbase.io/reactivesearch">
								Reactive Search
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>Docs</Title>
						<li>
							<a href="https://docs.appbase.io">JS Quick Start</a>
						</li>
						<li>
							<a href="https://docs.appbase.io">
								JS API Reference
							</a>
						</li>
						<li>
							<a href="https://rest.appbase.io">
								REST Quick Start
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>Use Cases</Title>
						<li>
							<a href="https://appbase.io/usecases/geo-apps">
								Geolocation Queries
							</a>
						</li>
						<li>
							<a href="https://appbase.io/usecases/why-appbase">
								Personalized Feeds
							</a>
						</li>
						<li>
							<a href="https://appbase.io/usecases/realtime-search">
								Realtime Search
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>Company</Title>
						<li>
							<a href="https://status.appbase.io">Status Page</a>
						</li>
						<li>
							<a href="https://appbase.io/tos">Terms</a>
						</li>
						<li>
							<a href="https://appbase.io/privacy">Privacy</a>
						</li>
					</Footer.List>
				</Footer.Links>
				<Footer.Brand className={css({ width: 'auto' })}>
					<div className={brand}>
						<img
							width="100%"
							src="live/assets/img/jellyfish.svg"
							alt="appbase.io"
						/>
						<Grid gridGap="12px">
							<Grid
								gridTemplateColumns="auto"
								gridAutoFlow="column"
								gridGap="12px"
							>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://github.com/appbaseio/"
								>
									<img
										src="live/assets/img/github.svg"
										alt="GitHub"
									/>
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://twitter.com/appbaseio/"
								>
									<img
										src="live/assets/img/twitter.svg"
										alt="Twitter"
									/>
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://medium.appbase.io"
								>
									<img
										src="live/assets/img/medium.svg"
										alt="Medium"
									/>
								</a>
							</Grid>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="mailto:info@appbase.io"
								className={link}
							>
								info@appbase.io
							</a>
						</Grid>
					</div>
				</Footer.Brand>
			</div>
		</Flex>
	</Footer>
);

export default AppFooter;
