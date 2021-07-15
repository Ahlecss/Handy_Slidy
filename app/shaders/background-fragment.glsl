
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec3 color = vec3(0.5);
    vec4 square = vec4(vec2(0.470,0.120),vec2(0.350,0.380));
    square.x += (smoothstep(0.27,0.3, st.y) - smoothstep(0.3,0.33,st.y)) * 0.01;
    square.z -= (smoothstep(0.27,0.3, st.y) - smoothstep(0.3,0.33,st.y)) * 0.01;
    
    
    float thickness = 0.002;

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
    //step machin alpha

    float s1 = step(0.1, gl_FragColor.r);

    float alpha = step(0.1, s1);
    gl_FragColor.a = alpha;
}