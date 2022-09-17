module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const mouseIn = node.in("mouse", null);

  let step = 50;

  // margin size in pixels
  const margin = 20;

  triggerIn.onTrigger = (props) => {
    const { canvas, ctx } = props;
    const mouseState = mouseIn.value;

    // save canvas state
    ctx.save();

    // start drawing clipping mask
    ctx.beginPath();

    // draw clipping mask rectangle slightly smaller than whole page
    ctx.rect(
      margin,
      margin,
      canvas.width - margin * 2,
      canvas.height - margin * 2
    );
    ctx.clip();

    for (let x = 0; x < canvas.width; x += step) {
      for (let y = 0; y < canvas.height; y += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#0000FC";
        ctx.fillRect(1, 1, step - 2, step - 2);
        ctx.restore();
      }
    }

    // restore canvas state effectively disabling clipping
    ctx.restore();

    let index = 0;
    for (let x = 0; x < canvas.width; x += step) {
      for (let y = 0; y < canvas.height; y += step) {
        ctx.save();
        ctx.translate(x, y);

        // move to the center of the grid cell
        ctx.translate(step / 2, step / 2);
        // rotate the shapes based on mouse y position
        ctx.rotate(mouseState.y / 100);
        // trigger output port effectively drawing child nodes
        // with additional `size` and `index` properties
        triggerOut.trigger({
          ...props,
          index,
          size: step * 0.2 + (mouseState.x / canvas.width) * 100,
        });

        ctx.restore();

        index++;
      }
    }
  };
};
