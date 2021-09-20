import React from 'react';
import Page from '../components/Page';

import './NotFoundPage.css';

const NotFoundPage = props => {
	return (
		<Page pageName="NotFoundPage">
			<h1>
				Opps! Looks like you're lost, return <a href="/">home?</a>
			</h1>
		</Page>
	);
};

export default NotFoundPage;
