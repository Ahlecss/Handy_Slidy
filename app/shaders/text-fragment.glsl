uniform vec3 uColor;
uniform vec2 uResolution;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {

  vec2 st = gl_FragCoord.xy/uResolution.xy;
  
  // Friend smoothstep
  vec2 ratio = vec2(1, 1);
  ratio.x += (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.01;
  ratio.y -= (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.01;


  vec3 color = texture2D(tMap, vUv * ratio).rgb;

  float signed = max(min(color.r, color.g), min(max(color.r, color.g), color.b)) - 0.5;
  float d = fwidth(signed);
  float alpha = smoothstep(-d, d, signed);

  if (alpha < 0.02) discard;

  gl_FragColor = vec4(uColor, alpha);
}
