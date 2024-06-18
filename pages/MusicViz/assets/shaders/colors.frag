precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float peak;
uniform sampler2D Tex;
varying vec2 vTexCoord;


void main() 
{
    vec2 uv = vTexCoord;
    vec2 st = gl_FragCoord.xy/iResolution.xy;
   
    //use this to darken top and bottom of screen
    float y = smoothstep(0.0001,0.015,st.y);

    //distort UVs
    uv.x*=0.99;
    uv.x+=0.005;
    
    uv.x+= sin(uv.y*(2.2*peak)+iTime*0.9)/(1000.0);
    uv.y*=1.0-(peak*0.085);
    
    
    vec4 color = texture2D(Tex, uv);

    //vec4 redColor = vec4(uv.x, uv.y, 0.0, 1.0); //for testing

    color.a =1.0; ///alpha
    //darken the horizontal edges
    color.rgb=(color.rgb*(y-0.01));
    color.rgb*=1.001;
    gl_FragColor = color;  //voila!
}