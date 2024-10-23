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
    }

    square.show();
  }
}

function mousePressed() {
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
    selectedSquare = null;
  }
}

function isColliding(square1, square2) {
  return (
    square1.x < square2.x + square2.size &&
    square1.x + square1.size > square2.x &&
    square1.y < square2.y + square2.size &&
    square1.y + square1.size > square2.y
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
}

class Square {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.isDragging = false;
  }

  show() {
    fill(0);
    rect(this.x, this.y, this.size, this.size);
  }
}
