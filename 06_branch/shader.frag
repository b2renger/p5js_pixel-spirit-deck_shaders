

precision mediump float;



uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538

float stroke( float x, float s, float w){
    float d = step(s, x + w*.5) - step (s , x - w*.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
     vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec3 col = vec3(.0);

    
    float d = stroke( (st.x - st.y ), 0. ,  0.091);
    col +=  d;

    if (st.x > 0.5){
        d = stroke( .75+ (st.x - st.y*2.*st.y*2. )*.5, 0.5 ,  0.151);
        col +=  d * (sin(u_time)+ 1. )*0.5;
    }

    if (st.x > 0.52 && st.y > 0.7){
        d = stroke( (st.x - st.y*0.3), 0.52 ,  0.021);
        col +=  d * (sin(u_time + PI)+ 1. )*0.5;;
    }

    
    gl_FragColor = vec4(col,1.0);
}

