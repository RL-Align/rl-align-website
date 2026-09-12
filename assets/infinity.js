/* RL-Align hero: a procedural 3D mesh, rendered locally with WebGL.
 * No remote scripts, models, textures, or runtime dependencies.
 */
'use strict';

(() => {
  const canvas = document.querySelector('#infinity-canvas');
  const figure = canvas?.closest('.hero-art');
  const toggle = figure?.querySelector('.rotation-toggle');
  if (!canvas || !figure || !toggle) return;

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat3 uRotation;
    uniform mat4 uProjection;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vPosition = uRotation * aPosition;
      vNormal = uRotation * aNormal;
      gl_Position = uProjection * vec4(vPosition - vec3(0.0, 0.0, 6.8), 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    varying vec3 vPosition;
    varying vec3 vNormal;

    // Rectangular studio lights reflected across the curved silver surface.
    float softbox(vec3 ray, vec3 direction, vec2 size, float feather) {
      vec3 facing = normalize(direction);
      vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), facing));
      vec3 up = cross(facing, right);
      float forward = dot(ray, facing);
      vec2 point = abs(vec2(dot(ray, right), dot(ray, up))) / max(forward, 0.001);
      vec2 falloff = point / (size + feather);
      return exp(-2.0 * dot(falloff, falloff)) * step(0.0, forward);
    }

    vec3 environment(vec3 ray) {
      float sky = smoothstep(-0.6, 0.9, ray.y);
      vec3 light = mix(vec3(0.004, 0.006, 0.014), vec3(0.065, 0.09, 0.145), sky);
      light += vec3(6.2, 6.5, 7.0) * softbox(ray, vec3(-0.7, 1.3, 1.5), vec2(0.75, 0.32), 0.19);
      light += vec3(1.8, 2.1, 2.5) * softbox(ray, vec3(1.4, 0.5, 1.0), vec2(0.12, 0.9), 0.11);
      light += vec3(2.2, 2.4, 2.6) * softbox(ray, vec3(-0.3, 1.0, -0.8), vec2(0.8, 0.08), 0.1);
      light += vec3(0.025, 0.60, 1.50) * softbox(ray, vec3(-1.4, -0.3, 0.6), vec2(0.14, 0.9), 0.13);
      light += vec3(0.62, 0.18, 1.40) * softbox(ray, vec3(1.1, -0.9, -0.2), vec2(0.17, 0.65), 0.13);
      light += vec3(0.07, 0.13, 0.25) * pow(max(0.0, -ray.y), 3.0);
      return light;
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 view = normalize(vec3(0.0, 0.0, 6.8) - vPosition);
      vec3 reflection = reflect(-view, normal);
      float fresnel = pow(1.0 - max(0.0, dot(normal, view)), 5.0);
      vec3 silver = environment(reflection) * mix(vec3(0.90, 0.94, 1.0), vec3(1.0), fresnel);
      silver += vec3(0.003, 0.004, 0.007);
      // Gentle tone mapping keeps the highlights bright without hard clipping.
      silver = silver / (silver + vec3(0.72));
      gl_FragColor = vec4(pow(silver, vec3(1.0 / 2.2)), 1.0);
    }
  `;

  const normalize = v => {
    const length = Math.hypot(...v);
    return v.map(x => x / length);
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function surface(t, around) {
    const center = [1.95 * Math.cos(t), 0.78 * Math.sin(2 * t), 0.47 * Math.sin(t)];
    const tangent = normalize([-1.95 * Math.sin(t), 1.56 * Math.cos(2 * t), 0.47 * Math.cos(t)]);
    const side = normalize(cross(tangent, [0, 0, 1]));
    const up = cross(tangent, side);
    const twist = 0.45 * Math.sin(t);
    const angle = around + twist;
    const radius = 0.30 + 0.045 * Math.cos(2 * t);
    return center.map((value, i) => value + radius * Math.cos(angle) * side[i] + 0.29 * Math.sin(angle) * up[i]);
  }

  function createMesh() {
    const segments = 256;
    const sides = 40;
    const positions = [];
    const normals = [];
    const indices = [];
    const epsilon = 0.0001;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments * Math.PI * 2;
      for (let j = 0; j <= sides; j++) {
        const around = j / sides * Math.PI * 2;
        const p = surface(t, around);
        const before = surface(t - epsilon, around);
        const after = surface(t + epsilon, around);
        const left = surface(t, around - epsilon);
        const right = surface(t, around + epsilon);
        positions.push(...p);
        normals.push(...normalize(cross(right.map((x, k) => x - left[k]), after.map((x, k) => x - before[k]))));
        if (i < segments && j < sides) {
          const a = i * (sides + 1) + j;
          const b = a + sides + 1;
          indices.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }
    }
    return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  }

  // Column-major rotation: a full turn about the vertical axis, with a fixed
  // diagonal presentation. Geometry and reflection normals rotate together.
  function rotation(angle) {
    const x = 0.20, z = 0.28;
    const cx = Math.cos(x), sx = Math.sin(x), cy = Math.cos(angle), sy = Math.sin(angle), cz = Math.cos(z), sz = Math.sin(z);
    return new Float32Array([
      cz * cy - sz * sx * sy, sz * cy + cz * sx * sy, -cx * sy,
      -sz * cx, cz * cx, sx,
      cz * sy + sz * sx * cy, sz * sy - cz * sx * cy, cx * cy
    ]);
  }

  function createRenderer(gl) {
    const resources = [];
    function shader(kind, source) {
      const item = gl.createShader(kind);
      gl.shaderSource(item, source);
      gl.compileShader(item);
      if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) {
        gl.deleteShader(item);
        throw new Error('The infinity shader could not be compiled.');
      }
      resources.push(() => gl.deleteShader(item));
      return item;
    }
    try {
      const program = gl.createProgram();
      resources.push(() => gl.deleteProgram(program));
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexSource));
      const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision;
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, highPrecision ? fragmentSource : fragmentSource.replace('highp', 'mediump')));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('The infinity shader could not be linked.');
      gl.useProgram(program);
      const mesh = createMesh();
      for (const [name, values] of [['aPosition', mesh.positions], ['aNormal', mesh.normals]]) {
        const buffer = gl.createBuffer();
        resources.push(() => gl.deleteBuffer(buffer));
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
        const attribute = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(attribute);
        gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      }
      const index = gl.createBuffer();
      resources.push(() => gl.deleteBuffer(index));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
      const model = gl.getUniformLocation(program, 'uRotation');
      const projection = gl.getUniformLocation(program, 'uProjection');
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.clearColor(0, 0, 0, 0);
      return {
        draw(angle) {
          const bounds = canvas.getBoundingClientRect();
          if (!bounds.width || !bounds.height || gl.isContextLost()) return;
          const scale = Math.min(window.devicePixelRatio || 1, 1.5, 1400 / bounds.width);
          const width = Math.max(1, Math.round(bounds.width * scale));
          const height = Math.max(1, Math.round(bounds.height * scale));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          gl.viewport(0, 0, width, height);
          const f = 1 / Math.tan(34 * Math.PI / 360), near = 0.1, far = 30;
          gl.uniformMatrix4fv(projection, false, new Float32Array([
            f / (width / height), 0, 0, 0, 0, f, 0, 0,
            0, 0, (far + near) / (near - far), -1,
            0, 0, 2 * far * near / (near - far), 0
          ]));
          gl.uniformMatrix3fv(model, false, rotation(angle));
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
        },
        dispose() { resources.reverse().forEach(remove => remove()); }
      };
    } catch (error) {
      resources.reverse().forEach(remove => remove());
      throw error;
    }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer = null;
  let frame = 0;
  let lastFrame = null;
  let angle = -0.22;
  let inView = true;
  let userPaused = false;

  function isRunning() {
    return renderer && inView && !document.hidden && !userPaused && !reducedMotion.matches;
  }
  function tick(now) {
    frame = 0;
    if (!isRunning()) { lastFrame = null; return; }
    if (lastFrame === null) lastFrame = now;
    const elapsed = now - lastFrame;
    if (elapsed >= 1000 / 30) {
      // About 31 seconds per turn, with no jump when a tab is resumed.
      angle = (angle + Math.min(elapsed, 80) * 0.0002) % (Math.PI * 2);
      renderer.draw(angle);
      lastFrame = now;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = null;
    toggle.hidden = !renderer || reducedMotion.matches;
    toggle.classList.toggle('is-paused', userPaused);
    const label = userPaused ? 'Resume rotation' : 'Pause rotation';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    if (renderer && inView && !document.hidden) renderer.draw(angle);
    if (isRunning()) frame = requestAnimationFrame(tick);
  }
  function initialize() {
    try {
      const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power' });
      if (!gl) return;
      renderer = createRenderer(gl);
      renderer.draw(angle);
      figure.classList.add('has-3d');
      sync();
    } catch {
      renderer?.dispose();
      renderer = null;
      figure.classList.remove('has-3d');
      toggle.hidden = true;
      cancelAnimationFrame(frame);
    }
  }

  toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; lastFrame = null; });
  window.addEventListener('pageshow', sync);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = null;
    renderer = null;
    figure.classList.remove('has-3d');
    toggle.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', initialize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(canvas);
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { if (renderer && inView && !document.hidden) renderer.draw(angle); }).observe(canvas);
  } else {
    window.addEventListener('resize', sync);
  }
  initialize();
})();
