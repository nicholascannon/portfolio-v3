import React from 'react';
import PropTypes from 'prop-types';

import './Page.css';

class Page extends React.Component {
	render() {
		return (
			<React.Fragment>
				<section className={`Page ${this.props.pageName ? this.props.pageName : ''}`}>
					{this.props.children}
				</section>
			</React.Fragment>
		);
	}
}
Page.propTypes = {
	pageName: PropTypes.string.isRequired
};

export default Page;
