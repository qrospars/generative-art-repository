module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const windDirectionIn = node.in("windDirection", [0, 0, 1]);

  const ctx = graph.ctx;
  const { PingPong, snoise, snoise3 } = graph.ps;

  const updatePositionsCmdDef = {
    frag: `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      ${snoise.frag}
      ${snoise3.frag}
  
      varying vec2 vTexCoord;
      uniform sampler2D uPositionsTex;
      uniform vec3 uWindDirection;
      uniform float uDeltaTime;
      
      void main() {
        vec3 position = texture2D(uPositionsTex, vTexCoord).rgb;

        position += uWindDirection * uDeltaTime;
  
        gl_FragColor = vec4(position, 1.0);
      }
      `,
  };

  let updatePositionsCmd = null;

  triggerIn.onTrigger = (props) => {
    const { ps, deltaTime } = props;

    if (!updatePositionsCmd) {
      updatePositionsCmd = ps.createUpdateCmd(updatePositionsCmdDef);
    }

    updatePositionsCmd.pass = ps.positionsFbo.getPass();
    ctx.submit(updatePositionsCmd, {
      uniforms: {
        uPositionsTex: ps.positionsFbo.getTexture(),
        uDeltaTime: deltaTime,
        uWindDirection: windDirectionIn.value,
      },
    });
    ps.positionsFbo.flip();
    triggerOut.trigger(props);
  };
};
