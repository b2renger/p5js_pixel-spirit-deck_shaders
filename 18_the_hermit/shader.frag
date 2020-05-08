

precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vTexCoord;

#define PI 3.1415926538

//////////////////////////////////////////////////////////
// DRAWING
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
//////////////////////////////////////////////////////////
// SDF
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

float vesicaSDF(vec2 st, float u){
    vec2 offset = vec2 (0.5*u);
    return max(circleSDF(st - offset, u), circleSDF(st + offset, u ));
}

float triSDF(vec2 st){
    st = (st*2. -1.)*2.;
    return max(abs(st.x)*0.866025 + st.y * 0.5, -st.y*0.5);
}

float rhombSDF(vec2 st){
    return max(triSDF(st), triSDF(vec2(st.x , 1. - st.y)));

}
//////////////////////////////////////////////////////////
// GEOMETRY
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
/*
st -= vec2(0.5);// move space from the center to the vec2(0.0)
st = rotate2d( (pow(sin(u_time), 13.) * PI *1./3.  + PI/3.) ) * st; // // rotate the space
st += vec2(0.5); // move it back to the original place
// use sdf to draw something
*/

//////////////////////////////////////////////////////////
// MAIN SHADER
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
    
    float sdf = rhombSDF(vec2(st.x , st.y));

    float tri = triSDF(st);

    for(float i=1.;i<15.;++i){ 
         st.xy+=sin( sin(st.yx*vec2(10.,1.) + u_time * i/15. )*6.5
                        + u_time*2.5/i ) * vec2(.0015,.0015);
    }
   
    float rhomb = rhombSDF(st);

    col += flip (fill(tri, .5) , fill(rhomb ,.4));
    

    gl_FragColor = vec4(col, 1.0);
}

