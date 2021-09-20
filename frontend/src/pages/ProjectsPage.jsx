import React from 'react';
import Page from '../components/Page';
import { connect } from 'react-redux';

import './ProjectsPage.css';

class ProjectsPage extends React.Component {
	render() {
		const { projects } = this.props;

		return (
			<Page pageName="ProjectsPage">
				<div>
					{projects ? (
						projects.map(project => (
							<div className="projectCard">
								<div className="projectHeader">
									<h1>{project.name}</h1>
									<hr />
								</div>
								<div className="projectDetails">
									<h3>Description:</h3>
									<p>{project.body}</p>
									<br />
									<h3>Tech:</h3>
									<ul>
										{project.tech.map(tech => (
											<li>{tech}</li>
										))}
									</ul>
								</div>
								{project.githubUrl && (
									<a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
										View Code
									</a>
								)}
								{project.liveUrl && (
									<a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
										View Live Demo
									</a>
								)}
							</div>
						))
					) : (
						<h1>No Projects</h1>
					)}
				</div>
			</Page>
		);
	}
}

const mapStateToProps = state => ({
	projects: state.blob.projects
});

export default connect(mapStateToProps, {})(ProjectsPage);
