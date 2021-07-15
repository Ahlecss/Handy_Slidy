precision highp float;

uniform float uAlpha;
uniform vec3 uColor;

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 uResolution;
uniform vec2 u_mouse;
uniform float uTime;
uniform float uOddL;
uniform float uOddR;
uniform float uScrollY;

// Some tries with that circle
void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x = gl_FragCoord.x/uResolution.y + uScrollY;
    st.y = (gl_FragCoord.y/uResolution.x) - 1.;

    //st.x *= uResolution.x/uResolution.y;   

    vec2 uv = gl_FragCoord.xy + 1.5;

    float d = sqrt(dot(st ,st -2.));

    float t = 1. - smoothstep(0.0, 0.1, abs(0.1-d));
    gl_FragColor.rgb = uColor;
    gl_FragColor.a = 1.*t;
}