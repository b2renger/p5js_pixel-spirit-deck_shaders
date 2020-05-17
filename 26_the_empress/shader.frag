
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

float rectSDF2(vec2 p, vec2 size) {  
  vec2 d = abs(p) - size;
  return min(max(d.x, d.y), 0.0) + length(max(d,0.0));
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

float triSDF2(vec2 st, float h){
    st = (st*2. -1.)*2.;
    return max(abs(st.x)*0.866025 + st.y * h, -st.y*h);
}

float rhombSDF(vec2 st){
    return max(triSDF(st), triSDF(vec2(st.x , 1. - st.y)));

}

float boxSDF( vec2 _st, vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float polySDF(vec2 st, int V){
    st = st*2. -1.;
    float a = atan(st.x, st.y) + PI ;
    float r = length(st);
    float v = 2.*PI / float(V);
    return cos(floor(.5+a/v)*v-a)*r;

}

//////////////////////////////////////////////////////////
// GEOMETRY
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 rotate(vec2 st, float a){
    st = mat2(cos(a),-sin(a),
                sin(a),cos(a))*(st - .5);
    return st + .5;
}
/*
st -= vec2(0.5);// move space from the center to the vec2(0.0)
st = rotate2d( (pow(sin(u_time), 13.) * PI *1./3.  + PI/3.) ) * st; // // rotate the space
st += vec2(0.5); // move it back to the original place
// use sdf to draw something
*/


//////////////////////////////////////////////////////////
// NOISE
float hash( float n )
{
    return fract(sin(n)*43558.5453);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0;

    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
}


const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm( vec2 p ){
    float f = 0.0;

    f += 0.50000*noise( p ); p = m*p*2.02;
    f += 0.25000*noise( p ); p = m*p*2.03;
    f += 0.12500*noise( p ); p = m*p*2.01;
    f += 0.06250*noise( p ); p = m*p*2.04;
    f += 0.03125*noise( p );

    return f/0.984375;
}
//////////////////////////////////////////////////////////
// EASING

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

// currentime / start / stop / duration
float easeInOutExpo(float t, float b, float c, float d) {
		if (t==0.) return b;
		if (t==d) return b+c;
		if ((t/=d/2.) < 1.) return c/2. * pow(2., 10. * (t - 1.)) + b;
		return c/2. * (-pow(2., -10. * --t) + 2.) + b;
}

//////////////////////////////////////////////////////////
// MATHS
float map(float value, float min1, float max1, float min2, float max2) {
 // return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
 return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
}



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


    vec3 col = vec3(0.);


    int nsides;

    if (mod(u_time ,2.0)< 1.){
        nsides = 5;
    }
    else {
        nsides = 5;
    }


     //st = rotate(vec2(st.x,  st.y), u_time*0.5)  ; 
    float d1 = polySDF(st, nsides);
    vec2 ts = vec2(st.x, 1.-st.y);
    

   // ts = rotate(vec2(st.x,  st.y), u_time)  ; 
    float d2 = polySDF(ts, nsides);
    float d3 = polySDF(ts , nsides);

    vec3 mc1 = vec3(1.,0.1,0.15);
    float t = mod(u_time *0.25, PI);
    float t1 = clamp(t, .0 , PI/2.);

    col += fill(d1, sin(t1)*.7 ) * fill(fract(d1*5.),.5)   ;
   // col += fill(d1, sin(u_time +PI/8.)*.6 + .2)  * fill(fract(d1*5.),.5) *mc1   ;
    col += fill(d2, sin(t1)*.6) *mc1 * fill(fract(d3*4.9),.4);
    col *= 1. - fill(d1,  sin(t1)*.6) * fill(fract(d2*4.9),.45) ;
    col += fill(d3, 0.04) * mc1 * abs(cos(t));

    gl_FragColor = vec4(col, 1.0);
}



