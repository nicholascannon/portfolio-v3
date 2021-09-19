import React from 'react';

import './QuickLinks.css';

export default function QuickLinks() {
	return (
		<div className="quickLinks">
			<div>
				<a to="/about">ABOUT</a>
				<a to="/projects">PROJECTS</a>
				<a to="/skills">SKILLS</a>
			</div>
		</div>
	);
}
