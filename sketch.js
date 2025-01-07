let song;
let button;
let fft;
let r = 100;
let smoothing = 0.8; 
let bins = 512;
let isPlaying = false;
let p5Canvas;
let waveform = [];
let spectrum = [];

function preload(){
    song = loadSound("Your Song.mp3", 
        () => console.log('Sound loaded successfully!'),
        (err) => console.error('Error loading sound:', err)
    );
}

function setup(){
    p5Canvas = createCanvas(bins, bins, WEBGL);
    p5Canvas.parent('p5Canvas');
    
    button = createButton('Play');
    button.parent('p5Canvas');
    button.position(10, 10); 
    button.mousePressed(togglePlay);
    fft = new p5.FFT(smoothing, bins);
}

function draw(){
    background(0);
    waveform = fft.waveform();
    spectrum = fft.analyze();
    let vol = fft.getEnergy(20,140);
    
    translate(-width/2, -height/2); // Center for WEBGL mode
    
    // Set color based on volume
    if (vol > 210){
        stroke(250,0,0);
        fill(250,0,0);
    } else {
        stroke(255);
        fill(255);
    }
    
    // Draw frequency bars
    let barWidth = width / spectrum.length;
    for(let i = 0; i < spectrum.length; i++){
        let x = i * barWidth;
        let h = map(spectrum[i], 0, 255, 0, height);
        rect(x, height - h, barWidth, h);
    }

    noStroke();
    textAlign(LEFT, TOP);  
    textSize(20);
    text(isPlaying ? 'Playing' : 'Paused', 70, 13);
}

function togglePlay() {
    if (song.isPlaying()) {
        song.pause();
        button.html('Play');
        isPlaying = false;
    } else {
        song.play();
        button.html('Pause');
        isPlaying = true;
    }
}
