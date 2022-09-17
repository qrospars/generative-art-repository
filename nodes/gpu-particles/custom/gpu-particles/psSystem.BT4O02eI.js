module.exports = (node, graph) => {
  const random = require("pex-random");
  const { fromHex } = require("pex-color");
  const { lerp, clamp } = require("pex-math").utils;
  const { vec3 } = require("pex-math");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  // const pausedIn = node.in('paused', false)
  // const pathsTexIn = node.in('pathsTex', null)

  const ctx = graph.ctx;
  const { PingPong, snoise, curlNoise } = graph.ps;
  const N = 512;
  node.comment = `${N}^2 = ${N * N}`;

  //----------------------------------

  const positionsFbo = new PingPong(ctx, N);
  const ageLifetimeColorCoordsFbo = new PingPong(ctx, N);
  const offsets = new Float32Array(N * N * 4);

  node.out("positions0", positionsFbo.textures[0]);
  node.out("positions1", positionsFbo.textures[1]);
  node.out("ageLifetime0", ageLifetimeColorCoordsFbo.textures[1]);
  node.out("ageLifetime1", ageLifetimeColorCoordsFbo.textures[1]);

  const resetBtn = node.in("reset", () => {
    ps.needsReset = true;
  });

  const n = 64;
  let index = 0;
  let pathIndex = 0;
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      for (var i = 0; i < n; i++) {
        offsets[index * 4 + 0] = (index % N) / N;
        offsets[index * 4 + 1] = Math.floor(index / N) / N;
        offsets[index * 4 + 2] = 0; //unused?
        offsets[index * 4 + 3] = pathIndex / (64 * 64); // TODO: what is that
        positionsFbo.data[index * 4 + 0] = 0; // x / n * 2 - 1
        positionsFbo.data[index * 4 + 1] = 0; // y / n * 2 - 1
        positionsFbo.data[index * 4 + 2] = 0; // i / n * 2 - 1
        positionsFbo.data[index * 4 + 3] = 0;
        ageLifetimeColorCoordsFbo.data[index * 4 + 0] = random.float(0, 10); // 
        ageLifetimeColorCoordsFbo.data[index * 4 + 1] = 10; // i / n * 20
        ageLifetimeColorCoordsFbo.data[index * 4 + 2] = 0; // i / n
        ageLifetimeColorCoordsFbo.data[index * 4 + 3] = 0; // random.chance(0.5) ? 0.7 : 0.2

        index++;
      }
      pathIndex++;
    }
  }

  positionsFbo.update(positionsFbo.data);
  ageLifetimeColorCoordsFbo.update(ageLifetimeColorCoordsFbo.data);

  //----------------------------------

  const updateCmdTemplate = {
    attributes: {
      aPosition: ctx.vertexBuffer([
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]),
      aTexCoord0: ctx.vertexBuffer([
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
    viewport: [0, 0, N, N],
    uniforms: {
      uBounds: [0, 0, 1, 1],
    },
  };

  const updatePipelineTemplate = {
    vert: `
      attribute vec2 aPosition;
      attribute vec2 aTexCoord0;
  
      uniform vec4 uBounds; // x, y, width, height
  
      varying vec2 vTexCoord;
  
      void main() {
        vec2 pos = aPosition;
        pos = (pos + 1.0) / 2.0; // move from -1..1 to 0..1
        pos = vec2(
          uBounds.x + pos.x * uBounds.z,
          uBounds.y + pos.y * uBounds.w
        );
        pos = pos * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
        vTexCoord = aTexCoord0;
      }
      `,
    depthTest: false,
    depthWrite: false,
    cullFace: true,
    cullFaceMode: ctx.Face.Back,
    primitive: ctx.Primitive.Triangles,
  };

  function createUpdateCmd(program) {
    return Object.assign({}, updateCmdTemplate, {
      pipeline: ctx.pipeline(
        Object.assign({}, updatePipelineTemplate, program)
      ),
    });
  }

  const ps = {
    positionsFbo,
    ageLifetimeColorCoordsFbo,
    offsets: offsets,
    offsetsTex: ctx.texture2D({
      width: N,
      height: N,
      data: offsets,
      pixelFormat: ctx.PixelFormat.RGBA32F,
    }),
    offsetBuf: ctx.vertexBuffer(offsets),
    count: N * N,
    createUpdateCmd,
    needsReset: true,
  };

  triggerIn.onTrigger = (props) => {
    triggerOut.trigger({
      ...props,
      ps,
      deltaTime: Math.min(props.deltaTime, 0.02)
    });

    if (ps.needsReset) {
      ps.needsReset = false;
    }
  };
};
