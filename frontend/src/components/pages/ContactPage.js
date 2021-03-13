/**
 * ContactPage.js
 */
import React from 'react';
import Page from './Page';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import { sendContact } from '../../actions/contactActions';
import { CONTACT_SENT } from '../../actions/types';

import './ContactPage.css';

class ContactPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			msg: '',
			email: '',
			err: ''
		};
		this.onChange = e => {
			this.setState({ [e.target.name]: e.target.value });
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.err !== this.props.err) {
			if (this.props.err.id === CONTACT_SENT) {
				this.setState({ err: this.props.err.msg });
			} else {
				this.setState({ err: '' });
			}
		}
	}

	onSubmit = e => {
		e.preventDefault();
		const { name, email, msg } = this.state;

		this.props.sendContact(name, email, msg);

		this.setState({
			email: '',
			name: '',
			msg: '',
			err: ''
		});
	};

	render() {
		return (
			<Page pageName="ContactPage">
				{this.props.sent || this.props.sending ? (
					<CSSTransition in={this.props.sent} timeout={200} classNames="contactFade" appear>
						{this.props.sent ? <h1>Your message has sent!</h1> : <h1>Sending</h1>}
					</CSSTransition>
				) : (
					<div className="contactBox">
						<form method="POST" onSubmit={this.onSubmit}>
							<h1>Contact Me</h1>
							<label for="name">Name</label>
							<input
								type="text"
								name="name"
								id="name"
								value={this.state.name}
								onChange={this.onChange}
								placeholder="Name"
								required
							/>
							<label for="name">Email</label>
							<input
								type="email"
								name="email"
								id="email"
								value={this.state.email}
								onChange={this.onChange}
								placeholder="Email"
								required
							/>
							<label for="msg">Message</label>
							<textarea
								name="msg"
								id="msg"
								rows="10"
								value={this.state.msg}
								onChange={this.onChange}
								placeholder="Your message..."
								required></textarea>
							<button type="submit">SEND</button>
							{this.state.err ? <span className="formError">{this.state.err}</span> : null}
						</form>
					</div>
				)}
			</Page>
		);
	}
}

const mapStateToProps = state => ({
	sent: state.contact.sent,
	sending: state.contact.sending,
	err: state.error
});

export default connect(
	mapStateToProps,
	{ sendContact }
)(ContactPage);
