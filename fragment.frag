// Fragment shader
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uLightPosition;

void main() {
  // Normalize the normal and the light direction
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vPosition);

  // Calculate the diffuse lighting
  float diff = max(dot(normal, lightDir), 0.0);

  // Calculate a basic gradient color
  vec3 color = vec3(0.0, 1.0, 0.0) * (0.5 + 0.5 * sin(vPosition.y * 10.0 + uTime));

  // Apply the lighting to the color
  color *= diff;

  gl_FragColor = vec4(color, 1.0);
}
