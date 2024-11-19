let rectx;
let recty;
let width;
let height;
let speedy = 1;
let speedx = 1;
let mincolor;
let r;
let g;
let b;
let rstep = 1;
let bstep = 1;
let gstep = 1;
let sw = 50;
let START = false;
let rainbowMode = false;

function sliderChangeSW(val) {
    sw = parseInt(val);
}

function sliderChangeSY(valy) {
    speedy = parseFloat(valy);
}

function sliderChangeSX(valx) {
    speedx = parseFloat(valx);
}

function sliderChangeR(valr) {
    r = parseInt(valr);
}

function sliderChangeG(valg) {
    g = parseInt(valg);
}

function sliderChangeB(valb) {
    b = parseInt(valb);
}

function buttonStart() {
    START = true;
}

function buttonStop() {
    START = false;
}

function toggleRainbowMode() {
    rainbowMode = !rainbowMode;
}

console.log("i got here");

function setup() {
    mincolor = random(70, 155);
    width = windowWidth - 50;
    height = windowHeight - 50;
    createCanvas(width, height);
    frameRate(1000);
    background(0);
    r = random(70, 256);
    g = random(70, 256);
    b = random(70, 256);
    
    // Center the square
    rectx = width / 2 - sw / 2;
    recty = height / 2 - sw / 2;
}

function draw() {
    if (START) {
        if (rainbowMode) {
            r = (sin(frameCount * 0.1) * 127 + 128);
            g = (sin(frameCount * 0.1 + TWO_PI / 3) * 127 + 128);
            b = (sin(frameCount * 0.1 + TWO_PI * 2 / 3) * 127 + 128);
        }

        fill(r, g, b);
        strokeWeight(0);
        rect(rectx, recty, sw, sw);
        if (rectx >= width - sw || rectx <= 0) {
            speedx = -speedx;
        }
        if (recty >= height - sw || recty <= 0) {
            speedy = -speedy;
        }
        rectx += speedx;
        recty += speedy;

        if (!rainbowMode) {
            if (r >= 255) {
                rstep = -1;
            }
            if (g >= 255) {
                gstep = -1;
            }
            if (b >= 255) {
                bstep = -1;
            }
            if (r <= mincolor) {
                rstep = 1;
            }
            if (g <= mincolor) {
                gstep = 1;
            }
            if (b <= mincolor) {
                bstep = 1;
            }
            r = (r + rstep);
            g = (g + gstep);
            b = (b + bstep);
        }
        
        console.log(r, g, b);
    }
}
