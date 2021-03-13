import React, { Component } from 'react';
import { connect } from 'react-redux';

import { saveAbout } from '../../../actions/adminActions';
import { SAVE_ABOUT } from '../../../actions/types';

class AdminAboutSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			aboutHeading: '',
			aboutSubHeading: '',
			aboutBody: '',
			err: '',
			msg: ''
		};
	}

	componentDidMount() {
		this.setState({
			aboutHeading: this.props.about.heading,
			aboutSubHeading: this.props.about.subHeading,
			aboutBody: this.props.about.body
		});
	}
	componentDidUpdate(prevProps) {
		// update local state with redux state
		if (prevProps.err !== this.props.err) {
			if (this.props.err.id === SAVE_ABOUT) {
				this.setState({ err: this.props.err.msg });
			} else {
				this.setState({ err: '' });
			}
		}
		// Update the content in the form
		if (prevProps.about !== this.props.about) {
			this.setState({
				aboutHeading: this.props.about.heading,
				aboutSubHeading: this.props.about.subHeading,
				aboutBody: this.props.about.body,
				msg: this.props.about.msg
			});
		}
	}

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	onSubmit = e => {
		e.preventDefault();
		this.props.saveAbout(this.state.aboutHeading, this.state.aboutSubHeading, this.state.aboutBody);
		this.setState({ msg: '' });
	};

	render() {
		return (
			<React.Fragment>
				<form method="POST" onSubmit={this.onSubmit}>
					<label htmlFor="aboutHeading">Heading:</label>
					<input
						onChange={this.onChange}
						value={this.state.aboutHeading}
						type="text"
						name="aboutHeading"
						id="aboutHeading"
					/>
					<label htmlFor="aboutSubHeading">Sub-Heading:</label>
					<input
						onChange={this.onChange}
						value={this.state.aboutSubHeading}
						type="text"
						name="aboutSubHeading"
						id="aboutSubHeading"
					/>
					<label htmlFor="aboutBody">Body:</label>
					<textarea
						onChange={this.onChange}
						value={this.state.aboutBody}
						name="aboutBody"
						id="aboutBody"
						cols="30"
						rows="10"></textarea>
					<button type="submit">Update</button>
				</form>
				{this.state.err ? <span className="formError">{this.state.err}</span> : null}
				{this.state.msg ? <span className="formSuccess">{this.state.msg}</span> : null}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	about: state.admin.about,
	err: state.error
});

export default connect(
	mapStateToProps,
	{ saveAbout }
)(AdminAboutSection);
