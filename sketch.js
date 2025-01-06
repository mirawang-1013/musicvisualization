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
    p5Canvas = createCanvas(bins, bins);
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
    print(spectrum);

    stroke(255);  
    fill(255);    
    //time domain
    for(let i = 0; i < waveform.length; i++){
        let x = map(i, 0, waveform.length, 0, width);
        let y = height/2+map(waveform[i], -1, 1, -r, r);
        ellipse(x, y, 2, 2);  
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
