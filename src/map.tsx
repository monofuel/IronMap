import * as React from 'react';
import * as _ from 'lodash';

import getip, { Coordinate } from './geoip';
import { Animation, PingAnimation, Vector } from './animations';

export interface IronMapProps { }
interface IronMapState { }

const mapUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/Mercator_Projection.svg';
const mapHeight = 1221;
const mapWidth = 1652;
const backgroundColor = '#1f4456';

const pingColor = '#ff0000';

export default class IronMap extends React.Component<IronMapProps, IronMapState> {

	worldMap: HTMLImageElement;
	canvas: HTMLCanvasElement;
	animations: Animation[] = [];

	state: IronMapState = {}

	constructor(props: IronMapProps) {
		super(props)
	}

	componentDidMount() {
		
		this.worldMap = new Image();
		this.worldMap.src = mapUrl;
		// kick off update loop once the map is loaded
		this.worldMap.onload = () => {
			console.log('map loaded');
			window.requestAnimationFrame(() => this.update());
		}
	}

	render() {
		// width and height are sized for the svg
		return <canvas ref={ref => this.canvas = ref} width={mapWidth} height={mapHeight}/>;
	}

	update() {
		try {
			const ctx = this.canvas.getContext('2d');

			// fill in background
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0,0,mapWidth, mapHeight);

			// draw world map
			ctx.drawImage(this.worldMap, 0, 0);
		
			// advance all animations one frame
			for (const animation of this.animations) {
				animation.update();
			}

			// draw animations over world
			for (const animation of this.animations) {
				animation.draw(ctx);
			}

			/*
			if (this.animations.length === 0) {
				// test animation
				getip('45.56.92.248') // SF
					.then((location: Coordinate) => {
						this.ping(location);
					});
				getip('141.218.1.75') // michigan
					.then((location: Coordinate) => {
						this.ping(location);
					});
					

				// reykjavik
				this.ping({ long: -21.862675, lat: 64.135666 });
			}
			*/

			// remove finished animations
			this.animations = _.filter(this.animations, (a: Animation): boolean => !a.isComplete());

		} finally {
			window.requestAnimationFrame(() => this.update());
		}
	}

	ping(coord: Coordinate, color?: string) {
		if (coord.long < -180 || coord.long > 180) {
			throw new Error('expected longitude between -180 and 180');
		}
		if (coord.lat < -180 || coord.lat > 180) {
			throw new Error('expected longitude between -180 and 180');
		}

		this.animations.push(new PingAnimation(
			coordToCanvas(coord),
			color
		));
	}
}

function coordToCanvas(_coord: Coordinate): Vector {
	// fudge the numbers because ??reasons??
	const coord = { lat: (_coord.lat - 24) * 1.2, long: _coord.long + 2 };

	const x = (coord.long + 180) * ( mapWidth / 360 );
	const latRad = coord.lat * Math.PI / 180;
	const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad/2)));
	const y = (mapHeight/2) - (mapWidth * mercN / (2 * Math.PI));
	const vec = {x, y}
	return vec;
}