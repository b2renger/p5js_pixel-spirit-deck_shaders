

precision mediump float;



uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538

// currentime / start / stop / duration
float bounceEaseOut(float t, float b, float c, float d){
        if ((t /= d) < (1. / 2.75))
            return c * (7.5625 * t * t) + b;
        else if (t < (2. / 2.75))
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        else if (t < (2.5 / 2.75))
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        else
            return c  + b;
}

// texture position - stroke position - width
float stroke( float x, float s, float w){
    float d = step(s, x + w*.5) - step (s , x - w*.5);
    return clamp(d, 0.0, 1.0);
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

    float b1 =  .5; // horizontal alignement
    float t = mod(u_time,7.);
   
    float b2 = bounceEaseOut(t, 2., -1.5, 5. );
    st.y -= b2;

   

    float d = stroke((st.x - st.y * b2 *2.5 ), b1 ,  0.1);
    col +=  d;

    d = stroke((st.x + st.y *b2 *2.5 ), b1 ,  0.1);
    col +=  d;

   

    
    gl_FragColor = vec4(col,1.0);
}

