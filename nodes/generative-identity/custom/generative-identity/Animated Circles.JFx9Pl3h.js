module.exports = (node, graph) => {
  const { getHex, fromHex } = require("pex-color");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const pausedIn = node.in("paused", false);
  const color1In = node.in("color1", fromHex("#0000FF"), { type: "color" });
  const color2In = node.in("color2", fromHex("#FF0000"), { type: "color" });
  const color3In = node.in("color3", fromHex("#FFDD00"), { type: "color" });
  const color4In = node.in("color4", fromHex("#00FF99"), { type: "color" });

  let time = 0;
  triggerIn.onTrigger = (props) => {
    const { canvas, ctx2d } = props;
    const W = canvas.width;
    const H = canvas.height;
    const minSize = Math.min(W, H);

    if (!pausedIn.value) {
      time = Date.now() / 500;
    }

    ctx2d.fillStyle = getHex(color1In.value);
    ctx2d.beginPath();
    const r1 = 0.6 + Math.sin(time + 0.5) * 0.05;
    ctx2d.arc(W / 2 - W / 5, H / 2 - H / 2, minSize * r1, 0, Math.PI * 2);
    ctx2d.fill();

    ctx2d.fillStyle = getHex(color2In.value);
    ctx2d.beginPath();
    const r2 = 0.3 + Math.sin(time + 0.5) * 0.05;
    ctx2d.arc(W / 2, H / 2, minSize * r2, 0, Math.PI * 2);
    ctx2d.fill();

    const r3 = 0.23 + Math.sin(time + 2) * 0.1;
    const radialgradient = ctx2d.createRadialGradient(
      W / 2 + W / 5,
      H / 2 - H / 5,
      1,
      W / 2 + W / 5,
      H / 2 - H / 5,
      minSize * r3
    );
    radialgradient.addColorStop(0.5, getHex(color3In.value));
    radialgradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    radialgradient.addColorStop(0.6, "rgba(255, 255, 255, 0)");
    radialgradient.addColorStop(0.6, getHex(color3In.value));
    radialgradient.addColorStop(0.7, getHex(color3In.value));
    radialgradient.addColorStop(0.7, "rgba(255, 255, 255, 0)");
    ctx2d.fillStyle = radialgradient;
    ctx2d.beginPath();
    ctx2d.arc(W / 2 + W / 5, H / 2 - H / 5, minSize * r3, 0, Math.PI * 2);
    ctx2d.fill();

    ctx2d.fillStyle = getHex(color4In.value);
    ctx2d.beginPath();
    const r4 = 0.36 + Math.sin(time + 1.5) * 0.1;
    ctx2d.arc(W / 2 + W / 3, H, minSize * r4, 0, Math.PI * 2);
    ctx2d.fill();

    triggerOut.trigger(props);
  };
};
