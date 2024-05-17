// Vertex shader
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
  vNormal = mat3(uModelViewMatrix) * aNormal;
  gl_Position = uProjectionMatrix * vec4(vPosition, 1.0);
}
