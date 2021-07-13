precision highp float;

uniform float uAlpha;
uniform vec3 uColor;

void main() {
  gl_FragColor.rgb = uColor;
  gl_FragColor.a = 1.0;
}



/*precision highp float;

uniform float uAlpha;
uniform vec3 uColor;
uniform vec2 uResolution;

void main(){
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec3 color = vec3(0.5, 0.5, 0.8);

    // bottom-left
    vec2 bl = step(vec2(0.1),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(0.1),1.0-st);
    pct *= tr.x * tr.y;

    color = (pct)*color;

    gl_FragColor = vec4(color,1.0);
}
*/
