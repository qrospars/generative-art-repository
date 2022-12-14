module.exports = function (node, graph) {
  const { sphere: createSphere } = require("primitive-geometry");

  const rIn = node.in("r", 0.5);
  const segmentsIn = node.in("segments", 16, { precision: 0, min: 8, max: 64 });
  const geometry = node.out("geometry");

  function update() {
    const r = rIn.value;
    const segments = segmentsIn.value;
    var geom = createSphere(r, { segments: segments });
    geometry.setValue(geom);
  }

  rIn.onChange = update;
  segmentsIn.onChange = update;

  update();
};
