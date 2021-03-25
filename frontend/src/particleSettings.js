/**
 * Particle.js settings
 */
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	particles: {
		color: {
			value: '#005cb9'
		},
		line_linked: {
			color: '#005cb9'
		},
		number: {
			value: 10,
			density: {
				enabled: false
			}
		},
		size: {
			value: 50,
			random: true
		},
		opacity: {
			value: 0.7,
			anim: {
				enable: false
			},
			random: true
		},
		move: {
			direction: 'right',
			out_mode: 'out',
			random: true,
			bounce: false
		}
	}
};
