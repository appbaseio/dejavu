const React = require("react");
const AppSelect = require("../AppSelect.js");
const ShareLink = require("../features/ShareLink.js");

export const ComposeQuery = props => (
	<a target="_blank" href="https://appbaseio.github.io/mirage/" className="mirage_link btn btn-default">
		Query View <i className="fa fa-external-link-square" />
	</a>
);

export const InitialForm = props => (
	<form className={props.EsForm} id="init-ES">
		<div className="vertical0">
			<div className="vertical1">
				<div className="esContainer">
					<div className="img-container">
						<img src="assets/img/icon.png" />
					</div>
					<div>
						<h1>Déjà vu</h1>
						<h4 className="dejavu-bottomline">The Missing Web UI for Elasticsearch</h4>
						{props.index_create_text}
					</div>
					<ShareLink btn={props.shareBtn} />
					{props.composeQuery}
					<div className="splashIn">
						<div className="form-group m-0 col-xs-4 pd-0 pr-5">
							<AppSelect {...props.appSelect} />
						</div>
						<div className="col-xs-8 m-0 pd-0 pr-5 form-group">
							<div className="url-container">
								<input
									type="text" className="form-control" name="url" placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
									value={props.url}
									onChange={props.valChange} {...props.opts}
								/>
								<span className={props.hideUrl} style={props.hideEye}>
									<a
										className="btn btn-default"
										onClick={props.hideUrlChange}
									>
										{props.hideUrlText}
									</a>
								</span>
							</div>
						</div>
					</div>
					<div className="submit-btn-container">
						<a className={props.esBtn} onClick={props.connectPlayPause}>
							<i className={props.playClass} />
							<i className={props.pauseClass} />
							{props.esText}
						</a>
						{
							props.splash ? (
								<a className="btn btn-default m-l10" href="../importer/index.html">
									Import JSON or CSV files
								</a>
							) : null
						}
					</div>
				</div>
			</div>
		</div>
	</form>
);

export const FooterCombine = props => (
	<footer className="text-center">
		<a href="http://appbaseio.github.io/dejavu">Watch Video</a>
		<span className="text-right pull-right powered_by">
			Create your <strong>Elasticsearch</strong> in cloud with&nbsp;<a href="http://appbase.io">appbase.io</a>
		</span>
		<span className="pull-left github-star">
			{props.githubStar}
		</span>
	</footer>
);
