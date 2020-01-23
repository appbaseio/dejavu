import React from 'react';
import {
	Footer,
	Flex,
	GridLayout as Grid,
	Title,
	media,
} from '@appbaseio/designkit';
import { css } from 'react-emotion';

import jellyfish from '../images/jellyfish.svg';
import github from '../images/github.svg';
import twitter from '../images/twitter.svg';
import medium from '../images/medium.svg';

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
						<Title>Get Dejavu as</Title>
						<li>
							<a href="https://opensource.appbase.io/dejavu">
								Hosted Web App
							</a>
						</li>
						<li>
							<a href="https://hub.docker.com/r/appbaseio/dejavu/">
								Docker Image
							</a>
						</li>
						<li>
							<a href="https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh">
								Chrome Extension
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>Companion Tools</Title>
						<li>
							<a
								href="https://appbase.io"
								target="_blank"
								rel="noopener noreferrer"
							>
								Hosted Search
							</a>
						</li>
						<li>
							<a
								href="https://opensource.appbase.io/mirage"
								target="_blank"
								rel="noopener noreferrer"
							>
								Query Builder
							</a>
						</li>
						<li>
							<a
								href="https://opensource.appbase.io/reactivesearch"
								target="_blank"
								rel="noopener noreferrer"
							>
								UI Components
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>Community</Title>
						<li>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://github.com/appbaseio/dejavu/"
							>
								GitHub
							</a>
						</li>
						<li>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://gitter.im/appbaseio/dejavu/issues"
							>
								Issues
							</a>
						</li>
						<li>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://twitter.com/appbaseio"
							>
								Twitter
							</a>
						</li>
					</Footer.List>
					<Footer.List>
						<Title>More</Title>
						<li>
							<a
								href="https://medium.appbase.io/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Medium Publication
							</a>
						</li>
						<li>
							<a
								href="http://docs.appbase.io/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Appbase.io Docs
							</a>
						</li>
						<li>
							<a
								href="mailto:support@appbase.io"
								target="_blank"
								rel="noopener noreferrer"
							>
								Get Support
							</a>
						</li>
					</Footer.List>
				</Footer.Links>
				<Footer.Brand className={css({ width: 'auto' })}>
					<div className={brand}>
						<img width="100%" src={jellyfish} alt="appbase.io" />
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
									<img src={github} alt="GitHub" />
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://twitter.com/appbaseio/"
								>
									<img src={twitter} alt="Twitter" />
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://medium.appbase.io"
								>
									<img src={medium} alt="Medium" />
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
