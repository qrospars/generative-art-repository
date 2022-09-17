module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const textureIn = node.in("texture", null);
  const positionIn = node.in("position", [0, 0]);
  const sizeIn = node.in("size", [128, 128]);

  const ctx = graph.ctx;

  const drawCmd = {
    pipeline: ctx.pipeline({
      vert: `
        attribute vec2 aPosition;
        attribute vec2 aTexCoord;
        varying vec2 vTexCoord;
        void main () {
          vTexCoord = aTexCoord;
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,
      frag: `
        precision highp float;
        varying vec2 vTexCoord;
        uniform sampler2D uTexture;
        void main () {
          gl_FragColor = texture2D(uTexture, vTexCoord);
        }
      `,
    }),
    attributes: {
      aPosition: ctx.vertexBuffer([
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]),
      aTexCoord: ctx.vertexBuffer([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ]),
    },
    indices: ctx.indexBuffer([
      [0, 1, 2],
      [0, 2, 3],
    ]),
    viewport: [0, 0, 128, 128],
  };

  triggerIn.onTrigger = (props) => {
    const tex = textureIn.value;
    const position = positionIn.value;
    const size = sizeIn.value;

    if (tex) {
      node.comment = `${tex.width} x ${tex.height}`;
      ctx.submit(drawCmd, {
        uniforms: {
          uTexture: tex,
        },
        viewport: [position[0], position[1], size[0], size[1]],
      });
    }
    triggerOut.trigger(props);
  };
};
