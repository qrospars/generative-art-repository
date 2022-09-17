module.exports = (node, graph) => {
  const random = require("pex-random");
  const { vec3 } = require("pex-math");

  const positionsTextureOut = node.out("positionsTexture");

  const ctx = graph.ctx;

  const size = 512;
  const data = new Float32Array(size * size * 4);
  const r = 0.2;

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var v = [
        random.float(-0.1, 0.1),
        random.float(-0.1, 0.1),
        random.float(-0.1, 0.1),
      ];
      vec3.normalize(v);
      vec3.scale(v, random.float(0, r));
      data[(i + j * size) * 4 + 0] = v[0];
      data[(i + j * size) * 4 + 1] = v[1];
      data[(i + j * size) * 4 + 2] = v[2];
      data[(i + j * size) * 4 + 3] = 1;
    }
  }

  const randomTex = ctx.texture2D({
    width: size,
    height: size,
    data: data,
    pixelFormat: ctx.PixelFormat.RGBA32F,
  });

  positionsTextureOut.setValue(randomTex);
};
