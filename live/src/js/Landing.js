import React, { Component } from 'react';
import { GithubButton, Navbar, H1, H2, Hero, Flex, Button, Text } from '@appbaseio/designkit';
import { Input, Form, Icon } from 'antd';
import { css, cx } from 'react-emotion';

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

class Landing extends Component {
	state = {
		stars: '4,500'
	}

	componentDidMount() {
		fetch('https://api.github.com/repos/appbaseio/dejavu')
			.then(res => res.json())
			.then(json => this.setState({
				stars: `${String(json.stargazers_count).slice(0, -3)},${String(json.stargazers_count).slice(-3)}`
			}));
	}

	render() {
		const { stars } = this.state;
		return (
			<section css={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: 10 }}>
				<Navbar height="80px">
					<Navbar.Logo>
						<img src="/live/assets/img/dejavu.svg" alt="Dejavu Logo" height="45px" />
					</Navbar.Logo>
					<GithubButton target="_blank" href="https://github.com/appbaseio/dejavu" label="View Dejavu on GitHub" shadow count={stars} />
				</Navbar>
				<Hero css={{ height: '100vh', background: '#FBFBFB' }}>
					<Flex flexDirection="column" alignItems="center" justifyContent="center" css={{ height: '100%' }}>
						<H1 css={{ color: colors.textPrimary, fontSize: 52, marginBottom: 60 }}>The missing web UI for Elasticsearch</H1>
						<div css={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridGap: 20 }}>
							<div css={{ padding: 50, borderRadius: 8, background: '#BFDDF9' }}>
								<Form>
									<Input css={{ marginBottom: 30 }} size="large" placeholder="URL for cluster goes here. e.g. https://username:password@scalr.api.appbase.io" />
									<Input css={{ marginBottom: 30 }} size="large" placeholder="Appname (aka index) goes here" />
									<Flex justifyContent="center">
										<Button big uppercase shadow bold css={button}>Start Browsing</Button>
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
				</Hero>
			</section>
		);
	}
}

// Landing.propTypes = {
// 	stars: string
// };

export default Landing;
