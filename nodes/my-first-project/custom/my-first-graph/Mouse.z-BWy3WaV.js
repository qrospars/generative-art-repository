module.exports = (node, graph) => {
	const triggerIn = node.triggerIn("in");

	// mouse state we will pass to other nodes
	const mouseState = {
		x: 0,
		y: 0,
		mouseDown: false,
	};

	// parameter port we will use to send mouse data
	const mouseOut = node.out("mouse", mouseState);

	const onMouseMove = (e) => {
		mouseState.x = e.layerX;
		mouseState.y = e.layerY;
		mouseOut.setValue(mouseState);

		node.comment = JSON.stringify(mouseState, null, 2);
	};

	const onMouseDown = (e) => {
		mouseState.onMouseDown = true;
		mouseOut.setValue(mouseState);
		node.comment = JSON.stringify(mouseState, null, 2);
	};

	const onMouseUp = (e) => {
		mouseState.onMouseDown = false;
		mouseOut.setValue(mouseState);
	};

	let addedListeners = false;
	let canvas = null;

	// add event listeners on the first run
	triggerIn.onTrigger = (props) => {
		if (!addedListeners) {
			addedListeners = true;
			canvas = props.canvas;
			canvas.addEventListener("mousemove", onMouseMove);
			canvas.addEventListener("mousedown", onMouseDown);
			window.addEventListener("mouseup", onMouseUp);
		}
	};

	// it's important to remove event listeners when destroying node
	node.onDestroy = () => {
		if (canvas) {
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
		}
	};
};