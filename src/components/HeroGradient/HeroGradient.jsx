import React, { useEffect, useRef } from "react";
import "./HeroGradient.css";

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;

  mat2 m(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float map(vec3 p) {
    p.xz *= m(iTime * 0.4);
    p.xy *= m(iTime * 0.3);
    vec3 q = p * 2.0 + iTime;
    return length(p + vec3(sin(iTime * 0.7))) * log(length(p) + 1.) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy / iResolution.y - vec2(0.9, 0.5));
    vec3 cl = vec3(0.0);
    float d = 2.5;
    
    for(int i = 0; i <= 5; i++) {
      vec3 p3 = vec3(0.0, 0.0, 5.0) + normalize(vec3(p, -1.0)) * d;
      float rz = map(p3);
      float f = clamp((rz - map(p3 + 0.1)) * 0.5, -0.1, 1.0);
      vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
      cl = cl * l + (1.0 - smoothstep(0.0, 2.5, rz)) * 0.7 * l;
      d += min(rz, 1.0);
    }
    
    gl_FragColor = vec4(cl, 1.0);
  }
`;

const HeroGradient = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const program = gl.createProgram();

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShader);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShader);
    gl.compileShader(fShader);

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const iTime = gl.getUniformLocation(program, "iTime");
    const iResolution = gl.getUniformLocation(program, "iResolution");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(iTime, currentTime);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-gradient-canvas" />;
};

export default HeroGradient;
