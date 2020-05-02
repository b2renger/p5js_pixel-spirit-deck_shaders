//https://patriciogonzalezvivo.github.io/PixelSpiritDeck/
let shad;

function preload() {
    // load the shader definitions from files
    shad = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // use the shader
    shader(shad);
    noStroke();

    shad.setUniform('w', windowWidth)
    shad.setUniform('h', windowHeight)

}

function draw() {
    background(0)

    shad.setUniform("u_mouse", [
        map(mouseX, 0, width, 0, 1.),
        map(mouseY, 0, height, 0, 1.)])
    shad.setUniform('u_time', millis()/ 1000)
    //mandel.setUniform('gamma', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    shad.setUniform('w', windowWidth)
    shad.setUniform('h', windowHeight)

}
