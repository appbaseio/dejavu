import React from 'react';
import { Icon } from 'antd';
import { css } from 'emotion';

const headingStyles = css`
	display: flex;
	align-items: baseline;
`;

const containerStyles = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 10px auto 10px;
	padding: 15px 20px;
	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

const Container = props => (
	<div className={containerStyles}>
		<div>
			<div className={headingStyles}>
				<Icon type={props.icon} />
				<div css={{ padding: '0 10px' }}>
					<h3 css={{ margin: 0 }}>{props.title}</h3>
					<p
						className="ant-form-extra"
						css={{
							margin: 0,
							fontWeight: 400,
							wordBreak: 'break-word',
						}}
					>
						{props.description}
					</p>
				</div>
			</div>
		</div>
		{props.button}
	</div>
);

export default Container;
