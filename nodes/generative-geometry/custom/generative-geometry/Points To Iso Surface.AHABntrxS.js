module.exports = (node, graph) => {
  const isosurfaceGenerator = require("isosurface-generator");
  const ndarray = require("ndarray");
  const normals = require("geom-normals");
  const random = require("pex-random");
  const {
    vec3,
    utils: { map },
  } = require("pex-math");

  const geoao = require("geo-ambient-occlusion");

  const size = 200;

  //     mesh = {
  //       positions: data.positions,
  //       cells: data.cells,
  //     };
  //     console.log('Fraction complete:', data.fraction, data);
  //     // await display update
  //   }

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const pointsIn = node.in("points");
  const geomForRenderOut = node.out("render geom");
  const geomForExportOut = node.out("export geom");
  let generator = null;

  let r = 1;

  function startIsosurface() {
    let points = pointsIn.value;
    if (!points) return;
    points = points.filter((p) => p[3] == 1); // buds only
    const density = ndarray(new Float32Array(size * size * size), [
      size,
      size,
      size,
    ]);

    for (var pi = 0; pi < points.length; pi++) {
      var p = points[pi];
      var x = map(p[0], -r, r, 0, size - 1);
      var y = map(p[1], -r, r, 0, size - 1);
      var z = map(p[2], -r, r, 0, size - 1);
      var xi = x | 0;
      var yi = y | 0;
      var zi = z | 0;
      var pos = [x, y, z];
      var ri = 4;
      var ri2 = ri * 2;
      for (var i = Math.max(xi - ri, 0); i < Math.min(xi + ri, size); i++) {
        for (var j = Math.max(yi - ri, 0); j < Math.min(yi + ri, size); j++) {
          for (var k = Math.max(zi - ri, 0); k < Math.min(zi + ri, size); k++) {
            var dist = vec3.distance(pos, [i, j, k]);
            var potential = Math.max(0, (ri2 - dist) / ri2) / 1;
            density.set(i, j, k, Math.max(potential, density.get(i, j, k)));
          }
        }
      }
    }
    generator = isosurfaceGenerator(density, 0.7);
  }

  pointsIn.onChange = startIsosurface;

  // const runIn = node.in('run', startIsosurface)

  let mesh = null;

  triggerIn.onTrigger = (props) => {
    if (generator) {
      var start = Date.now();
      while (Date.now() - start < 16) {
        var result = generator.next();
        node.comment = `Generating Mesh : ${
          ((result.value ? result.value.fraction : 1) * 100) | 0
        }%`;
        if (result.done) {
          generator = null;

          node.comment = "" + mesh.positions.length;

          var g = {
            positions: mesh.positions.map((p) => {
              vec3.scale(p, 1 / size);
              vec3.add(p, [-0.5, -0.5, -0.5]);
              vec3.scale(p, r * 2);
              return p;
            }),
            normals: normals(mesh.positions, mesh.cells),
            cells: mesh.cells,
          };

          const aoSampler = geoao(g.positions, {
            cells: g.cells,
            resolution: 1024,
          });
          for (let i = 0; i < 128; i++) {
            aoSampler.sample();
          }

          const ao = aoSampler.report();
          g.ao = ao;
          aoSampler.dispose();

          geomForRenderOut.setValue({
            ...g,
            cells: new Uint32Array(g.cells.flat()),
          });
          geomForExportOut.setValue(g);
          break;
        } else {
          mesh = result.value;
        }
      }
      props.displayMessage(node.comment);
    }

    triggerOut.trigger(props);
  };
};
