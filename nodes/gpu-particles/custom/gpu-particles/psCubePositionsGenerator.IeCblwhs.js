module.exports = (node, graph) => {
  const random = require("pex-random");

  const positionsTextureOut = node.out("positionsTexture");

  const ctx = graph.ctx;

  const size = 512;
  const data = new Float32Array(size * size * 4);

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      data[(i + j * size) * 4 + 0] = random.float(-0.1, 0.1);
      data[(i + j * size) * 4 + 1] = random.float(-0.1, 0.1);
      data[(i + j * size) * 4 + 2] = random.float(-0.1, 0.1);
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
