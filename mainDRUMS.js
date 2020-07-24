let bubble;
let bubble2;
let bubble3;
let bubble4;
let bubble5;
let bubble6;
let bubble7;
let bubble8;
let bubble9;

let glockVis;

let rulerSound;
let ruler2Sound;
let drums;
let song;
let glock;
let ball_array = []
let kickVis;
let rattleSound;

function preload() {
    drums = loadSound('15_42/drums.mp3');
    song = loadSound('1542.mp3');
    glock = loadSound('15_42/Glockenspiel.mp3');
    rulerSound = loadSound('15_42/ruler.mp3');
    ruler2Sound = loadSound('15_42/ruler.mp3');
    rattleSound = loadSound('15_42/drums.mp3');

}

let canvas;
let button;
let drums_fft;
let glock_fft;
let rulerSound_fft;
let ruler2Sound_fft;
let rattleSound_fft;

let debugValues = [0, 0, 0];

let testButton

function setup() {
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    testButton = createButton('test');
    testButton.position(100, canvas.height + 10);
    testButton.mousePressed(testFunction);

    ruler = new Ruler(0, 0, "right");
    ruler2 = new Ruler(1920, 0, "left");

    /* bubble = new Bubble();
    bubble2 = new Bubble();
    bubble3 = new Bubble();
    bubble4 = new Bubble();
    bubble5 = new Bubble();
    bubble6 = new Bubble();
    bubble7 = new Bubble();
    bubble8 = new Bubble();
    bubble9 = new Bubble();
 */

    for (let i = 0; i < 10; i++) {
        ball_array.push(new Bubble()); 
    }

    glockVis = new Glock();







    rattleSound.disconnect();
    rulerSound.disconnect();
    ruler2Sound.disconnect();
    drums.disconnect();
    glock.disconnect();
    // song.disconnect();

    kickVis = new Kick();

    canvas.mousePressed(kickSimulation)

    rattleSound_fft = new p5.FFT();
    rattleSound_fft.setInput(rattleSound);
    drums_fft = new p5.FFT();
    drums_fft.setInput(drums);
    glock_fft = new p5.FFT();
    glock_fft.setInput(glock);
    rulerSound_fft = new p5.FFT();
    rulerSound_fft.setInput(rulerSound);
    ruler2Sound_fft = new p5.FFT();
    ruler2Sound_fft.setInput(ruler2Sound);
    
}

function draw() {
    background(32, 0, 42);
    checkRattle();
    checkKick();
    checkGlock();
    checkRuler();
    push();
    fill(255);
    //rect(960, 0, 10, debugValue);
    //console.log(debugValue);
    pop();

    kickVis.update();
    kickVis.show();

    ball_array.forEach(ball => {
        ball.show();
        ball.move();
        ball.update();
    });

   /*  ball_array.forEach(ball => {
        ball.impulse();
    }); */

    ruler.show();
    ruler.update();
    ruler2.show();
    ruler2.update();

    glockVis.show();
    glockVis.update();
}

function testFunction() {
    glockVis.impulse(2);
    ruler.impulse();
    ruler2.impulse();
    ball_array.forEach(ball => {
        ball.impulse();
    });
}

let lastKickval = 1;
// Richtungsvariable der Kurve
let direction_kick = 0;

// Check für Ufo und Glockenspiel
let glockBands = [{
    band: 23,
    peak: 200,
    oldValue: 0,
    direction: 1,
    lastTime: 0
}, {
    band: 27,
    peak: 195,
    oldValue: 0,
    direction: 1,
    lastTime: 0
}, {
    band: 32,
    peak: 175,
    oldValue: 0,
    direction: 1,
    lastTime: 0
}]

let rulerOldValue = 0;
let rulerDirection = 1;

function checkRuler() {
    let ruler_spectrum = rulerSound_fft.analyze();
    let ruler_value = ruler_spectrum[27];
    if (rulerOldValue > ruler_value) {
        if (rulerDirection > 0 && rulerOldValue > 60) {
            ruler.impulse();
            ruler2.impulse();
        }
        rulerDirection = -1;
    } else {
        rulerDirection = 1;
    }
    rulerOldValue = ruler_value;
}
let rattleOldValue = 0;
let rattleDirection = 1;

function checkRattle() {
    // TODO: Fix drums_fft -> rattleSound_fft
    let rattle_spectrum = drums_fft.analyze();
    let rattle_value = rattle_spectrum[7];
    if (rattleOldValue > rattle_value) {
        if (rattleDirection > 0 && rattleOldValue > 30) {
            ball_array.forEach(ball => {
                ball.impulse();
            });
            console.log('impulse');
        }
        rattleDirection = -1;
    } else {
        rattleDirection = 1;
    }
    rattleOldValue = rattle_value;
}

