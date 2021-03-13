import React from 'react';
import { NavLink as Link } from 'react-router-dom';

import './QuickLinks.css';

export default function QuickLinks() {
	return (
		<div className="quickLinks">
			<div>
				<Link to="/about" activeStyle={{ color: '#005cb9' }}>
					ABOUT
				</Link>
				<Link to="/projects" activeStyle={{ color: '#005cb9' }}>
					PROJECTS
				</Link>
				<Link to="/skills" activeStyle={{ color: '#005cb9' }}>
					SKILLS
				</Link>
				<Link to="/contact" activeStyle={{ color: '#005cb9' }}>
					CONTACT
				</Link>
			</div>
		</div>
	);
}
