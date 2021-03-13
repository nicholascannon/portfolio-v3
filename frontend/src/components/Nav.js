/**
 * Nav.js
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toggleNav, closeNav } from '../actions/navActions';
import { CSSTransition } from 'react-transition-group';

import { logout } from '../actions/authActions';

import './Nav.css';
import menu from '../icons/icons8-menu-filled.svg';
import close from '../icons/iconfinder_icon-close-round_211651.svg';

class Nav extends Component {
	componentDidMount() {
		document.addEventListener('mousedown', this.clickedOutside);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.clickedOutside);
	}
	clickedOutside = e => {
		if (this.refNode && !this.refNode.contains(e.target) && this.props.nav.isOpen) {
			this.props.closeNav();
		}
	};

	render() {
		return (
			<nav className={`Nav${this.props.nav.isOpen ? 'Open' : ''}`}>
				<CSSTransition in={this.props.nav.isOpen} classNames="navTrans" timeout={500} unmountOnExit>
					<div className="NavBox" ref={node => (this.refNode = node)}>
						<button onClick={this.props.toggleNav}>
							<img className="navIcon" src={close} alt="close" />
						</button>
						<ul>
							{this.props.isAuthenticated ? (
								<React.Fragment>
									<li>
										<NavLink to="/admin" onClick={() => this.props.closeNav()}>
											Admin
										</NavLink>
									</li>
									<li>
										<NavLink
											to="/"
											onClick={() => {
												this.props.closeNav();
												this.props.logout();
											}}>
											Logout
										</NavLink>
									</li>
								</React.Fragment>
							) : (
								<React.Fragment>
									<li>
										<NavLink
											to="/admin"
											onClick={() => {
												this.props.closeNav();
											}}>
											Login
										</NavLink>
									</li>
								</React.Fragment>
							)}
						</ul>
					</div>
				</CSSTransition>
				<button onClick={this.props.toggleNav}>
					<img className="navIcon" src={menu} alt="menu" />
				</button>
			</nav>
		);
	}
}

const mapStateToProps = state => ({
	nav: state.nav,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { toggleNav, closeNav, logout })(Nav);
