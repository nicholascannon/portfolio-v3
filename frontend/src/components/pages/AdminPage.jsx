import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../../actions/authActions';
import { LOGIN_FAIL } from '../../actions/types';

import Page from './Page';
import TabbedPane from '../TabbedPane';
import AdminAboutSection from './adminSections/AdminAboutSection';
import AdminProjectsSection from './adminSections/AdminProjectsSection';

import './AdminPage.css';

class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			err: ''
		};
	}

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	onSubmit = e => {
		e.preventDefault();
		if (this.state.email.trim() === '' || this.state.password.trim() === '') {
			this.setState({ err: 'Please provide email and password' });
		} else {
			this.props.login(this.state.email, this.state.password);
		}
	};

	componentDidUpdate(prevProps) {
		// Update local error
		if (this.props.err !== prevProps.err) {
			if (this.props.err.id === LOGIN_FAIL) {
				this.setState({ err: this.props.err.msg });
			} else {
				this.setState({ err: '' });
			}
		}
	}

	render() {
		return (
			<Page pageName={`AdminPage${this.props.isAuthenticated ? '' : 'Login'}`}>
				{this.props.isAuthenticated ? (
					<div className="adminBox">
						<TabbedPane links={[{ id: 1, name: 'ABOUT' }, { id: 2, name: 'PROJECTS' }]}>
							<AdminAboutSection />
							<AdminProjectsSection />
						</TabbedPane>
					</div>
				) : (
					<div className="loginBox">
						<h1>Login</h1>
						<form method="POST" onSubmit={this.onSubmit}>
							<label htmlFor="email">Email: </label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="Email"
								required
								onChange={this.onChange}
								value={this.state.value}
							/>
							<label htmlFor="password">Password:</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								required
								onChange={this.onChange}
								value={this.state.password}
							/>
							<button type="submit">LOGIN</button>
						</form>
						{this.state.err ? <span className="formError">{this.state.err}</span> : null}
					</div>
				)}
			</Page>
		);
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	err: state.error
});

export default connect(
	mapStateToProps,
	{ login }
)(AdminPage);
