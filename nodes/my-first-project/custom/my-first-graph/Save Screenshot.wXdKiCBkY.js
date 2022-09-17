module.exports = function (node, graph) {
	const {canvasScreenshot, canvasContext }  = require("canvas-screenshot");

	const triggerIn = node.triggerIn("in");
	const triggerOut = node.triggerOut("out");

	let saveNextFrame = false;

	// having a function as second parameter to a port creates a butto in the inspector
	const saveScreenshot = node.in("Save Screenshot", () => {
		saveNextFrame = true;
	});

	let frame = 0;
	triggerIn.onTrigger = (props) => {
		triggerOut.trigger(props);

		if (saveNextFrame) {
      console.log('SAVE');
			saveNextFrame = false;

			// create `graph-name YYYY-MM-DD hh:mm:ss.png` file name
			const date = new Date()
				.toISOString()
				.slice(0, 19)
				.replace("T", " ")
				.replace(/:/g, "-");

			// create screenshot and trigger file download
			canvasScreenshot(props.canvas, {
				useBlob: true,
				filename: graph.name + " " + date,
			});
		}
	};
};