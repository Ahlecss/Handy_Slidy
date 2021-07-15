/*precision highp float;

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


void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec3 color = vec3(0.0);
    //vec4 square = vec4(vec2(cos(PI/2.), sin(PI/2.)),vec2(5.5 * - uOddR,-2.400 - uScrollY / 4.0));
    vec4 square = vec4(vec2(4.5 * uOddL, 0.4 + uScrollY / 4.),vec2(5.5 * - uOddR,-2.400 - uScrollY / 4.0));
    //vec4 square = vec4(vec2(5.5 * uOddL, 0.6 + uScrollY / 4.),vec2(6.5 * - uOddR,- 2.80 - uScrollY / 4.0));
    //square.x += (smoothstep(1.27,1.3, st.y) - smoothstep(1.3,1.33,st.y)) * 0.1;
    //square.z -= (smoothstep(1.27,1.3, st.y) - smoothstep(1.3,1.33,st.y)) * 0.1;

    // Friend smoothstep
    square.x += (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.05;
    square.y -= (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.05;
    
    float thickness = 0.005;

    // bottom-left
    vec2 bl1 = step(square.xy,st);
    float pct1 = bl1.x * bl1.y;
    
    vec2 bl2 = step(square.xy + thickness,st);
    float pct2 = bl2.x * bl2.y;

    // top-right
     vec2 tr1 = step(square.zw,1.0-st);
     pct1 *= tr1.x * tr1.y;
     vec2 tr2 = step(square.zw + thickness,1.0-st);
     pct2 *= tr2.x * tr2.y;

     color = vec3(pct1 - pct2);

    gl_FragColor.rgb = color;

    float s1 = step(0.1, gl_FragColor.r);

    float alpha = step(0.1, s1);
    gl_FragColor.a = alpha;
}*/

precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform vec2 uResolution;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {

  vec2 st = gl_FragCoord.xy/uResolution.xy;

  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec3 texture = texture2D(tMap, uv).rgb;

  gl_FragColor.rgb = texture;
  float s1 = step(0.1, gl_FragColor.r);

  float alpha = step(0.1, s1);
  gl_FragColor.a = alpha - 0.65;
  
}
