module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const speedIn = node.in("speed", 1);

  const ctx = graph.ctx;
  const { PingPong, snoise, curlNoise } = graph.ps;

  const updateLifeCmdDef = {
    frag: `
      precision highp float;
  
      varying vec2 vTexCoord;
      uniform sampler2D uAgeLifetimeColorCoordsTex;
      uniform float uDeltaTime;
      
      void main() {
        vec4 ageLifetimeColorCoords = texture2D(uAgeLifetimeColorCoordsTex, vTexCoord);
        float age = ageLifetimeColorCoords.r;
        float lifetime = ageLifetimeColorCoords.g;
        age += uDeltaTime;
        age = min(age, lifetime);
        ageLifetimeColorCoords.r = age;
        gl_FragColor = ageLifetimeColorCoords;
      }
      `,
  };

  let updateLifeCmd = null;

  triggerIn.onTrigger = (props) => {
    const { ps, deltaTime } = props;

    if (!updateLifeCmd) {
      updateLifeCmd = ps.createUpdateCmd(updateLifeCmdDef);
    }

    updateLifeCmd.pass = ps.ageLifetimeColorCoordsFbo.getPass();
    ctx.submit(updateLifeCmd, {
      uniforms: {
        uAgeLifetimeColorCoordsTex: ps.ageLifetimeColorCoordsFbo.getTexture(),
        uDeltaTime: deltaTime * speedIn.value,
      },
    });
    ps.ageLifetimeColorCoordsFbo.flip();
    triggerOut.trigger(props);
  };
};
