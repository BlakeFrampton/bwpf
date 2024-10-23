let squares = [];
let gravity = 0.5;
let friction = 0.99;
let selectedSquare = null;
let offsetX, offsetY;
let bounciness = 0.5;
let bouncinessSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bouncinessSlider = createSlider(0, 2, 0.5, 0.1);
  bouncinessSlider.position(width - 150, 30);
}

function draw() {
  background(220);

  bounciness = bouncinessSlider.value();

  for (let square of squares) {
    if (!square.isDragging) {
      square.vy += gravity;
      square.vx *= friction;
      square.vy *= friction;

      square.x += square.vx;
      square.y += square.vy;

      if (square.x + square.size > width) {
        square.x = width - square.size;
        square.vx *= -bounciness;
      } else if (square.x < 0) {
        square.x = 0;
        square.vx *= -bounciness;
      }

      if (square.y + square.size > height) {
        square.y = height - square.size;
        square.vy *= -bounciness;
      } else if (square.y < 0) {
        square.y = 0;
        square.vy *= -bounciness;
      }

      for (let other of squares) {
        if (square !== other && isColliding(square, other)) {
          resolveCollision(square, other);
        }
      }
    } else {
      // Record position periodically while dragging
      square.previousPositions.push(createVector(square.x, square.y));
      if (square.previousPositions.length > 5) {
        square.previousPositions.shift();
      }
    }

    square.show();
  }

  // Display the current bounciness value next to the slider
  fill(0);
  noStroke();
  text("Bounciness: " + bounciness.toFixed(1), width - 150, 20);
}

function mousePressed() {
  if (mouseX > bouncinessSlider.x && mouseX < bouncinessSlider.x + bouncinessSlider.width &&
      mouseY > bouncinessSlider.y && mouseY < bouncinessSlider.y + 20) {
    return;
  }

  for (let square of squares) {
    if (mouseX > square.x && mouseX < square.x + square.size && mouseY > square.y && mouseY < square.y + square.size) {
      selectedSquare = square;
      selectedSquare.isDragging = true;
      offsetX = mouseX - square.x;
      offsetY = mouseY - square.y;
      break;
    }
  }

  if (!selectedSquare) {
    squares.push(new Square(mouseX, mouseY, 50));
  }
}

function mouseDragged() {
  if (selectedSquare) {
    selectedSquare.x = mouseX - offsetX;
    selectedSquare.y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (selectedSquare) {
    selectedSquare.isDragging = false;
    if (selectedSquare.previousPositions.length > 1) {
      let lastPosition = selectedSquare.previousPositions[selectedSquare.previousPositions.length - 1];
      let secondLastPosition = selectedSquare.previousPositions[selectedSquare.previousPositions.length - 2];
      selectedSquare.vx = lastPosition.x - secondLastPosition.x;
      selectedSquare.vy = lastPosition.y - secondLastPosition.y;
    }
    selectedSquare.previousPositions = [];
    selectedSquare = null;
  }
}

function isColliding(square1, square2) {
  return (
    square1.x < square2.x + square2.size &&
    square1.x + square1.size > square2.x &&
    square1.y < square2.y + square2.size &&
    square1.y + square2.size > square2.y
  );
}

function resolveCollision(square1, square2) {
  let overlapX = (square1.x + square1.size / 2) - (square2.x + square2.size / 2);
  let overlapY = (square1.y + square1.size / 2) - (square2.y + square2.size / 2);

  if (Math.abs(overlapX) > Math.abs(overlapY)) {
    if (overlapX > 0) {
      square1.x = square2.x + square2.size;
    } else {
      square1.x = square2.x - square1.size;
    }
    square1.vx *= -bounciness;
  } else {
    if (overlapY > 0) {
      square1.y = square2.y + square2.size;
    } else {
      square1.y = square2.y - square1.size;
    }
    square1.vy *= -bounciness;
  }

  if (square1.isDragging) {
    square2.vx += square1.vx;
    square2.vy += square1.vy;
  }
}

class Square {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = 0;
    this.vy = 0;
    this.isDragging = true;
    this.previousPositions = [];
  }

  show() {
    fill(0);
    rect(this.x, this.y, this.size, this.size);
  }
}
