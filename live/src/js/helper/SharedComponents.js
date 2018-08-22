var React = require('react');
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CustomHeadersForm from '../features/CustomHeadersForm';
var AppSelect = require('../AppSelect.js');
var ShareLink = require('../features/ShareLink.js');
import { Modal } from 'antd';

import Landing from '../Landing';

export const ComposeQuery = (props) => (
	<a target="_blank" href="https://appbaseio.github.io/mirage/" className="mirage_link btn btn-default">
		Query View <i className="fa fa-external-link-square"></i>
	</a>
);

export class InitialForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			scheme: 'http://'
		};
	}

	componentDidMount() {
		if (window.location.hostname.includes("dashboard") ||
			window.document.referrer.includes("dashboard")) {
			this.setState({
				scheme: 'https://'
			});
		}
	}

	toggleShow = () => {
		const { show } = this.state;
		this.setState({
			show: !show
		});
	}

	render() {
		const props = this.props;
		const importerURL = this.state.scheme + "importer.appbase.io";
		return (
			<div>
			{
				this.props.splash &&
				<Landing
					indexUrl={props.indexUrl}
					fetchIndices={props.fetchIndices}
					url={props.url}
					apps={props.appSelect.apps}
					onUrlChange={props.valChange}
					showFetchIndex={props.showFetchIndex}
					onAppNameChange={props.appSelect.appnameCb}
					onAppSelect={props.appSelect.setConfig}
					onConnect={props.connectPlayPause}
				/>
			}
			<form className={props.EsForm} id="init-ES">
			<div className="vertical0">
				<div className="vertical1">
					<div className="esContainer">
						<div className="img-container">
							<img src="live/assets/img/Dejavu_Icon.svg" />
						</div>
						<div>
						  <h1>Déjà vu</h1>
						  <h4 className="dejavu-bottomline">The Missing Web UI for Elasticsearch</h4>
						  {props.index_create_text}
						</div>
						<ShareLink btn={props.shareBtn}> </ShareLink>
						{props.composeQuery}
						<div className="splashIn">
							<div className="col-xs-7 m-0 pd-0 pr-5 form-group">
								<div className="url-container">
									<div className="flex">
									<input id="gg-url" type="text" className="form-control" name="url" placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
										value={props.url}
										onBlur={() => props.fetchIndices(props.indexUrl)}
										onChange={props.valChange}  {...props.opts} />
										{
											!props.connect && props.showFetchIndex
											&& (
												<span className="flex flex-align-center fetch-indices-container">
													<a className="btn btn-default m-l10" onClick={() => props.fetchIndices(props.indexUrl)}>
														<i className="fa fa-list"></i>
														&nbsp;&nbsp;Fetch Indices
													</a>
												</span>
											)
										}
									</div>
									<span className={props.hideUrl} style={props.hideEye}>
										<a className="btn btn-default"
											onClick={props.hideUrlChange}>
											{props.hideUrlText}
										</a>
										<a onClick={this.toggleShow} className="btn btn-default btn-header">Headers</a>
									</span>
								</div>
							</div>
							<div className="form-group m-0 col-xs-5 pd-0 pr-5 flex flex-align-center">
								<AppSelect {...props.appSelect} />
							</div>
						</div>
						{
							this.state.show
							&& <CustomHeadersForm toggleShow={this.toggleShow} />
						}
						<div className="submit-btn-container">
							<a className={props.esBtn} onClick={props.connectPlayPause}>
								<i className={props.playClass}></i>
								<i className={props.pauseClass}></i>
								{props.esText}
							</a>
							{
								props.splash ? (
									<a className="btn btn-default m-l10" href={importerURL}>
										Import JSON or CSV files
									</a>
								) : null
							}
						</div>
					</div>
				</div>
			</div>
			</form>
			</div>
		);
	}
}

class FooterCombine extends React.Component {
	state = {
		showModal: false,
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	}

	render() {
		const { showModal } = this.state;
		return (
			<footer className="text-center">
				<Modal destroyOnClose visible={showModal} onCancel={this.toggleModal} footer={null} width={610}>
					<div css={{ marginTop: 20 }}>
						<iframe width="560" height="315" src="https://www.youtube.com/embed/qhDuRd2pJIY?rel=0&amp;showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullscreen />
					</div>
				</Modal>
				<a onClick={this.toggleModal}>Watch Video</a>
				<span className="text-right pull-right powered_by">
					Create your <strong>Elasticsearch</strong> in cloud with&nbsp;<a href="http://appbase.io">appbase.io</a>
				</span>
				<span className="pull-left github-star">
					{this.props.githubStar}
				</span>
			</footer>
		);
	}
}

export { FooterCombine };
