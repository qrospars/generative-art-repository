module.exports = (node, graph) => {
  const { sphere: createSphere } = require("primitive-geometry");
  const { vec3 } = require("pex-math");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const colorIn = node.in("color", [1, 0, 0, 1]);
  const pointsIn = node.in("points", null);
  const enabledIn = node.in("enabled", true);

  const { ctx } = graph;
  const geom = createSphere(0.2, {
    segments: 4,
  });

  const drawCmd = {
    pipeline: ctx.pipeline({
      vert: `
      attribute vec3 aPosition;
    	attribute vec4 aOffset;
      attribute vec2 aTexCoord;
      attribute vec3 aNormal;

      varying vec3 vNormalView;
      varying vec2 vTexCoord;
      varying vec4 vColor;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uViewMatrix;
        
      uniform float uRadius;
      

      void main () {        
        vTexCoord = aTexCoord;
        vColor = mix(vec4(1.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), aOffset.w);
        vNormalView = vec3(uViewMatrix * vec4(aNormal, 0.0));
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition * uRadius + aOffset.xyz, 1.0);
      }
      `,
      frag: `
      precision highp float;     
      varying vec2 vTexCoord;
      varying vec3 vNormalView;
      uniform vec4 uColor;
      varying vec4 vColor;
        
      void main () {
        // gl_FragData[0] = vec4(vTexCoord, 0.0, 1.0);
        // gl_FragData[0] = vec4(vTexCoord, 0.0, 1.0);
        // if (vTexCoord.x > 0.3) {
        // 	gl_FragData[0] = uColor;
        // }
        // if (vTexCoord.x > 0.66) {        	
          gl_FragData[0] = vColor;
          gl_FragData[0].rgb *= 1.0 + 0.5 * (vNormalView.xxx * 0.5 + 0.5);
        // }
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
      aNormal: ctx.vertexBuffer(geom.normals),
      aTexCoord: ctx.vertexBuffer(geom.uvs),
      aOffset: { buffer: ctx.vertexBuffer([0, 0, 0]), divisor: 1 },
    },
    uniforms: {
      uRadius: 0.02,
    },
    indices: ctx.indexBuffer(geom.cells),
    instances: 1,
  };

  pointsIn.onChange = () => {
    const points = pointsIn.value;
    if (!points) return;
    drawCmd.instances = points.length;
    ctx.update(drawCmd.attributes.aOffset.buffer, { data: points });
  };

  triggerIn.onTrigger = (props) => {
    const { camera } = props;

    if (enabledIn.value) {
      ctx.submit(drawCmd, {
        uniforms: {
          uProjectionMatrix: camera.projectionMatrix,
          uViewMatrix: camera.viewMatrix,
          uColor: colorIn.value,
        },
      });
    }
    triggerOut.trigger(props);
  };
};
