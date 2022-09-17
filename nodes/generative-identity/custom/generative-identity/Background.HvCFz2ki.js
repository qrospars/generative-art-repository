module.exports = (node, graph) => {
  const { getHex } = require("pex-color");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const colorIn = node.in("color", [1, 1, 1, 1], { type: "color" });

  triggerIn.onTrigger = (props) => {
    const { canvas, ctx2d } = props;

    ctx2d.fillStyle = getHex(colorIn.value);
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);

    triggerOut.trigger(props);
  };
};
