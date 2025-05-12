"use strict";
// Import p5 types
/// <reference path="../node_modules/@types/p5/global.d.ts" />
let tileSize = 25;
let gridWidth = 0;
let gridHeight = 0;
let grid = [];
function setup() {
    angleMode(RADIANS);
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    createCanvas(tileSize * 20, tileSize * 20);
    // gridWidth = width/tileSize;
    // gridHeight = height/tileSize;
    gridWidth = tileSize * 20;
    gridHeight = tileSize * 20;
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            grid[i][j] = { filled: false, color: "" };
        }
    }
    frameRate(5);
}
function draw() {
    drawGrid();
    for (let col = 0; col < gridWidth; col++) {
        for (let row = gridHeight - 1; row > 0; row--) {
            updateTile({ x: col, y: row });
            // drawTile({x: col, y: row});
        }
    }
}
function drawGrid() {
    push();
    strokeWeight(1);
    stroke(150);
    for (let col = 0; col < gridWidth; col++) {
        line(col * tileSize, height, col * tileSize, 0);
    }
    for (let row = gridHeight; row > 0; row--) {
        line(0, row * tileSize, width, row * tileSize);
    }
    pop();
}
function updateTile(coord) {
    let tile = grid[coord.x][coord.y];
    if (tile.filled) {
        if (coord.y < Math.floor(gridHeight)) {
            let tileBelow = grid[coord.x][coord.y + 1];
            if (!tileBelow.filled) {
                tileBelow.filled = true;
                tileBelow.color = tile.color;
                tile.filled = false;
                drawTile(coord);
                drawTile({ x: coord.x, y: coord.y - 1 });
            }
        }
    }
}
function drawTile(coord) {
    push();
    strokeWeight(0);
    let tile = grid[coord.x][coord.y];
    if (tile.filled) {
        fill("#C2B280");
        square(coord.x * tileSize, coord.y * tileSize + 2, tileSize);
    }
    else {
        fill(255);
        square(coord.x * tileSize, coord.y * tileSize + 2, tileSize);
    }
    pop();
}
function mouseClicked() {
    let clickCoord = { x: mouseX, y: mouseY };
    let gridCoord = globalToGridCoordinate(clickCoord);
    let tile = grid[gridCoord.x][gridCoord.y];
    if (tile.filled == false) {
        tile.filled = true;
        tile.color = "#C2B280";
        drawTile(gridCoord);
    }
}
function mouseDragged() {
    let clickCoord = { x: mouseX, y: mouseY };
    let gridCoord = globalToGridCoordinate(clickCoord);
    if (inBounds(gridCoord)) {
        let tile = grid[gridCoord.x][gridCoord.y];
        if (tile.filled == false) {
            tile.filled = true;
            tile.color = "#C2B280";
            drawTile(gridCoord);
        }
    }
}
function globalToGridCoordinate(globalCoord) {
    let gridCoord = { x: Math.floor(globalCoord.x / tileSize), y: Math.floor(globalCoord.y / tileSize) };
    return gridCoord;
}
function inBounds(gridCoord) {
    if (gridCoord.x > gridWidth || gridCoord.x < 0) {
        return false;
    }
    if (gridCoord.y > gridHeight || gridCoord.y < 0) {
        return false;
    }
    return true;
}
