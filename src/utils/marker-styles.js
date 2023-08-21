// import { graphConfig } from './map-data';

export const pulsingDotDistributor = function (lossRatio, map, graphConfig) {
	return {
		width: graphConfig.size.distributer,
		height: graphConfig.size.distributer,
		rgbColorString: {
			LOW: {
				outer: '101, 193, 140',
				inner: '19, 148, 135',
			},
			MEDIUM: {
				outer: '255, 250, 77',
				inner: '255, 250, 77',
			},
			HIGH: {
				outer: '255, 114, 114',
				inner: '242, 120, 159',
			},
		},
		data: new Uint8Array(
			graphConfig.size.distributer * graphConfig.size.distributer * 4
		),

		// When the layer is added to the map,
		// get the rendering context for the map canvas.
		onAdd: function () {
			const canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			this.context = canvas.getContext('2d');
		},

		// Call once before every frame where the icon will be used.
		render: function () {
			const threat = getThreat(lossRatio);
			const duration = 1000;
			const t = (performance.now() % duration) / duration;

			const radius = (graphConfig.size.distributer / 2) * 0.3;
			const outerRadius = (graphConfig.size.distributer / 2) * t + radius;
			const context = this.context;

			if (threat === 'MEDIUM' || threat === 'HIGH') {
				// Draw the outer circle.
				context.clearRect(0, 0, this.width * 2, this.height * 2);
				context.beginPath();
				context.arc(
					this.width / 2,
					this.height / 2,
					outerRadius,
					0,
					Math.PI * 2
				);
				context.fillStyle = `rgba(${this.rgbColorString[threat].outer}, ${
					1 - t
				})`;
				context.fill();
			}

			// Draw the inner circle.
			context.beginPath();
			context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
			context.fillStyle = `rgba(${this.rgbColorString[threat].inner}, 1)`;
			context.strokeStyle = 'white';
			context.lineWidth = 2 + 4 * (1 - t);
			context.fill();
			context.stroke();

			// Update this image's data with data from the canvas.
			this.data = context.getImageData(0, 0, this.width, this.height).data;

			// Continuously repaint the map, resulting
			// in the smooth animation of the dot.
			map.triggerRepaint();

			// Return `true` to let the map know that the image was updated.
			return true;
		},
	};
};

export const pulsingDotConsumer = function (map, graphConfig) {
	return {
		width: graphConfig.size.consumer,
		height: graphConfig.size.consumer,
		data: new Uint8Array(
			graphConfig.size.consumer * graphConfig.size.consumer * 4
		),

		// When the layer is added to the map,
		// get the rendering context for the map canvas.
		onAdd: function () {
			const canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			this.context = canvas.getContext('2d');
		},

		// Call once before every frame where the icon will be used.
		render: function () {
			const duration = 1000;
			const t = (performance.now() % duration) / duration;

			const radius = (graphConfig.size.consumer / 2) * 0.3;
			// const outerRadius = (graphConfig.size.consumer / 2) * 0.7 * t + radius;
			const context = this.context;

			// Draw the inner circle.
			context.beginPath();
			context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
			context.fillStyle = 'rgba(8, 69, 148, 1)';
			context.strokeStyle = 'white';
			context.lineWidth = 2 + 4 * (1 - t);
			context.fill();
			context.stroke();

			// Update this image's data with data from the canvas.
			this.data = context.getImageData(0, 0, this.width, this.height).data;

			// Continuously repaint the map, resulting
			// in the smooth animation of the dot.
			map.triggerRepaint();

			// Return `true` to let the map know that the image was updated.
			return true;
		},
	};
};

const getThreat = (ratio) => {
  if (ratio >= 0.9) return "LOW";
  if (ratio >= 0.75) return "MEDIUM";
  return "HIGH";
};
