import React from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = state => ({
	navOpen: state.nav.isOpen
});

export default connect(mapStateToProps, {})(Page);
