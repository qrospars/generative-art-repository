module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const initialPositionsTexIn = node.in("initialPositionsTex", null);
  const positionIn = node.in("position", [0, 0, 0]);

  const ctx = graph.ctx;
  const { PingPong, snoise, snoise3 } = graph.ps;

  const updatePositionsCmdDef = {
    frag: `
      precision highp float;
      
      ${snoise.frag}
      ${snoise3.frag}
  
      varying vec2 vTexCoord;
      uniform sampler2D uPositionsTex;      
      uniform sampler2D uAgeLifetimeColorCoordsTex;
      uniform sampler2D uInitialPositionsTex;
      uniform float uTime;
      uniform float uDeltaTime;
      uniform float uNoiseScale;
      uniform float uSpeed;
      uniform vec3 uPosition;
      
      void main() {
        vec3 position = texture2D(uPositionsTex, vTexCoord).rgb; //TODO: what's alpha in PositionLife texture if alpha is now in uAgeLifetimeColorCoordsTex
        vec2 ageLifetime = texture2D(uAgeLifetimeColorCoordsTex, vTexCoord).rg; //TODO: what's alpha in PositionLife texture if alpha is now in uAgeLifetimeColorCoordsTex
      
        if (ageLifetime.x >= ageLifetime.y) {
          position = texture2D(uInitialPositionsTex, vTexCoord).rgb + uPosition;
        }      
  
        gl_FragColor = vec4(position, 1.0);
      }
      `,
  };

  const updateLifeCmdDef = {
    frag: `
      precision highp float;
  
      varying vec2 vTexCoord;
      uniform sampler2D uAgeLifetimeColorCoordsTex;
      
      void main() {
        vec4 ageLifetimeColorCoords = texture2D(uAgeLifetimeColorCoordsTex, vTexCoord);
        float age = ageLifetimeColorCoords.r;
        float lifetime = ageLifetimeColorCoords.g;
        
        if (age >= lifetime) {
          age = 0.0;
        	ageLifetimeColorCoords.r = age;
        }
        gl_FragColor = ageLifetimeColorCoords;
      }
      `,
  };

  let updateLifeCmd = null;

  let updatePositionsCmd = null;

  triggerIn.onTrigger = (props) => {
    const { ps } = props;

    if (!initialPositionsTexIn.value) {
      return;
    }

    // respawn position
    if (!updatePositionsCmd) {
      updatePositionsCmd = ps.createUpdateCmd(updatePositionsCmdDef);
    }

    updatePositionsCmd.pass = ps.positionsFbo.getPass();
    ctx.submit(updatePositionsCmd, {
      uniforms: {
        uPositionsTex: ps.positionsFbo.getTexture(),
        uAgeLifetimeColorCoordsTex: ps.ageLifetimeColorCoordsFbo.getTexture(),
        uInitialPositionsTex: initialPositionsTexIn.value,
        uPosition: positionIn.value,
      },
    });
    ps.positionsFbo.flip();

    // reset life
    if (!updateLifeCmd) {
      updateLifeCmd = ps.createUpdateCmd(updateLifeCmdDef);
    }

    updateLifeCmd.pass = ps.ageLifetimeColorCoordsFbo.getPass();
    ctx.submit(updateLifeCmd, {
      uniforms: {
        uAgeLifetimeColorCoordsTex: ps.ageLifetimeColorCoordsFbo.getTexture(),
      },
    });
    ps.ageLifetimeColorCoordsFbo.flip();

    triggerOut.trigger(props);
  };
};
