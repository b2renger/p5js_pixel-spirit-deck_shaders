

precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538
varying vec2 vTexCoord;

// texture position - stroke position - width
float stroke (float x, float s, float w){
    float d = step(s, x + w*.5) - step (s , x - w*.5);
    return clamp(d, 0.0, 1.0);
}

float fill(float x, float size){
    return 1. - step(size,x);
}

float flip(float v, float pct){
    return mix(v, 1.-v,pct);
}


float circleSDF(vec2 pos, float r){
    return length(pos-.5) - r;
}

float rectSDF(vec2 pos, vec2 s){
    pos = pos*2.-1.;
    return max(abs(pos.x/s.x), abs(pos.y/s.y));
}

float crossSDF(vec2 pos, float s){
    vec2 size = vec2(.25, s);
    return min(rectSDF(pos, size.xy), rectSDF(pos, size.yx));
}

float vesicaSDF(vec2 st, float u, float v){
    vec2 offset = vec2 (0.5*u, .5 * v);
    return max(circleSDF(st - offset, u), circleSDF(st + offset, u ));
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

    float sdf = vesicaSDF(st, .4,.0);

    float sdf2  = step(.5, fract(sdf *.5 ));

    col += abs(flip(fill(sdf2, 0.05) + cos(u_time), 
                step((st.x + st.y )*.5 ,  .5)) );

   // col *= fill(sdf2, .5);
    gl_FragColor = vec4(col, 1.0);
}

