
/** 
 * open high hat
 * Glockenspiel.mp3
 * Band: 
 * peak: 
 */

let bells 
let song
const bellBands = [{
    band: 23,
    value: 155,
}, {
    band: 27,
    value: 155,
}, {
    band: 26,
    value: 155,
}];


function preload(){
    bells  = loadSound('15_42/Glockenspiel.mp3');
    song = loadSound('1542.mp3');
}

let canvas;
let button;
let bells_fft;

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    bells.disconnect();
    // song.disconnect();

    bells_fft = new p5.FFT()
    bells_fft.setInput(bells);
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

function checkBells(){
    let bells_spectrum = bells_fft.analyze();
    bellBands.forEach(element => {
        let bellsValue = bells_spectrum[element.band];
        
    })
    let hh_value = bells_spectrum[38];
    console.log(hh_value);
    // hh_value größere Ausschläge als lastHHval
    if(lastHHval > hh_value){
        if(direction_hh > 0 && lastHHval > 110){
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
        bells.pause();
    }else{
        song.play();
        bells.play();
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
//     constructor(x,y,r) {
//         this.x = r * cos(a);
//         this.y = r * sin(a);
//         // this.speed = 0.8;
//         // this.accel = 5;
//     }
//     show(){
//         push();
//         ellipseMode(CENTER);
//         stroke(100);
//         strokeweight(3);
//         fill(100);
//         ellipse(this.x, this.y)
//      }
// }

//     // update(){
//     //     this.y += this.speed;
//     //     this.speed *= this.accel;
//     // }


class Glockenspiel {
    constructor() {
      this.x = random(width);
      this.y = random(height);
      this.diameter = random(10, 30);
      this.speed = 1;
    }
  
    move() {
      this.x += random(-this.speed, this.speed);
      this.y += random(-this.speed, this.speed);
    }
  
    display() {
      ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }
  