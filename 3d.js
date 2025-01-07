let size = 50;
let num = 10;
let grid = [];
let fft;
let spectrum = [];
let distanceFromCentre = [];
let smoothing = 0.8;
let bins = 1024;
let isPlaying = false;

let song;
function preload() {
    song = loadSound("Your Song.mp3",
        () => console.log('Sound loaded successfully!'),
        (err) => console.error('Error loading sound:', err)
    );
}

function setup() {
    let canvas = createCanvas(400, 400, WEBGL);
    canvas.parent('p5Canvas');
    fft = new p5.FFT(smoothing, bins);

    // Add click handler for the play button
    let playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function() {
        if (!isPlaying) {
            // Create and resume audio context after user gesture
            getAudioContext().resume().then(() => {
                song.play();
                isPlaying = true;
                this.textContent = 'Pause Music';
            });
        } else {
            song.pause();
            isPlaying = false;
            this.textContent = 'Play Music';
        }
    });

    // Initialize the 3D grid
    let centerX = (num - 1) / 2;
    let centerY = (num - 1) / 2;
    let centerZ = (num - 1) / 2;

    for (let i = 0; i < num; i++) {
        grid[i] = [];
        for (let j = 0; j < num; j++) {
            grid[i][j] = [];
            for (let k = 0; k < num; k++) {
                grid[i][j][k] = floor(random(2));
                let x = i * size;
                let y = j * size;
                let z = k * size;
                let distance = dist(x, y, z, 0, 0, 0);

                distanceFromCentre.push({
                    x, y, z, distance,
                    i, j, k
                });
            }
        }
    }
    distanceFromCentre.sort(compareDistances);
}

function compareDistances(a, b) {
    return a.distance - b.distance;
}

function draw() {
    clear();
    orbitControl();
    
    if (isPlaying) {
        spectrum = fft.analyze();
        let totalCubes = num * num * num;
        
        // Map spectrum values to grid
        for (let i = 0; i < totalCubes && i < spectrum.length; i++) {
            let pos = distanceFromCentre[i];
            let value = spectrum[i];
            grid[pos.i][pos.j][pos.k] = value > 128 ? 1 : 0;
        }
    }

    let offset = size/2 - num/2 * size;
    translate(offset, offset, offset);

    // Draw the grid of boxes
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
            for (let k = 0; k < num; k++) {
                push();
                translate(i * size, j * size, k * size);
                if (grid[i][j][k] == 1) {
                    // First draw solid red cube
                    fill(255, 0, 0);
                    noStroke();
                    box(size - size/4);
                    // Then draw white wireframe
                    stroke(255);
                    strokeWeight(2);
                    noFill();
                    box(size - size/4);
                } else {
                    // Semi-transparent white cube with wireframe
                    fill(255, 255, 255, 30);  // White with 30/255 alpha
                    noStroke();
                    box(size - size/4);
                    stroke(255);
                    strokeWeight(2);
                    noFill();
                    box(size - size/4);
                }
                pop();
            }
        }
    }
}