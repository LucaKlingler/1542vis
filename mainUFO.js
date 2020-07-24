
/** 
 * open high hat
 * drums.mp3
 * Band: 6
 * peak: ca 200
 */

let drums 
let song
let ball_array = []


function preload(){
    drums  = loadSound('15_42/UFO.mp3');
    song = loadSound('1542.mp3');
}

let canvas;
let button;
let drums_fft;

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    drums.disconnect();
    // song.disconnect();

    drums_fft = new p5.FFT()
    drums_fft.setInput(drums);
}

function draw(){
    background(0);
    checkHH();

    //für jede Instanz wird neue Position des Ball gezeichnet
    ball_array.forEach(function (ball){
        ball.update();
        ball.show();
    })
}

let lastHHval = 0;
// Richtungsvariable der Kurve
let direction_hh = 1;

function checkHH(){
    let drums_spectrum = drums_fft.analyze();
    
    let hh_value = drums_spectrum[11,12,13,14,15,21,22,23,24,25];
    console.log(hh_value);
    // hh_value größere Ausschläge als lastHHval
    if(lastHHval > hh_value){
        if(direction_hh > 0 && lastHHval > 140){
            let ball = new Ball(50, 50);
            ball_array.push(ball);
        }

        direction_hh = -1;
    }else{
        direction_hh = 1;
    }

    console.log(direction_hh);
    lastHHval = hh_value;
}

function toggleSong(){
    if(song.isPlaying()){
        song.pause();
        drums.pause();
    }else{
        song.play();
        drums.play();
    }
}


class Ball{
    constructor(x, y, r = 20){
        this.x = 100;
        this.y = 100;
        this.r = 100;
        this.speed = 0.8;
        this.accel = 1;
    }
    
    // zeichnet Funktion in der Klasse
    show(){
        push();
        stroke(255);
        strokeWeight(3);
        fill(100);
        ellipse(this.x, this.y, this.r * 5);
        pop();
    }
    // Position + Geschwindigkeit wird berechnet
    update(){
        this.y += this.speed;
        this.speed *= this.accel;
    }
}

// let r = (0, 1, 100, 200);

// class UFO{
//     constructor(style) {
//         this.x = r * cos(a);
//         this.y = r * sin(a);
//         this.speed = 0.8;
//         this.accel = 5;
//     }
//     // show(){
//     //     push();
//     //     ellipseMode(CENTER);
//     //     stroke(100);
//     //     strokeweight(3);
//     //     fill(100);
//     //     ellipse(this.x, this.y)
//     //  }
// // }

// //     update(){
// //         this.y += this.speed;
// //         this.speed *= this.accel;
// //     }