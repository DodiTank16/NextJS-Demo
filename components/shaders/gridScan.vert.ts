// export const gridScanVert = `
// varying vec2 vUv;
// void main() {
//   vUv = uv;
//   gl_Position = vec4(position.xy, 0.0, 1.0);
// }
// `;
    

export const gridScanVert = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
