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

  // Friend smoothstep
  ratio.x += (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.05;
  ratio.y -= (smoothstep(0.07,0.1, st.y) - smoothstep(0.1,0.13,st.y)) * 0.05;

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec3 texture = texture2D(tMap, uv).rgb;

  gl_FragColor.rgb = texture;
  /*float s1 = step(0.1, gl_FragColor.r);

  float alpha = step(0.1, s1);*/
  gl_FragColor.a = 1.;
  
}
