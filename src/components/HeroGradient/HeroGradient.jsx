import React, { useEffect, useRef } from "react";
import * as dat from "dat.gui";

const vertexShader = `
  precision highp float;
  attribute vec4 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = position;
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;
  uniform float scale;
  uniform float timeSpeed;
  uniform vec2 resolution;
  uniform vec3 color1, color2, color3, color4;
  uniform float ax, ay, az, aw;
  uniform float bx, by;
  
  const float PI = 3.141592654;
  
  float cheapNoise(vec3 stp) {
    vec3 p = vec3(stp.st, stp.p);
    vec4 a = vec4(ax, ay, az, aw);
    return mix(
      sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) * 
      cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
      sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) * 
      cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)), 
      .436
    );
  }
  
  void main() {
    vec2 aR = vec2(resolution.x/resolution.y, 1.);
    vec2 st = vUv * aR * scale;
    float adjustedTime = time * timeSpeed;
    float S = sin(adjustedTime * 0.0005);
    float C = cos(adjustedTime * 0.0005);
    vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
    vec2 v2 = vec2(
      cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.015 * adjustedTime)),
      cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.0126 * adjustedTime))
    );
    float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));
    
    vec3 color = mix(color1,
      color2,
      clamp((n*n)*8.,0.0,1.0));
    color = mix(color,
      color3,
      clamp(length(v1),0.0,1.0));
    color = mix(color,
              color4,
              clamp(length(v2.x),0.0,1.0));
    
    color /= n*n + n * 7.;
    gl_FragColor = vec4(color,1.);
  }
`;

const HeroGradient = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const guiRef = useRef(null);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [1, 1, 1];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Create shader program
    const program = gl.createProgram();

    // Vertex shader
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShader);
    gl.compileShader(vShader);

    // Fragment shader
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShader);
    gl.compileShader(fShader);

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up buffers
    const positions = new Float32Array([
      -1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1,
    ]);
    const uvs = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLocation = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const uniforms = {
      time: gl.getUniformLocation(program, "time"),
      timeSpeed: gl.getUniformLocation(program, "timeSpeed"),
      resolution: gl.getUniformLocation(program, "resolution"),
      scale: gl.getUniformLocation(program, "scale"),
      color1: gl.getUniformLocation(program, "color1"),
      color2: gl.getUniformLocation(program, "color2"),
      color3: gl.getUniformLocation(program, "color3"),
      color4: gl.getUniformLocation(program, "color4"),
      ax: gl.getUniformLocation(program, "ax"),
      ay: gl.getUniformLocation(program, "ay"),
      az: gl.getUniformLocation(program, "az"),
      aw: gl.getUniformLocation(program, "aw"),
      bx: gl.getUniformLocation(program, "bx"),
      by: gl.getUniformLocation(program, "by"),
    };

    // GUI controls
    const controls = {
      scale: 0.5,
      timeSpeed: 0.05,
      ax: 5,
      ay: 2.5,
      az: 5,
      aw: 7.5,
      bx: 1,
      by: -1,
      color1: "#585843",
      color2: "#717543",
      color3: "#d2b172",
      color4: "#2b3928",
    };

    // Initialize dat.GUI
    const gui = new dat.GUI();
    guiRef.current = gui;

    gui.add(controls, "scale", 0.1, 4, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.scale, value);
    });

    gui.add(controls, "timeSpeed", 0.1, 2, 0.1).name("Motion Speed");

    gui.add(controls, "ax", 1, 15, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.ax, value);
    });

    gui.add(controls, "ay", 1, 15, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.ay, value);
    });

    gui.add(controls, "az", 1, 15, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.az, value);
    });

    gui.add(controls, "aw", 1, 15, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.aw, value);
    });

    gui.add(controls, "bx", -1, 1, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.bx, value);
    });

    gui.add(controls, "by", -1, 1, 0.01).onChange((value) => {
      gl.uniform1f(uniforms.by, value);
    });

    gui.addColor(controls, "color1").onChange((value) => {
      gl.uniform3fv(uniforms.color1, hexToRgb(value));
    });

    gui.addColor(controls, "color2").onChange((value) => {
      gl.uniform3fv(uniforms.color2, hexToRgb(value));
    });

    gui.addColor(controls, "color3").onChange((value) => {
      gl.uniform3fv(uniforms.color3, hexToRgb(value));
    });

    gui.addColor(controls, "color4").onChange((value) => {
      gl.uniform3fv(uniforms.color4, hexToRgb(value));
    });

    // Set initial uniform values
    Object.entries(controls).forEach(([key, value]) => {
      if (key.startsWith("color")) {
        gl.uniform3fv(uniforms[key], hexToRgb(value));
      } else {
        gl.uniform1f(uniforms[key], value);
      }
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const currentTime = Date.now() - startTimeRef.current;
      gl.uniform1f(uniforms.time, currentTime);
      gl.uniform1f(uniforms.timeSpeed, controls.timeSpeed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default HeroGradient;
