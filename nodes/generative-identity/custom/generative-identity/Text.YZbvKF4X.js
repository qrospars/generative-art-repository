module.exports = (node, graph) => {
  const { getHex } = require("pex-color");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const textIn = node.in("text", "ID");
  const positionIn = node.in("position", [0.5, 0.5], { min: 0, max: 1 });
  const sizeIn = node.in("size", 0.2, { min: 0.1, max: 1 });
  const typefaceIn = node.in("typeface", "sans-serif", {
    type: "dropdown",
    values: ["sans-serif", "serif", "monospace"],
  });
  const colorIn = node.in("color", [0, 0, 0, 1], { type: "color" });

  triggerIn.onTrigger = (props) => {
    const { canvas, ctx2d } = props;
    const W = canvas.width;
    const H = canvas.height;
    const pos = positionIn.value;
    const text = textIn.value;
    const typeface = typefaceIn.value;

    const size = Math.floor(Math.min(W, H) * sizeIn.value);
    ctx2d.font = `${size}px ${typeface}`;
    ctx2d.fillStyle = getHex(colorIn.value);
    const textWidth = ctx2d.measureText(text).width;
    ctx2d.fillText(text, W * pos[0] - textWidth / 2, H * pos[1] + size / 3);

    triggerOut.trigger(props);
  };
};
