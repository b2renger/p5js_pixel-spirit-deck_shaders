

precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538
varying vec2 vTexCoord;

// styles 
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


// shapes
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

float boxSDF(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}


// geometry
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
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
    float dev =  (sin(u_time )*PI )  ;

    float rect = rectSDF(st , vec2(.7, 1.3)) ;
    vec2 p =  gl_FragCoord.xy/u_resolution.xy;

    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( (sin(u_time)*PI /3. ) ) * st;
    // move it back to the original place
    st += vec2(0.5);


    //float diag = ( .5*(st.x) + st.y*(-.5));
    float diag = boxSDF(st, vec2(.025,4.5));
    
    float flip = 1.0 -flip(  fill(rect, .6), fill(diag,.5  ));
    col+= flip;
    
 
    gl_FragColor = vec4(col, 1.0);
}

