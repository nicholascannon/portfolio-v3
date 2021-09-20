import React from 'react';
import Page from '../components/Page';
import QuickLinks from '../components/QuickLinks';

import './HomePage.css';

const HomePage = props => {
	return (
		<Page pageName="HomePage">
			<div id="rect"></div>
			<div id="headers">
				<h1>Nicholas Cannon</h1>
				<p>Perth, Western Australia</p>
			</div>
			<QuickLinks />
		</Page>
	);
};

export default HomePage;
