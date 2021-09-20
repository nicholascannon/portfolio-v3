import React from 'react';
import { connect } from 'react-redux';
import Particles from 'react-particles-js';
import { settings } from './particleSettings';
import FontAwesome from 'react-fontawesome';
import ReactGA from 'react-ga';
import { getBlob } from './actions';
import { HomePage, AboutPage, SkillsPage, ProjectsPage, NotFoundPage } from './components/pages';

import './App.css';

class App extends React.Component {
	componentDidMount() {
		this.props.getBlob();
		ReactGA.pageview(window.location.pathname);
	}

	componentWillMount() {
		window.addEventListener('resize', this.windowResize);
		this.windowResize();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResize);
	}

	windowResize = () => {
		if (window.innerWidth < 576) {
			document.getElementById('App').className = 'mobile';
		} else if (window.innerWidth < 768) {
			document.getElementById('App').className = 'tablet';
		} else {
			document.getElementById('App').className = '';
		}
	};

	render() {
		return (
			<React.Fragment>
				<Particles
					style={{ position: 'fixed', top: '0', right: '0', zIndex: '-1' }}
					params={settings}
				/>
				{/* <header>
					{this.props.location.pathname !== '/' ? (
						<Link to="/" id="brand">
							NICHOLAS CANNON
						</Link>
					) : null}
				</header> */}

				<HomePage />
				<AboutPage />
				<ProjectsPage />
				<SkillsPage />

				<div className="social-links">
					<p>Nicholas Cannon &copy;2020</p>
					<div>
						<a
							href="https://www.linkedin.com/in/niccannon1"
							target="_blank"
							rel="noopener noreferrer">
							<FontAwesome name="linkedin" size="2x" />
						</a>
						<a href="https://github.com/nicholascannon1" target="_blank" rel="noopener noreferrer">
							<FontAwesome name="github" size="2x" />
						</a>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { getBlob })(App);
