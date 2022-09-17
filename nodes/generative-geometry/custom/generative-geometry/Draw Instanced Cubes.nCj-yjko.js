module.exports = (node, graph) => {
  const { cube: createCube } = require("primitive-geometry");
  const { vec3 } = require("pex-math");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const enabledIn = node.in("enabled", true);
  const geomIn = node.in("geom", null);

  const { ctx } = graph;
  const geom = createCube(1);
  geom.offsets = [[0, 0, 0]];
  geom.instances = 1;

  const drawCmd = {
    pipeline: ctx.pipeline({
      vert: `
      attribute vec3 aPosition;
      attribute vec3 aOffset;
      attribute float aAO;
      attribute vec3 aNormal;

      varying vec3 vNormalView;
      varying float vAO;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uViewMatrix;

      void main () {        
        vAO = aAO;
        vNormalView = vec3(uViewMatrix * vec4(aNormal, 0.0));
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition + aOffset, 1.0);
      }
      `,
      frag: `
      precision highp float;     
      varying vec3 vNormalView;
      varying float vAO;
        
      vec3 tonemapAces( vec3 x ) {
          float tA = 2.5;
          float tB = 0.03;
          float tC = 2.43;
          float tD = 0.59;
          float tE = 0.14;
          return clamp((x*(tA*x+tB))/(x*(tC*x+tD)+tE),0.0,1.0);
      }
        
      void main () {
        vec3 L = normalize(vec3(1.0));
        vec3 N = normalize(vNormalView);
        float NdotL = dot(N, L);
        float diffuse = (NdotL + 1.0) / 2.0;
      	gl_FragData[0].rgb = vNormalView * 0.5 + 0.5;
        //gl_FragData[0].rgb = vec3(1.0);        
        
        // gl_FragData[0].rgb = vec3(0.0, 1.5, 1.0) * vec3(diffuse) * 1.0;
        // gl_FragData[0].rgb += vec3(100.0) * vec3(pow(diffuse, 256.0));
        // gl_FragData[0].rgb *= vec3(1.0 - vAO);
        // gl_FragData[0].rgb += vec3(0.1, 0.0, 0.2);
        gl_FragData[0].rgb = tonemapAces(gl_FragData[0].rgb);
        gl_FragData[0].a = 1.0;
        // gl_FragData[0].rgb = mix(gl_FragData[0].rgb, vec3(1.0), 0.5);
        // gl_FragData[0].rgb = max(gl_FragData[0].rgb, vec3(0.5));
        // gl_FragData[0].rgb = 0.5 + 0.5 * gl_FragData[0].rgb;
        // #ifdef USE_DRAW_BUFFERS
        // gl_FragData[1] = vec4(vNormalView * 0.5 + 0.5, 0.0);
        // #endif
      }
      `,
      depthTest: true,
      depthWrite: true,
      blend: false,
      blendSrcRGBFactor: ctx.BlendFactor.SrcColor,
      blendSrcAlphaFactor: ctx.BlendFactor.One,
      blendDstRGBFactor: ctx.BlendFactor.OneMinusSrcColor,
      blendDstAlphaFactor: ctx.BlendFactor.One,
    }),
    attributes: {
      aPosition: ctx.vertexBuffer(geom.positions),
      aOffset: { buffer: ctx.vertexBuffer(geom.offsets), divisor: 1 },
      aAO: ctx.vertexBuffer(geom.positions.map(() => 1)),
      aNormal: ctx.vertexBuffer(geom.normals),
    },
    indices: ctx.indexBuffer(geom.cells),
    instances: 1,
  };

  geomIn.onChange = () => {
    var geom = geomIn.value;
    if (!geom) return;

    ctx.update(drawCmd.attributes.aPosition, { data: geom.positions });
    ctx.update(drawCmd.attributes.aNormal, { data: geom.normals });
    ctx.update(drawCmd.attributes.aAO, {
      data: geom.ao || geom.positions.map(() => 1),
    });
    ctx.update(drawCmd.attributes.aOffset.buffer, { data: geom.offsets });
    ctx.update(drawCmd.indices, { data: geom.cells });
    drawCmd.instances = geom.offsets.length;
  };

  triggerIn.onTrigger = (props) => {
    const { camera } = props;

    node.comment = `Cubes count: ${drawCmd.instances}`;

    if (enabledIn.value) {
      ctx.submit(drawCmd, {
        uniforms: {
          uProjectionMatrix: camera.projectionMatrix,
          uViewMatrix: camera.viewMatrix,
        },
      });
    }
    triggerOut.trigger(props);
  };
};
