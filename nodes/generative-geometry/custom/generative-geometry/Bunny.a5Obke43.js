module.exports = function (node, graph) {
  const bunny = require("bunny");
  const centerNormalize = require("geom-center-and-normalize");
  const normals = require("geom-normals");

  const centeredBunny1x1 = {
    ...bunny,
    positions: centerNormalize(bunny.positions),
    normals: normals(bunny.positions, bunny.cells),
  };
  node.out("geometry", centeredBunny1x1);
};
