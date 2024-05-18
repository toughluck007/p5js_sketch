let stars = [];
let shaderProgram;
let font;
let gl;
let starsFbo, sphereFbo;

function preload() {
  // Load the shader files
  shaderProgram = loadShader('vertex.vert', 'fragment.frag');
  // Load the font file
  font = loadFont('SourceCodePro-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  createStars(1000); // Adjust the number of stars for the space background

  // Setup the font and text properties for the main canvas
  textFont(font); 
  textSize(32); 
  textAlign(CENTER, CENTER);

  // Create framebuffers
  starsFbo = createGraphics(width, height, WEBGL);
  sphereFbo = createGraphics(width, height, WEBGL);

  // Setup the font and text properties for the framebuffers
  starsFbo.textFont(font);
  starsFbo.textSize(32);
  starsFbo.textAlign(CENTER, CENTER);
  sphereFbo.textFont(font);
  sphereFbo.textSize(32);
  sphereFbo.textAlign(CENTER, CENTER);

  // Enable depth testing
  gl = this._renderer.GL;
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  // Set color mode to HSB for both framebuffers
  colorMode(HSB, 360, 100, 100);
  starsFbo.colorMode(HSB, 360, 100, 100);
  sphereFbo.colorMode(HSB, 360, 100, 100);
}

function draw() {
  // Calculate hue based on frame count to cycle through colors
  let hue = (frameCount * 0.5) % 360;

  // Render stars to framebuffer
  starsFbo.background(0, 0, 0, 0); // Ensure transparency
  starsFbo.clear(); // Clear the buffer
  drawStarsToBuffer(starsFbo);

  // Render sphere and text to framebuffer
  sphereFbo.background(0, 0, 0, 0); // Ensure transparency
  sphereFbo.clear(); // Clear the buffer

  // Sphere color based on hue
  let sphereColor = color(hue, 100, 100);
  let sphereColorRGB = [red(sphereColor) / 255, green(sphereColor) / 255, blue(sphereColor) / 255];

  // Use the shader program for the sphere
  sphereFbo.shader(shaderProgram);
  shaderProgram.setUniform('uTime', frameCount * 0.01);
  shaderProgram.setUniform('uLightPosition', [0.0, 0.0, 500.0]);
  shaderProgram.setUniform('uColor', sphereColorRGB);

  // Draw and rotate the sphere with the shader and color cycling
  sphereFbo.push();
  sphereFbo.rotateY(frameCount * 0.01);
  sphereFbo.sphere(100);
  sphereFbo.pop();

  // Reset shader to default for text drawing
  sphereFbo.resetShader();

  // Calculate the screen position of the sphere's center
  let sphereScreenPos = createVector(0, 0, 0);
  let sphereScreenPosProj = getScreenPosition(sphereScreenPos);
  let offsetY = 150;

  // Render text with color cycling
  sphereFbo.resetMatrix(); // Reset matrix to draw 2D text
  sphereFbo.ortho(); // Switch to orthographic projection
  sphereFbo.fill(hue, 100, 100);

  // Draw "PENTAQUARK" above the sphere
  sphereFbo.text('PENTAQUARK', sphereScreenPosProj.x, sphereScreenPosProj.y - offsetY);
  // Draw "FM" below the sphere
  sphereFbo.text('FM', sphereScreenPosProj.x, sphereScreenPosProj.y + offsetY);

  // Render the framebuffers to the main canvas
  background(0);
  image(starsFbo, -width / 2, -height / 2, width, height);
  image(sphereFbo, -width / 2, -height / 2, width, height);

  // Check for WebGL errors
  let error = gl.getError();
  if (error !== gl.NO_ERROR) {
    console.error('WebGL Error:', error);
  }
}

function getScreenPosition(pos) {
  // Get the model view and projection matrices
  let mvMatrix = _renderer.uMVMatrix;
  let pMatrix = _renderer.uPMatrix;

  // Apply the model view matrix
  let mvResult = applyMatrixToVector(mvMatrix, [pos.x, pos.y, pos.z, 1.0]);

  // Apply the projection matrix
  let pResult = applyMatrixToVector(pMatrix, mvResult);

  // Perform the perspective divide
  let w = pResult[3];
  let x = (pResult[0] / w) * 0.5 + 0.5;
  let y = (pResult[1] / w) * -0.5 + 0.5;

  // Convert to screen coordinates
  x *= width;
  y *= height;

  return createVector(x, y);
}

function applyMatrixToVector(matrix, vec) {
  let result = [];
  for (let i = 0; i < 4; i++) {
    result[i] = 0;
    for (let j = 0; j < 4; j++) {
      result[i] += matrix[i * 4 + j] * vec[j];
    }
  }
  return result;
}

function createStars(num) {
  for (let i = 0; i < num; i++) {
    stars.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-width, width)
    });
  }
}

function drawStarsToBuffer(buffer) {
  buffer.push();
  for (let star of stars) {
    buffer.push();
    buffer.translate(star.x, star.y, star.z);
    buffer.fill(255); // Keep the stars white
    buffer.noStroke();
    buffer.sphere(1);
    buffer.pop();
  }
  buffer.pop();
}
