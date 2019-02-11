import React from 'react';
import { Collapse, Icon, Button, Tooltip, Alert } from 'antd';

import { PromotedResultsContext } from './PromotedResultsContainer';
import UnHideButton from '../DataTable/UnHideButton';
import Container from './Container';

const { Panel } = Collapse;

const customPanelStyle = {
	background: '#fff1f0',
	borderRadius: 0,
	border: 0,
	overflow: 'hidden',
};

class HiddenResults extends React.Component {
	render() {
		const { hiddenResults } = this.context;
		const filteredResults = hiddenResults.map(item => item.doc_id);

		return (
			<React.Fragment>
				<div
					css={{
						boxShadow: '0 1px 10px -2px rgba(0,0,0,0.2)',
						borderLeft: '4px solid #f5222d',
						marginBottom: 20,
					}}
				>
					<Container
						icon="eye-invisible"
						title="Hidden Results"
						description={
							<React.Fragment>
								Hidden results are not returned by the API when
								the query matches the current query conditions.
								Read more{' '}
								<a href="#" target="_blank">
									here
								</a>
								.
							</React.Fragment>
						}
					/>
					{filteredResults.length > 0 ? (
						<Collapse
							bordered={false}
							expandIcon={({ isActive }) => (
								<Icon
									type="caret-right"
									rotate={isActive ? 90 : 0}
								/>
							)}
						>
							<Panel
								header={`${
									filteredResults.length
								} Hidden Results`}
								key="1"
								style={customPanelStyle}
							>
								{filteredResults.map(item => (
									<UnHideButton
										id={item}
										key={item}
										renderButton={({
											unHideItem,
											isLoading,
										}) => (
											<Tooltip
												placement="top"
												title="Remove this item"
											>
												<Button
													css={{
														marginRight: 10,
													}}
													type="danger"
													loading={isLoading}
													onClick={unHideItem}
												>
													{item}
												</Button>
											</Tooltip>
										)}
									/>
								))}
							</Panel>
						</Collapse>
					) : (
						<Alert
							css={{
								border: 0,
								borderRadius: 0,
							}}
							type="error"
							message="No Hidden Results"
						/>
					)}
				</div>
			</React.Fragment>
		);
	}
}

HiddenResults.contextType = PromotedResultsContext;

export default HiddenResults;
