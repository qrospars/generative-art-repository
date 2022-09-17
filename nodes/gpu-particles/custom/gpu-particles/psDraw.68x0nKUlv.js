module.exports = (node, graph) => {
  const {
    cube: createCube,
    plane: createPlane,
  } = require("primitive-geometry");
  const { mat4 } = require("pex-math");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const colorTextureIn = node.in("colorTexture");
  const spriteTextureIn = node.in("spriteTexture");
  const showNormalsIn = node.in("showNormals", false);

  const ctx = graph.ctx;

  const g = createPlane(0.1, 0.1);
  // const cubeHeight = 1
  // const g = createCube(0.1)
  // g.positions.forEach((p) => {
  // p[2] += cubeHeight
  // })

  const positionBuf = ctx.vertexBuffer(g.positions);
  // const scaleBuf = ctx.vertexBuffer(g.positions.map(() => [1, 1, 1]))
  const texCoordBuf = ctx.vertexBuffer(g.uvs);
  const normalBuf = ctx.vertexBuffer(g.normals);
  const indexBuf = ctx.indexBuffer(g.cells);

  graph.ctx.gl.getExtension("EXT_frag_depth");

  const drawCmd = {
    pipeline: ctx.pipeline({
      vert: `
        attribute vec3 aPosition;
        attribute vec4 aOffset;
        attribute vec2 aTexCoord;

        uniform mat4 uProjectionMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uModelMatrix;
        uniform float uScale;
        uniform sampler2D uPositionTex;
        uniform sampler2D uAgeLifetimeColorCoordsTex;
        //uniform sampler2D uColorTex;
        //uniform sampler2D uLifeColorTexture;

        varying float vLife;
        varying vec2 vColorTexCoord;
        varying vec4 vColor;
        varying vec2 vTexCoord;
        varying vec3 vCenterPositionView;

        void main () {
          vec4 positionLife = texture2D(uPositionTex, aOffset.xy).rgba;
          vec3 position = positionLife.rgb;
          vec4 ageLifetimeColorCoords = texture2D(uAgeLifetimeColorCoordsTex, aOffset.xy);
          float life = ageLifetimeColorCoords.x / ageLifetimeColorCoords.y;
          vLife = life;
          vColorTexCoord = ageLifetimeColorCoords.zw;


          vec3 positionWorld = position;
          vec4 positionView = uViewMatrix * uModelMatrix * vec4(positionWorld, 1.0);
          vCenterPositionView = positionView.xyz;

          if (life > 0.0) {
          	positionView.xyz += aPosition * uScale;
          }
          gl_Position = uProjectionMatrix * positionView;
          vTexCoord = aTexCoord;
        }
        `,
      frag: `
        #extension GL_EXT_frag_depth : enable
        #extension GL_EXT_draw_buffers : enable
        precision highp float;
        varying float vLife;
        uniform float uScale;
        varying vec2 vTexCoord;
        varying vec3 vCenterPositionView;
        uniform mat4 uProjectionMatrix;
        uniform sampler2D uLifeColorTexture;
        uniform bool uShowNormals;

        varying vec2 vColorTexCoord;


        // https://stackoverflow.com/questions/53650693/opengl-impostor-sphere-problem-when-calculating-the-depth-value
        void Impostor(out vec3 cameraPos, out vec3 cameraNormal)
        {
          float sphereRadius = 0.1 / 2.0;//uScale;
          vec2 mapping = vTexCoord * 2.0 - 1.0;
          vec3 cameraPlanePos = vec3(mapping * sphereRadius, 0.0) + vCenterPositionView;
          vec3 rayDirection = normalize(cameraPlanePos);

          float B = 2.0 * dot(rayDirection, -vCenterPositionView);
          float C = dot(vCenterPositionView, vCenterPositionView) - (sphereRadius * sphereRadius);

          float det = (B * B) - (4.0 * C);
          if(det < 0.0)
            discard;

          float sqrtDet = sqrt(det);
          float posT = (-B + sqrtDet) / 2.0;
          float negT = (-B - sqrtDet) / 2.0;

          float intersectT = min(posT, negT);
          cameraPos = rayDirection * intersectT;
          cameraNormal = normalize(cameraPos - vCenterPositionView);
        }

        void main () {
          vec3 cameraPos;
          vec3 cameraNormal;

          Impostor(cameraPos, cameraNormal);
          vec3 N = cameraNormal;

          vec4 positionClip = uProjectionMatrix * vec4(cameraPos, 1.0);

          float ndc_depth = positionClip.z / positionClip.w;

          gl_FragDepthEXT = (
          (gl_DepthRange.diff * ndc_depth) +
          gl_DepthRange.near + gl_DepthRange.far
          ) / 2.0;

          vec3 L = normalize(vec3(1.0, 2.0, 3.0));
          float dotNL = dot(N, L);
          float wrap = 1.0;
          float diffuse = (dotNL + wrap) / (1.0 + wrap);

          vec3 color = N * 0.5 + 0.5;
          if (!uShowNormals) {
          // if (vTexCoord.x > 0.0) {
          	color = texture2D(uLifeColorTexture, vec2(vLife, 0.5)).rgb;
          }
          color *= diffuse;
          color += vec3(0.2, 0.1, 0.3);
          // color = vec3(diffuse);
            // color = vec3(1.0, vLife, 0.0);
          // }
          //color = vec3(1.0);
          // color = pow(color, vec3(2.2));

          //float intensity = texture2D(uLifeColorTexture, vColorTexCoord.xy * vec2(0.5, 1.0) + vec2(0.5, 0.0)).r;
          //color *= intensity * 5.0;

          // color = texture2D(uLifeColorTexture, vec2(vColorTexCoord.x * 0.5, 0.6)).rgb;
          //color = vec3(color.x);
          // color = vec3(vLife, 1.0, 0.0);
          // color = (vColor.rgb) * diffuse;
          // color = (vColor.rgb) * diffuse;

          // vec2 vUV = vec2(gl_FragCoord.x / uScreenSize.x, gl_FragCoord.y / uScreenSize.y);
          // float ao = texture2D(uAO, vUV).r;
          // color *= ao;
          //color = vec3(ao);


          // color *= 5.0;
          // color += vec3(0.1, 0.0, 0.0);
          gl_FragData[0].rgba = vec4(color, 1.0);
          gl_FragData[1].rgba = vec4(N * 0.5 + 0.5, 1.0);
          // color *= vec3(7.0, 2.0, 2.0);
          // gl_FragColor = vec4(vTexCoord, 0.0, 1.0);
          // if (vLife > 1.0) discard;
          // vec4 color = vColor;
          // float sprite = texture2D(uSpriteTexture, vTexCoord).r;
          // // color.rgb *= sprite;
          // gl_FragColor = color;
          // gl_FragColor = vec4(pow(vColor.rgb, vec3(2.2)), 1.0);
        }
        `,
      primitive: ctx.Primitive.Triangles,
      depthTest: true,
      depthWrite: true,
    }),
    instances: 0,
    uniforms: {
      uProjectionMatrix: null,
      uViewMatrix: null,
      uPointSize: 8,
      uScale: 1,
    },
  };

  const rotationMat = mat4.create();

  triggerIn.onTrigger = (props) => {
    const { ps, camera, time } = props;

    if (!colorTextureIn.value) return;

    ctx.submit(drawCmd, {
      attributes: {
        aPosition: positionBuf,
        aTexCoord: texCoordBuf,
        aNormal: normalBuf,
        aOffset: { buffer: ps.offsetBuf, divisor: 1 },
        // aScale: { buffer: ps.scaleBuf, divisor: 1 },
        // aVelocity: { buffer: ps.velocityBuf, divisor: 1 },
        // aAgeLifetime: { buffer: ps.ageLifetimeBuf, divisor: 1 },
        // aColor: { buffer: ps.colorBuf, divisor: 1 }
      },
      indices: indexBuf,
      instances: ps.count / 1,
      uniforms: {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: rotationMat,
        // uModelMatrix: mat4.rotate(mat4.create(), time / 5, [0, 1, 0]),
        uLifeColorTexture: colorTextureIn.value,
        // uSpriteTexture: spriteTextureIn.value,
        uPositionTex: ps.positionsFbo.getTexture(),
        uAgeLifetimeColorCoordsTex: ps.ageLifetimeColorCoordsFbo.getTexture(),
        uScale: 1, //props.animation.particleScale
        // uColorTex: ps.colorTex,
        uShowNormals: showNormalsIn.value,
      },
    });
    triggerOut.trigger(props);
  };
};
