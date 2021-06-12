import React from 'react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import Particles from 'react-particles-js';
import particleSettings from './particleSettings';
import FontAwesome from 'react-fontawesome';
import ReactGA from 'react-ga';

import { getBlob } from './actions';

import {
	HomePage,
	AboutPage,
	SkillsPage,
	ProjectsPage,
	NotFoundPage
} from './components/pages';

import './App.css';

const routes = [
	{ path: '/', Component: <HomePage /> },
	{ path: '/about', Component: <AboutPage /> },
	// { path: '/contact', Component: <ContactPage /> },
	{ path: '/skills', Component: <SkillsPage /> },
	{ path: '/projects', Component: <ProjectsPage /> },
	// { path: '/admin', Component: <AdminPage /> }
];

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
					params={particleSettings}
				/>
				<header>
					{this.props.location.pathname !== '/' ? (
						<Link to="/" id="brand">
							NICHOLAS CANNON
						</Link>
					) : null}
					{/* <Nav /> */}
				</header>
				<Switch>
					{routes.map(({ path, Component }) => (
						<Route key={path} exact path={path}>
							{({ match }) => (
								<CSSTransition
									in={match != null}
									timeout={300}
									classNames="page"
									unmountOnExit
									appear>
									{Component}
								</CSSTransition>
							)}
						</Route>
					))}
					<Route key="notfound" component={NotFoundPage} />
				</Switch>
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

export default withRouter(connect(mapStateToProps, { getBlob })(App));
