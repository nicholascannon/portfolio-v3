import React from 'react';
import Page from './Page';
import skills from '../../imgs/skills';

import './SkillsPage.css';

const SkillsPage = props => {
	return (
		<Page pageName="SkillsPage">
			<div className="skillsTable">
				{skills.map(skill => (
					<div key={skill.name}>
						<img src={skill.src} alt={skill.name} />
						<p>{skill.name}</p>
					</div>
				))}
			</div>
			<div className="rect"></div>
			{/* <Modal header="More skills" btnText="MORE SKILLS">
				<div>
					<h3>Languages</h3>
					<ul>
						<li>
							Python <i>(advanced)</i>
						</li>
						<li>
							JavaScript &amp; Node.JS <i>(advanced)</i>
						</li>
						<li>Golang (novice)</li>
						<li>C &amp; C++</li>
						<li>HTML &amp; CSS</li>
						<li>Java</li>
					</ul>
				</div>
				<div>
					<h3>Databases</h3>
					<ul>
						<li>SQL</li>
						<li>Postgres</li>
						<li>MySQL</li>
						<li>MongoDB</li>
						<li>SQLite</li>
					</ul>
				</div>
				<div>
					<h3>Frameworks &amp; Libraries</h3>
					<ul>
						<li>Django &amp; Django-REST-Framework</li>
						<li>Flask</li>
						<li>ExpressJS</li>
						<li>React &amp; Redux</li>
						<li>Numpy, Pandas</li>
						<li>Scikit-learn </li>
						<li>Tensorflow &amp; Keras</li>
						<li>SQLAlchemy</li>
						<li>
							<em>And more!</em>
						</li>
					</ul>
				</div>
				<div>
					<h3>Cloud / Ops</h3>
					<ul>
						<li>Google Cloud Platform</li>
						<li>Digital Ocean</li>
						<li>BitBucket</li>
						<li>Git</li>
						<li>TravisCI</li>
						<li>Docker &amp; Docker Compose</li>
					</ul>
				</div>
				<div>
					<h3>Misc</h3>
					<ul>
						<li>Test driven development</li>
						<li>Agile development</li>
						<li>NGINX</li>
						<li>Asynchronous programming</li>
					</ul>
				</div>
			</Modal> */}
		</Page>
	);
};

export default SkillsPage;
