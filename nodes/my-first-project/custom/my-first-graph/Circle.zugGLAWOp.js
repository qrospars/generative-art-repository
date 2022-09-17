module.exports = (node, graph) => {
	const triggerIn = node.triggerIn("in");

	triggerIn.onTrigger = (props) => {
		const { ctx, size } = props;

		// set background color to pale yellow
		ctx.fillStyle = `#FFFF66`;

		// set border color to black
		ctx.strokeStyle = "#000000";

		// start drawing shape
		ctx.beginPath();

		// draw a circle arc
		// at position 0,0
		// with radius half the size of cell gride
		// and from 0 to 360 degrees (full scircle)
		ctx.arc(0, 0, size / 2, 0, Math.PI * 2);

		// fill the shape
		ctx.fill();

		// add border to the shape
		ctx.stroke();

		// finish drawing shape
		ctx.closePath();
	};
};