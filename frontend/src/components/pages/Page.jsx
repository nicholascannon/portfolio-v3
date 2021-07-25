/**
 * Page.js
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QuickLinks from '../QuickLinks';

import './Page.css';

class Page extends React.Component {
	render() {
		return (
			<React.Fragment>
				{this.props.pageName !== 'HomePage' && <QuickLinks />}
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

const mapStateToProps = state => ({
	navOpen: state.nav.isOpen
});

export default connect(mapStateToProps, {})(Page);
