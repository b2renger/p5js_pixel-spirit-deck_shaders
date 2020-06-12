//https://patriciogonzalezvivo.github.io/PixelSpiritDeck/
let shad;

function preload() {
    // load the shader definitions from files
    shad = loadShader('shader.vert', 'shader.frag');
}



function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(1)
    // use the shader
    shader(shad);
    noStroke();

    shad.setUniform("u_resolution", [width, height])

}

function draw() {
    background(0)
   // console.log(millis())

    shad.setUniform("u_mouse", [
        map(mouseX, 0, width, 0, 1),
        map(mouseY, 0, height, 2, 0)])
    shad.setUniform('u_time', millis()/ 1000)
    
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    shad.setUniform("u_resolution", [width, height])

}
