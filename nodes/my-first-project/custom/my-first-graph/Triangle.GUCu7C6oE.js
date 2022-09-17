module.exports = (node, graph) => {
	const triggerIn = node.triggerIn("in");

	triggerIn.onTrigger = (props) => {
		const { ctx, size } = props;
		ctx.fillStyle = `#FFFFFF`;
		ctx.strokeStyle = "#000000";
		ctx.beginPath();

		// draw triangle
		ctx.moveTo(-size / 2, -size / 2);
		ctx.lineTo(-size / 2, size / 2);
		ctx.lineTo(size / 2, size / 2);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	};
};