function checkGlock() {
    let glock_spectrum = glock_fft.analyze();
    glockBands.forEach((element, index) => {
        let glockValue = glock_spectrum[element.band];
        if (element.oldValue > glockValue) {

            if (element.direction > 0 && element.oldValue > element.peak && getMillis() - element.lastTime > 600) { //&& element.oldValue > element.peak && getMillis() - element.lastTime > 100
                glockVis.impulse(index);
                element.lastTime = getMillis();

            }
            element.direction = -1
        } else {
            element.direction = 1;
        }
        element.oldValue = glockValue;
    })
    //console.log(debugValues);
}
/*let hh_value = bells_spectrum[38];
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
    lastHHval = hh_value;*/
function checkKick() {
    let drums_spectrum = drums_fft.analyze();

    let kick_value = drums_spectrum[2];
    debugValue = kick_value;
    //console.log(kick_value);
    // kick_value größere Ausschläge als lastKickval
    if (lastKickval < kick_value) {
        if (kick_value == 255) {
            kickVis.impulse();
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
        }
        direction_kick = -1;
    } else {
        direction_kick = 1;
    }

    //console.log(direction_kick);
    lastKickval = kick_value;
}

function toggleSong() {
    if (song.isPlaying()) {
        song.pause();
        drums.pause();
        glock.pause();
        rulerSound.pause();
        ruler2Sound.pause();
    } else {
        setTimeout(function () {
            song.play();
        }, 200);
        drums.play();
        glock.play();
        rulerSound.play();
        ruler2Sound.play();
    }
}


function kickSimulation() {
    kickVis.impulse();
}

function getMillis() {
    return performance.now();
}

class Kick {
    constructor(x, y, r = 20) {
        this.x = width / 2;
        this.y = 300;
        this.r = 200;
        this.defaultR = 200;
        this.speed = 0.8;
        this.accel = 1;
    }

    // zeichnet Funktion in der Klasse
    show() {
        push();
        stroke(188, 0, 81);
        strokeWeight(5);
        noFill();
        ellipse(this.x, this.y, this.r * 2, );
        pop();
    }
    // Position + Geschwindigkeit wird berechnet
    update() {
        if (this.r < this.defaultR) {
            this.r += (this.defaultR - this.r) / 4
        }
    }

    impulse() {
        this.r -= 30;
    }
}



class Bubble {
    constructor() {
        this.x = 960;
        this.y = 300;

        this.xDefault = 960;
        this.yDefault = 300;

        this.alpha= 0;
        this.colorBalls = color(37, 175, 234);

    }

    move() {
        this.x = this.x + random(-2, 2);
        this.y = this.y + random(-2, 2);
    }

    show() {
        stroke(14, 0, 68);
        noStroke();
        this.color = this.colorBalls.setAlpha(this.alpha);
        fill(this.colorBalls);
        ellipse(this.x, this.y, 30, 30);
    }

    update() {
        if (this.alpha > 0) {
            this.alpha -= 10;
        }
    }

    impulse() {
        this.alpha = 200;
    }

}

class Ruler {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.impulseSize = 600;
        this.impulseSpeed = 50;
        this.impulseDir = d;

        this.impulseState = 0;
    }

    show() {
        push();
        noStroke();
        fill(64, 0, 65);
        stroke(188, 0, 81);
        strokeWeight(5);
        switch (this.impulseDir) {
            case 'right':
                rect(this.x, this.y, this.width, 1080);
                break;
            case 'left':
                rect(this.x, this.y, -this.width, 1080);
                break;
            default:
                break;
        }
        pop();
    }

    update() {
        switch (this.impulseState) {
            case 1:
                if (this.width <= this.impulseSize) {
                    this.width += this.impulseSpeed;
                } else {
                    this.impulseState++;
                }
                break;
            case 2:
                if (this.width > 0) {
                    this.width -= this.impulseSpeed;
                } else {
                    this.impulseState = 0;
                }
                break;
            default:
                break;
        }
    }
    impulse() {
        this.impulseState = 1;
    }
}

class Glock {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.alphas = [255, 255, 255];
        this.colors = [color(32, 0, 42), color(32, 0, 42), color(32, 0, 42)];
    }

    show() {
        push();
        stroke(188, 0, 81);
        strokeWeight(5);

        fill(color(140, 0, 207));
        quad(0, 1082, 640, 1082, 895, 550, 640, 550);
        quad(640, 1082, 1280, 1082, 1024, 550, 895, 550);
        quad(1280, 1082, 1920, 1082, 1280, 550, 1024, 550);

        this.colors[0].setAlpha(this.alphas[0]);
        fill(this.colors[0]);
        quad(0, 1082, 640, 1082, 895, 550, 640, 550);

        this.colors[1].setAlpha(this.alphas[1]);
        fill(this.colors[1]);
        quad(640, 1082, 1280, 1082, 1024, 550, 895, 550);

        this.colors[2].setAlpha(this.alphas[2]);
        fill(this.colors[2]);
        quad(1280, 1082, 1920, 1082, 1280, 550, 1024, 550);




        pop();
    }

    update() {
        this.alphas.forEach((alpha, index) => {
            if (alpha < 255) {
                this.alphas[index] -= alpha * 8
            }
        })

    }

    impulse(id) {
        this.alphas[id] = 200;
    }


}