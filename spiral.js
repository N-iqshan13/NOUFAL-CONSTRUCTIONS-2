/* =====================================================================
   Hero spiral shader — Three.js neon "Galactic Spiral"
   Mounts a full-bleed WebGL canvas into #hero-shader.
   Ported from the React/Three component to vanilla ES module.
   ===================================================================== */
import * as THREE from "three";

const container = document.getElementById("hero-shader");

if (container) {
  const vertexShader = `
    void main() {
      gl_Position = vec4( position, 1.0 );
    }
  `;

  const fragmentShader = `
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359

    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    vec3 getColor(float intensity) {
        vec3 color1 = vec3(1.0, 0.05, 0.25); // Neon Red/Pink
        vec3 color2 = vec3(1.0, 0.4, 0.0);   // Neon Orange
        vec3 color3 = vec3(1.0, 1.0, 0.0);   // Neon Yellow
        vec3 color4 = vec3(0.1, 1.0, 0.1);   // Neon Green
        vec3 color5 = vec3(0.2, 0.5, 1.0);   // Neon Blue
        vec3 color6 = vec3(0.7, 0.0, 1.0);   // Neon Indigo/Purple
        vec3 color7 = vec3(1.0, 0.0, 0.7);   // Neon Magenta

        vec3 finalColor = color1;
        finalColor = mix(finalColor, color2, smoothstep(0.0, 0.17, intensity));
        finalColor = mix(finalColor, color3, smoothstep(0.17, 0.34, intensity));
        finalColor = mix(finalColor, color4, smoothstep(0.34, 0.51, intensity));
        finalColor = mix(finalColor, color5, smoothstep(0.51, 0.68, intensity));
        finalColor = mix(finalColor, color6, smoothstep(0.68, 0.85, intensity));
        finalColor = mix(finalColor, color7, smoothstep(0.85, 1.0, intensity));

        return finalColor;
    }

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time*0.05;
      float lineWidth = 0.003;

      float radius = length(uv);
      float angle = atan(uv.y, uv.x);

      float total_intensity = 0.0;

      for(int i=0; i < 5; i++){
        float spiral_pattern = radius * 2.0 + angle * 0.5;
        total_intensity += lineWidth*float(i*i) / abs(fract(t + float(i)*0.02)*5.0 - spiral_pattern + mod(uv.x+uv.y, 0.2));
      }

      vec3 finalColor = getColor(fract(total_intensity * 0.25 + t * 0.1));
      gl_FragColor = vec4(finalColor * total_intensity, 1.0);
    }
  `;

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  scene.add(new THREE.Mesh(geometry, material));

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const resize = () => {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
  };
  resize();
  window.addEventListener("resize", resize, false);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    // Accessibility: render a single static frame, no animation loop.
    uniforms.time.value = 30.0;
    renderer.render(scene, camera);
  } else {
    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();
  }
}
