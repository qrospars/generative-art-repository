module.exports = (node, graph) => {
  	const { getHex } = require("pex-color");

	const triggerIn = node.triggerIn("in");
  //Add a 4 dimensional color input [r,g,b,a]
	//Adding the {type: "color"} parameter creates the color picker in the inspector
	const colorIn = node.in("color", [1, 1, 1, 1], { type: "color" });

	triggerIn.onTrigger = (props) => {
		const { ctx, size } = props;
		//convert [r, g, b, a] to hex #RRGGBB color
		ctx.fillStyle = getHex(colorIn.value);
		ctx.strokeStyle = "#000000";
		ctx.beginPath();

		// draw rectangle
		// at position 0,0
		// and width the size of grid
		// and height half the size of grid
		ctx.rect(0, 0, size, size / 2);

		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	};
};