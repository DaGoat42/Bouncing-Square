let width;
let height;
let speedy = 1;
let speedx = 1;
let mincolor;
let r = 200;
let g = 120;
let b = 80;
let rstep = 1;
let bstep = 1;
let gstep = 1;
let sw = 50;
let START = false;
let rainbowMode = false;
let clearFrame = false;
let bounceSound;
let shapes = [];
let selectedShapeType = 'square';

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

function setShapeType(type) {
    selectedShapeType = type;
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

function toggleClearFrame() {
    clearFrame = !clearFrame;
}

function randomColor() {
    return {
        r: random(60, 255),
        g: random(60, 255),
        b: random(60, 255),
    };
}

function addShape(type = selectedShapeType) {
    const color = rainbowMode ? randomColor() : { r, g, b };
    const x = random(30, Math.max(40, width - 160));
    const y = random(30, Math.max(40, height - 160));
    const baseSpeedX = speedx || 1.2;
    const baseSpeedY = speedy || 1.2;

    let entity;

    if (type === 'rectangle') {
        entity = createEntity('rectangle', x, y, {
            width: Math.max(35, sw * random(1.5, 2.7)),
            height: Math.max(20, sw * random(0.5, 1.1)),
            vx: random(-3, 3) + baseSpeedX,
            vy: random(-3, 3) + baseSpeedY,
            color,
            rotation: random(TWO_PI),
        });
    } else if (type === 'circle') {
        entity = createEntity('circle', x, y, {
            width: Math.max(25, sw),
            height: Math.max(25, sw),
            vx: random(-4, 4) + baseSpeedX,
            vy: random(-4, 4) + baseSpeedY,
            color,
            spin: random(-10, 10),
        });
    } else if (type === 'spring') {
        entity = createEntity('spring', x, y, {
            width: Math.max(45, sw * 1.2),
            height: Math.max(28, sw * 0.8),
            vx: random(-3, 3) + baseSpeedX,
            vy: random(-3, 3) + baseSpeedY,
            color,
            springStretch: 0.2,
            sproing: 0.1,
        });
    } else {
        entity = createEntity('square', x, y, {
            width: sw,
            height: sw,
            vx: random(-3, 3) + baseSpeedX,
            vy: random(-3, 3) + baseSpeedY,
            color,
        });
    }

    shapes.push(entity);
    return entity;
}

function playBounceSound() {
    if (bounceSound && typeof bounceSound.play === 'function') {
        bounceSound.play();
    }
}

function drawSpring(entity) {
    const coilCount = 8;
    const amplitude = 5 + (entity.sproing || 0) * 8 + (entity.springStretch || 0) * 16;
    const widthSpan = entity.width;
    const heightSpan = entity.height;

    push();
    translate(entity.x + entity.width / 2, entity.y + entity.height / 2);
    rotate(entity.rotation || 0);
    stroke(entity.color.r, entity.color.g, entity.color.b, 240);
    strokeWeight(4);
    noFill();

    beginShape();
    for (let i = 0; i <= coilCount; i++) {
        const t = i / coilCount;
        const px = map(t, 0, 1, -widthSpan / 2, widthSpan / 2);
        const py = (i % 2 === 0 ? 1 : -1) * amplitude * (0.8 + (entity.springStretch || 0));
        vertex(px, py);
    }
    endShape();

    strokeWeight(3);
    line(-widthSpan / 2, 0, -widthSpan / 2, heightSpan * 0.5);
    line(widthSpan / 2, 0, widthSpan / 2, heightSpan * 0.5);
    pop();
}

function drawShape(entity) {
    push();
    translate(entity.x + entity.width / 2, entity.y + entity.height / 2);
    rotate(entity.rotation || 0);

    const bodyColor = entity.color;
    const glow = entity.flash || 0;
    const tint = 255 * (1 - glow * 0.6);

    if (entity.type === 'circle') {
        noStroke();
        fill(bodyColor.r, bodyColor.g, bodyColor.b, 240);
        ellipse(0, 0, entity.width * (1 + glow * 0.5), entity.height * (1 + glow * 0.5));

        stroke(255, 255, 255, 80 + glow * 140);
        strokeWeight(2);
        noFill();
        ellipse(0, 0, entity.width * 0.8, entity.height * 0.8);
    } else if (entity.type === 'rectangle') {
        noStroke();
        fill(bodyColor.r, bodyColor.g, bodyColor.b, 220);
        rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
        stroke(255, 255, 255, 80 + glow * 80);
        noFill();
        strokeWeight(2);
        rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
    } else if (entity.type === 'spring') {
        drawSpring(entity);
    } else {
        noStroke();
        fill(bodyColor.r, bodyColor.g, bodyColor.b, 220);
        rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
    }

    if (glow > 0) {
        noFill();
        stroke(tint, tint, tint, 80 + glow * 120);
        strokeWeight(1.5 + glow * 1.5);
        if (entity.type === 'circle') {
            ellipse(0, 0, entity.width * (1.6 + glow), entity.height * (1.6 + glow));
        } else {
            rect(-entity.width / 2 - glow * 8, -entity.height / 2 - glow * 8, entity.width + glow * 16, entity.height + glow * 16);
        }
    }

    pop();
}

function setup() {
    bounceSound = loadSound('Xylophone.wav');
    mincolor = random(70, 155);
    width = windowWidth - 80;
    height = windowHeight - 180;
    createCanvas(width, height);
    frameRate(60);
    background(0);
    r = random(70, 256);
    g = random(70, 256);
    b = random(70, 256);
    shapes.push(createEntity('square', width / 2 - sw / 2, height / 2 - sw / 2, {
        width: sw,
        height: sw,
        vx: speedx,
        vy: speedy,
        color: { r, g, b },
    }));
}

function draw() {
    if (clearFrame) {
        background(0);
    }

    if (rainbowMode) {
        r = sin(frameCount * 0.1) * 127 + 128;
        g = sin(frameCount * 0.1 + TWO_PI / 3) * 127 + 128;
        b = sin(frameCount * 0.1 + TWO_PI * 2 / 3) * 127 + 128;
    }

    if (START) {
        for (let i = 0; i < shapes.length; i++) {
            const previous = { ...shapes[i] };
            const updated = updateEntity(shapes[i], {
                left: 0,
                right: width,
                top: 0,
                bottom: height,
            });

            if (updated.vx !== previous.vx || updated.vy !== previous.vy) {
                playBounceSound();
            }

            shapes[i] = updated;
        }
    }

    for (let i = 0; i < shapes.length; i++) {
        drawShape(shapes[i]);
    }

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
        r = r + rstep;
        g = g + gstep;
        b = b + bstep;
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
        addShape(selectedShapeType);
    }
});
