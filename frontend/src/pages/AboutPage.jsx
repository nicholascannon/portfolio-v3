import React from 'react';
import Page from '../components/Page';
import { connect } from 'react-redux';

import profileImg from '../imgs/profilePic.jpg';
import './AboutPage.css';

class AboutPage extends React.Component {
	render() {
		return (
			<Page pageName="AboutPage">
				<div>
					<div className="profileImg">
						<img src={profileImg} alt="profile" />
					</div>
					<div className="content">
						<h1>{this.props.heading}</h1>
						<h2>
							<em>{this.props.subHeading}</em>
						</h2>
						<br />
						<p dangerouslySetInnerHTML={{ __html: this.props.body }}></p>
						<br />
						<div className="aboutButtons">
							<a
								href={`${process.env.PUBLIC_URL}/docs/Nicholas-Cannon-CV.pdf`}
								target="_blank"
								rel="noopener noreferrer">
								Resume
							</a>
							<a href="mailto:nicholascannon1@gmail.com" target="_blank" rel="noopener noreferrer">
								Email Me
							</a>
						</div>
					</div>
				</div>
				<div className="rect"></div>
			</Page>
		);
	}
}
const mapStateToProps = state => ({
	heading: state.blob.about.heading,
	subHeading: state.blob.about.subHeading,
	body: state.blob.about.body
});

export default connect(mapStateToProps, {})(AboutPage);
