module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  
  const noiseScaleIn = node.in("noiseScale", 0.13, { min: 0.01, max: 2 });
  const speedIn = node.in("speed", 0.2, { min: 0, max: 2 });

  const ctx = graph.ctx;
  const { PingPong, snoise, snoise3, curlNoise } = graph.ps;

  const updatePositionsCmdDef = {
    frag: `
      precision highp float;
      
      ${snoise.frag}
      ${snoise3.frag}
    	${curlNoise.frag}
  
      varying vec2 vTexCoord;
      uniform sampler2D uPositionsTex;
      uniform sampler2D uAgeLifetimeColorCoordsTex;
      uniform float uDeltaTime;
      uniform float uNoiseScale;
      uniform float uSpeed;
      
      void main() {
        vec3 position = texture2D(uPositionsTex, vTexCoord).rgb;
        vec4 ageLifetimeColorCoords = texture2D(uAgeLifetimeColorCoordsTex, vTexCoord);
        float age = ageLifetimeColorCoords.r;
        float lifetime = ageLifetimeColorCoords.g;
        float life = 1.0 - age / lifetime;
        
        float scale = uNoiseScale;
      	position += (1.0 - life) * curlNoise(position * scale, 0.0) * uDeltaTime * uSpeed;
  
        gl_FragColor = vec4(position, life);
      }
      `,
  };

  let updatePositionsCmd = null;

  triggerIn.onTrigger = (props) => {
    const { ps } = props;

    if (!updatePositionsCmd) {
      updatePositionsCmd = ps.createUpdateCmd(updatePositionsCmdDef);
    }

    updatePositionsCmd.pass = ps.positionsFbo.getPass();
    ctx.submit(updatePositionsCmd, {
      uniforms: {
        uPositionsTex: ps.positionsFbo.getTexture(),
        uAgeLifetimeColorCoordsTex: ps.ageLifetimeColorCoordsFbo.getTexture(),
        uDeltaTime: props.deltaTime,
        uSpeed: speedIn.value,
        uNoiseScale: noiseScaleIn.value,
      },
    });
    ps.positionsFbo.flip();
    triggerOut.trigger(props);
  };
};
