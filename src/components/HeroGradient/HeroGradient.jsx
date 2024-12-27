import React, { useEffect, useRef } from "react";
import * as dat from "dat.gui";
import * as THREE from "three";

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
  const threeCanvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const guiRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);

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

  const backgroundParams = {
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

  const sphereControls = {
    position: {
      x: 2,
      y: 2,
      z: 2,
    },
    size: 10,
    segments: 128,
    materialScale: 2.0,
    timeSpeed: 0.05,
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: threeCanvasRef.current,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.SphereGeometry(2.75, 2000, 2000);

    const sphereVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const sphereFragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      uniform float time;
      uniform float scale;
      uniform float timeSpeed;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform vec3 color4;
      uniform float ax, ay, az, aw;
      uniform float bx, by;

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
        vec2 st = vUv * scale;
        float adjustedTime = time * timeSpeed;
        float S = sin(adjustedTime * 0.0005);
        float C = cos(adjustedTime * 0.0005);
        
        // Use normal and position to create more interesting 3D effect
        vec3 pos = normalize(vPosition);
        st += pos.xy * 0.5;
        
        vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
        vec2 v2 = vec2(
          cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.015 * adjustedTime)),
          cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.0126 * adjustedTime))
        );
        float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));
        
        vec3 color = mix(color1, color2, clamp((n*n)*8.,0.0,1.0));
        color = mix(color, color3, clamp(length(v1),0.0,1.0));
        color = mix(color, color4, clamp(length(v2.x),0.0,1.0));
        
        // Add specular highlight based on normal
        float specular = pow(max(dot(normalize(vec3(1.0, 1.0, 1.0)), vNormal), 0.0), 32.0);
        color += vec3(specular * 0.5);
        
        color /= n*n + n * 7.;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        timeSpeed: { value: 0.05 },
        scale: { value: 0.5 },
        color1: { value: new THREE.Color(0x585843) },
        color2: { value: new THREE.Color(0x717543) },
        color3: { value: new THREE.Color(0xd2b172) },
        color4: { value: new THREE.Color(0x2b3928) },
        ax: { value: 5 },
        ay: { value: 2.5 },
        az: { value: 5 },
        aw: { value: 7.5 },
        bx: { value: 1 },
        by: { value: -1 },
      },
      vertexShader: sphereVertexShader,
      fragmentShader: sphereFragmentShader,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;

    sphere.position.x = sphereControls.position.x;
    sphere.position.y = sphereControls.position.y;
    sphere.position.z = sphereControls.position.z;
    scene.add(sphere);

    const animateSphere = () => {
      const currentTime = Date.now() - startTimeRef.current;

      sphere.material.uniforms.time.value = currentTime;
      sphere.material.uniforms.timeSpeed.value = sphereControls.timeSpeed;

      sphere.material.uniforms.ax.value = backgroundParams.ax;
      sphere.material.uniforms.ay.value = backgroundParams.ay;
      sphere.material.uniforms.az.value = backgroundParams.az;
      sphere.material.uniforms.aw.value = backgroundParams.aw;
      sphere.material.uniforms.bx.value = backgroundParams.bx;
      sphere.material.uniforms.by.value = backgroundParams.by;

      sphere.material.uniforms.color1.value.setStyle(backgroundParams.color1);
      sphere.material.uniforms.color2.value.setStyle(backgroundParams.color2);
      sphere.material.uniforms.color3.value.setStyle(backgroundParams.color3);
      sphere.material.uniforms.color4.value.setStyle(backgroundParams.color4);

      renderer.render(scene, camera);
      requestAnimationFrame(animateSphere);
    };
    animateSphere();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

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

    Object.entries(backgroundParams).forEach(([key, value]) => {
      if (key.startsWith("color")) {
        gl.uniform3fv(uniforms[key], hexToRgb(value));
      } else {
        gl.uniform1f(uniforms[key], value);
      }
    });

    const gui = new dat.GUI();
    guiRef.current = gui;

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
      gl.uniform1f(uniforms.timeSpeed, backgroundParams.timeSpeed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    render();

    guiRef.current.destroy();

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
    <div>
      <canvas ref={canvasRef} />
      <canvas
        ref={threeCanvasRef}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </div>
  );
};

export default HeroGradient;
