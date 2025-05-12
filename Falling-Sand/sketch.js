"use strict";
// Import p5 types
/// <reference path="../node_modules/@types/p5/global.d.ts" />
const radius = 25;
const tileSize = 1;
let sandHue = 1;
let gridWidth = 0;
let gridHeight = 0;
let grid = [];
let activeTiles = new Set();
function setup() {
    angleMode(RADIANS);
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    createCanvas(width, height);
    gridWidth = Math.floor(width / tileSize);
    gridHeight = Math.floor(height / tileSize);
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            grid[i][j] = { filled: false, color: "", buried: false };
        }
    }
    colorMode(HSB, 360, 100, 100); // Use hue-saturation-brightness with max hue 360
    // frameRate(60);
}
function draw() {
    sandHue += 0.1;
    sandHue = (sandHue) % 360;
    let currentActiveTiles = new Set(activeTiles); //Make a copy so I don't loop over newly added active tiles
    for (let coord of currentActiveTiles) {
        updateTile(coord);
    }
    // requestAnimationFrame(draw);
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
    if (tile.filled && !tile.buried && coord.y < gridHeight - 1) {
        // Check below and adjacent tiles for fall
        let directions = [
            { x: coord.x, y: coord.y + 1 }, // Directly below
            { x: coord.x + Math.sign(Math.random() - 0.5), y: coord.y + 1 }, // Right/left
            { x: coord.x - Math.sign(Math.random() - 0.5), y: coord.y + 1 }, // Left/Right
        ];
        for (let dir of directions) {
            if (isFree(dir)) {
                swapTiles(coord, dir);
                return; // Exit once the tile has moved
            }
        }
        // If no movement is possible, check if buried
        if (grid[coord.x][coord.y + 1].buried && isOccupied({ x: coord.x, y: coord.y - 1 })) {
            tile.buried = true;
        }
    }
}
function isOccupied(coord) {
    if (coord.x < 0 || coord.x > gridWidth - 1) {
        return false;
    }
    if (coord.y < 0 || coord.y > gridHeight - 1) {
        return false;
    }
    if (grid[coord.x][coord.y].filled) {
        return true;
    }
    return false;
}
function isFree(coord) {
    if (coord.x < 0 || coord.x > gridWidth - 1) {
        return false;
    }
    if (coord.y < 0 || coord.y > gridHeight - 1) {
        return false;
    }
    if (!grid[coord.x][coord.y].filled) {
        return true;
    }
    return false;
}
function swapTiles(coord1, coord2) {
    let tile1 = grid[coord1.x][coord1.y];
    let tile2 = grid[coord2.x][coord2.y];
    let temp = { filled: false, color: "", buried: false };
    temp.filled = tile1.filled;
    temp.color = tile1.color;
    tile1.filled = tile2.filled;
    tile1.color = tile2.color;
    tile2.filled = temp.filled;
    tile2.color = temp.color;
    filterTile(coord1);
    filterTile(coord2);
    if (tile1.filled) {
        activeTiles.add(coord1);
    }
    if (tile2.filled) {
        activeTiles.add(coord2);
    }
    drawTile(coord1);
    drawTile(coord2);
}
function filterTile(coord) {
    // activeTiles = activeTiles.filter(el => !(el.x === coord.x && el.y === coord.y));
    activeTiles.delete(coord);
}
function drawTile(coord) {
    push();
    strokeWeight(0);
    let tile = grid[coord.x][coord.y];
    if (tile.filled) {
        fill(tile.color);
    }
    else {
        fill(255);
    }
    square(coord.x * tileSize, coord.y * tileSize + 2, tileSize);
    pop();
}
function mouseClicked() {
    placeSand();
}
function mouseDragged() {
    placeSand();
}
function placeSand() {
    let clickCoord = { x: mouseX, y: mouseY };
    let gridCoord = globalToGridCoordinate(clickCoord);
    if (inBounds(gridCoord)) {
        for (let i = gridCoord.x - Math.floor(radius / 2); i < gridCoord.x + Math.floor(radius / 2); i++) {
            for (let j = gridCoord.y - Math.floor(radius / 2); j < gridCoord.y + Math.floor(radius / 2); j++) {
                let tileCoord = { x: i, y: j };
                if (inBounds(tileCoord)) {
                    let tile = grid[tileCoord.x][tileCoord.y];
                    if (!tile.filled && random() > 0.95) {
                        tile.filled = true;
                        tile.color = getCurrentColour();
                        drawTile(tileCoord);
                        activeTiles.add(tileCoord);
                    }
                }
            }
        }
    }
}
function getCurrentColour() {
    let c = color(sandHue, 100, 100);
    let hexString = "#" + [red(c), green(c), blue(c)]
        .map((n) => {
        let hex = Math.round(n).toString(16);
        return hex.length === 1 ? "0" + hex : hex; // Ensure the hex string is at least 2 characters long by padding
    })
        .join('');
    return hexString;
}
function globalToGridCoordinate(globalCoord) {
    let gridCoord = { x: Math.floor(globalCoord.x / tileSize), y: Math.floor(globalCoord.y / tileSize) };
    return gridCoord;
}
function inBounds(gridCoord) {
    if (gridCoord.x >= gridWidth || gridCoord.x < 0) {
        return false;
    }
    if (gridCoord.y >= gridHeight || gridCoord.y < 0) {
        return false;
    }
    return true;
}
