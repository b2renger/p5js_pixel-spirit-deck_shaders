

precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538
varying vec2 vTexCoord;


float stroke (float x, float s, float w){
    float d = step(s, x + w*.5) - step (s , x - w*.5);
    return clamp(d, 0.0, 1.0);
}

float fill(float x, float size){
    return 1. - step(size,x);
}


float circleSDF(vec2 pos, float r){
    return length(pos) - r;
}

float rectSDF(vec2 pos, vec2 s){
    pos = pos*2.-1.;
    return max(abs(pos.x/s.x), abs(pos.y/s.y));
}

float crossSDF(vec2 pos, float s){
    vec2 size = vec2(.25, s);
    return min(rectSDF(pos, size.xy), rectSDF(pos, size.yx));
}

void main() {

   
   vec2 st = gl_FragCoord.xy/u_resolution;
    st = (st-.5)*1.1912+.5;
    if (u_resolution.y > u_resolution.x ) {
        st.y *= u_resolution.y/u_resolution.x;
        st.y -= (u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x;
    } else {
        st.x *= u_resolution.x/u_resolution.y;
        st.x -= (u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y;
    }

    vec3 col = vec3(.0);

    float rect = rectSDF(st , vec2(.95)) ;
    col += fill(rect, 1.);

    float cross = crossSDF(st,.95);
    col *= step(.5, fract(cross *1. * (cos(u_time)*0.5 + .5)));
    col *= step(1.0, cross );

    col+= fill(cross, 1.);
    col+= stroke(rect, 1.05, .05);
     col+= stroke(rect, 1.15, .025);
 
    gl_FragColor = vec4(col, 1.0);
}

