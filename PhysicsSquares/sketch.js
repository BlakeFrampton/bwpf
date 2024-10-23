let squares = [];
let gravity = 0.5;
let friction = 0.99;
let selectedSquare = null;
let offsetX, offsetY;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let square of squares) {
    if (!square.isDragging) {
      square.vy += gravity;
      square.vx *= friction;
      square.vy *= friction;

      square.x += square.vx;
      square.y += square.vy;

      if (square.x + square.size > width) {
        square.x = width - square.size;
        square.vx *= -1;
      } else if (square.x < 0) {
        square.x = 0;
        square.vx *= -1;
      }

      if (square.y + square.size > height) {
        square.y = height - square.size;
        square.vy *= -1;
      } else if (square.y < 0) {
        square.y = 0;
        square.vy *= -1;
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
}

function mousePressed() {
  handlePress(mouseX, mouseY);
}

function mouseDragged() {
  handleDrag(mouseX, mouseY);
}

function mouseReleased() {
  handleRelease();
}

function touchStarted() {
  handlePress(touchX, touchY);
}

function touchMoved() {
  handleDrag(touchX, touchY);
}

function touchEnded() {
  handleRelease();
}

function handlePress(x, y) {
  for (let square of squares) {
    if (x > square.x && x < square.x + square.size && y > square.y && y < square.y + square.size) {
      selectedSquare = square;
      selectedSquare.isDragging = true;
      offsetX = x - square.x;
      offsetY = y - square.y;
      break;
    }
  }

  if (!selectedSquare) {
    squares.push(new Square(x, y, 50));
  }
}

function handleDrag(x, y) {
  if (selectedSquare) {
    selectedSquare.x = x - offsetX;
    selectedSquare.y = y - offsetY;
  }
}

function handleRelease() {
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
    square1.vx *= -1;
  } else {
    if (overlapY > 0) {
      square1.y = square2.y + square2.size;
    } else {
      square1.y = square2.y - square1.size;
    }
    square1.vy *= -1;
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
