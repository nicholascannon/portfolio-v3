import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import close from '../icons/iconfinder_icon-close-round_211651.svg';
import './Modal.css';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.openModal = () => {
			this.props.onOpen && this.props.onOpen(); // call onOpen function if available
			this.setState({ open: true });
		};
		this.closeModal = () => {
			this.setState({ open: false });
		};
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.clickedOutside);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.clickedOutside);
	}
	clickedOutside = e => {
		if (this.refNode && !this.refNode.contains(e.target) && this.state.open) {
			this.closeModal();
		}
	};

	render() {
		return (
			<React.Fragment>
				<CSSTransition in={this.state.open} classNames="ModalFade" timeout={200} unmountOnExit>
					<div className="Modal" ref={node => (this.refNode = node)}>
						<div className="ModalHeader">
							<h2>{this.props.header}</h2>
							<button className="closeBtn" onClick={this.closeModal}>
								<img src={close} alt="close" />
							</button>
						</div>
						<hr />
						<div className="ModalBody">{this.props.children}</div>
					</div>
				</CSSTransition>
				<div className="ModalBtnContainer">
					<button
						className="ModalBtn"
						onClick={this.openModal}
						style={this.state.open ? { opacity: 0, pointerEvents: 'none', cursor: 'default' } : {}}>
						{this.props.btnText}
					</button>
				</div>
			</React.Fragment>
		);
	}
}
Modal.propTypes = {
	header: PropTypes.string.isRequired,
	btnText: PropTypes.string.isRequired
};

export default Modal;
