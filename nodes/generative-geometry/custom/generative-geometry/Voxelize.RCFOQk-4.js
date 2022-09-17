module.exports = (node, graph) => {
  const voxelize = require("voxelize");
  const debounce = require("debounce");

  const geomIn = node.in("geomIn");
  const resolutionIn = node.in("resolution", 0.05);
  const voxelsOut = node.out("voxels");

  function update() {
    if (!geomIn.value) return;
    var g = geomIn.value;
    var start = Date.now();
    var result = voxelize(g.cells, g.positions, resolutionIn.value);

    // Unpack result
    var voxels = result.voxels;
    var origin = result.origin;
    var resolution = result.resolution;
    var end = Date.now();
    voxelsOut.setValue(result);
    node.comment = `Grid: ${voxels.shape.join(" x ")}
Computation time: ${end - start}ms`;
    // geomOut.setValue(g)
  }

  const lazyUpdate = debounce(update, 100);

  geomIn.onChange = lazyUpdate;
  resolutionIn.onChange = lazyUpdate;
};
