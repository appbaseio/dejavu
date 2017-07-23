const React = require("react");

import { OverlayTrigger, Popover } from "react-bootstrap";

class ShareLink extends React.Component {
	state = {
		url: "",
		copied: ""
	};

	selectText = () => {
		const url = convertToUrl("gh-pages");
		this.setState({ url, copied: "" });
		setTimeout(() => {
			const ele = document.getElementById("for-share");
			const succeed = this.copyToClipboard(ele);
			if (succeed) {
				this.setState({ copied: "Link is copied to clipboard!" });
			}
		}, 500);
	};

	copyToClipboard = (elem) => {
		// create hidden text element, if it doesn't already exist
		const targetId = "_hiddenCopyText_";
		const isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
		let origSelectionStart,
			origSelectionEnd;
		if (isInput) {
			// can just use the original source element for the selection and copy
			target = elem;
			origSelectionStart = elem.selectionStart;
			origSelectionEnd = elem.selectionEnd;
		} else {
			// must use a temporary form element for the selection and copy
			target = document.getElementById(targetId);
			if (!target) {
				var target = document.createElement("textarea");
				target.style.position = "absolute";
				target.style.left = "-9999px";
				target.style.top = "0";
				target.id = targetId;
				document.body.appendChild(target);
			}
			target.textContent = elem.textContent;
		}
		// select the content
		const currentFocus = document.activeElement;
		target.focus();
		target.setSelectionRange(0, target.value.length);

		// copy the selection
		let succeed;
		try {
			succeed = document.execCommand("copy");
		} catch (e) {
			succeed = false;
		}
		// restore original focus
		if (currentFocus && typeof currentFocus.focus === "function") {
			currentFocus.focus();
		}

		if (isInput) {
			// restore prior selection
			elem.setSelectionRange(origSelectionStart, origSelectionEnd);
		} else {
			// clear temporary content
			target.textContent = "";
		}
		return succeed;
	};

	changeUrl = () => {};
	componentDidUpdate() {}

	render() {
		return (<div className={this.props.btn} >
			<OverlayTrigger
				rootClose trigger="click" onClick={this.selectText} placement="right" overlay={
					<Popover id="share_pop" className="nestedJson" >
						<div className="share_content">
							<input type="text" className="form-control" value={this.state.url} onChange={this.changeUrl} id="for-share" />
							<p className="mt-10">{this.state.copied}</p>
						</div>
					</Popover>
				  }
			>
				<a href="javascript:void(0);" className="btn btn-default" >
					<i className="fa fa-share-alt" />
				</a>
			</OverlayTrigger>
		</div>);
	}
}

module.exports = ShareLink;
