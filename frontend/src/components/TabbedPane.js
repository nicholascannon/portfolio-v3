import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './TabbedPane.css';

class TabbedPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.links[0].id
		};
	}

	isVisible = id => this.state.visible === id;

	openTab = id => {
		this.setState({ visible: id });
	};

	render() {
		return (
			<div className="TabbedPane">
				<div className="tabs">
					{this.props.links.map(link => (
						<button
							key={link.id}
							className={`tabLink ${this.isVisible(link.id) ? 'selected' : ''}`}
							onClick={() => this.openTab(link.id)}>
							{link.name}
						</button>
					))}
				</div>
				{this.props.children.map((child, index) => (
					<div
						key={this.props.links[index].id}
						className={`tabContent ${this.isVisible(this.props.links[index].id) ? 'visible' : ''}`}
						id={this.props.links[index].id}>
						{child}
					</div>
				))}
			</div>
		);
	}
}
TabbedPane.propTypes = {
	links: PropTypes.array.isRequired
};

export default TabbedPane;
