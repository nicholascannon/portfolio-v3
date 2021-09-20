import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Particles from 'react-particles-js';
import { settings } from './particleSettings';
import FontAwesome from 'react-fontawesome';
import ReactGA from 'react-ga';
import { getBlob } from './actions';
import { HomePage, AboutPage, SkillsPage, ProjectsPage, NotFoundPage } from './components/pages';

import './App.css';

const App = () => {
	const dispatch = useDispatch();
	const shouldDisplayNotFound = window.location.pathname !== '/';

	const windowResize = () => {
		if (window.innerWidth < 576) {
			document.getElementById('App').className = 'mobile';
		} else if (window.innerWidth < 768) {
			document.getElementById('App').className = 'tablet';
		} else {
			document.getElementById('App').className = '';
		}
	};

	useEffect(() => {
		ReactGA.pageview(window.location.pathname);
		window.addEventListener('resize', windowResize);

		dispatch(getBlob());
		windowResize();

		return () => {
			window.removeEventListener('resize', windowResize);
		};
	}, [dispatch]);

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

			{shouldDisplayNotFound ? (
				<NotFoundPage />
			) : (
				<>
					<HomePage />
					<AboutPage />
					<ProjectsPage />
					<SkillsPage />
				</>
			)}

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
};

export default App;
