module.exports = (node, graph) => {
	// import pex-random package that we installed
	const random = require("pex-random");

	const triggerIn = node.triggerIn("in");

	// create 3 output triggers
	const triggerOut1 = node.triggerOut("out1");
	const triggerOut2 = node.triggerOut("out2");
	const triggerOut3 = node.triggerOut("out3");

	triggerIn.onTrigger = (props) => {
		// seed random number generator with grid cell index
		// this will create the same number every frame for a given cell
		random.seed(props.index);

		// generate number from 0..2.999
		const t = random.float(0, 3);

		// trigger different output depending on random value
		// this will draw random shapes for each grid cells
		if (t <= 1) triggerOut1.trigger(props);
		else if (t <= 2) triggerOut2.trigger(props);
		else if (t <= 3) triggerOut3.trigger(props);
	};
};