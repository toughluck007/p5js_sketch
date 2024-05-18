// Fragment shader
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
uniform float uTime;
uniform vec3 uLightPosition;

void main() {
  // Normalize the normal and the light direction
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vPosition);

  // Calculate the diffuse lighting
  float diff = max(dot(normal, lightDir), 0.0);

  // Apply the lighting to the color
  vec3 color = vColor * diff;

  gl_FragColor = vec4(color, 1.0);
}
