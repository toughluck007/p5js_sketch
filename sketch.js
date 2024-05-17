let stars = [];
let shaderProgram;
let font;

function preload() {
  // Load the shader files
  shaderProgram = loadShader('vertex.vert', 'fragment.frag');
  // Load the font file
  font = loadFont('PixelifySans-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  createStars(1000); // Adjust the number of stars for the space background
  textFont(font); // Set the loaded font
  textSize(32); // Set text size for better visibility
  textAlign(CENTER, CENTER); // Center align the text
}

function draw() {
  background(0);

  // Draw stars
  drawStars();

  // Use the shader program
  shader(shaderProgram);
  shaderProgram.setUniform('uTime', frameCount * 0.01);
  shaderProgram.setUniform('uLightPosition', [0.0, 0.0, 500.0]);

  // Draw and rotate the sphere with the shader
  push();
  rotateY(frameCount * 0.01);
  sphere(100);
  pop();

  // Calculate the screen position of the sphere's center
  let sphereScreenPos = createVector(0, 0, 0);
  let sphereScreenPosProj = getScreenPosition(sphereScreenPos);
  let offsetY = 150;

  // Render text
  resetMatrix(); // Reset matrix to draw 2D text
  ortho(); // Switch to orthographic projection
  fill(0, 255, 0);

  // Draw "PENTAQUARK" above the sphere
  text('PENTAQUARK', sphereScreenPosProj.x, sphereScreenPosProj.y - offsetY);
  // Draw "FM" below the sphere
  text('FM', sphereScreenPosProj.x, sphereScreenPosProj.y + offsetY);
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

function drawStars() {
  for (let star of stars) {
    push();
    translate(star.x, star.y, star.z);
    fill(255);
    noStroke();
    sphere(1);
    pop();
  }
}
