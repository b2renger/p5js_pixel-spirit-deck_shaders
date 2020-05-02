

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


float circleSDF(vec2 pos, float r){
    return length(pos) - r;
}


float rectSDF(vec2 pos, vec2 s){
    pos = pos*2.-1.;
    return max(abs(pos.x/s.x), abs(pos.y/s.y));
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

    float sdf = rectSDF(st * vec2(1.,1.) , vec2(1.)) ;
    col += stroke(sdf, .65, .15);

    col += vec3(1.,0.1,0.15) * fill(sdf, .125) ;
    col += fill(sdf, .125) *(sin(u_time)*sin(u_time*3.14)*0.5 + .5);
 
    gl_FragColor = vec4(col, 1.0);
}

