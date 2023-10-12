#define PI 3.1415926

uniform sampler2D tMask0;
uniform sampler2D tMaskV0;
uniform sampler2D tMaskV1;

uniform float uTime;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform int uStateNum;


in vec2 vUv;
in float vInstanceID;
in vec2 vXY;



float loopTime(float time, float period) {
    float modTime = mod(time, period);
    return modTime < 0.5 * period ? modTime : period - modTime;
}

void main() {

    vec4 col = vec4(1.0);
    vec2 uv = (vUv);
    vec2 xy = vXY;

    float s = sin(uTime+vInstanceID/sin(xy.x*2.0))*0.15+0.15;

    float m;
    if (uStateNum == 2) {
        m = texture(tMaskV0, ((xy)-0.5)/vec2(80.0)-vec2(-0.65, -0.2)).r;
    }
    if (uStateNum == 0 || uStateNum == 3 || uStateNum == 5) {
        //m = texture(tMask0, xy/vec2(20.0)-0.5).r;

        float t = loopTime((uTime*0.01), 0.12);
        vec2 o = xy/30.0+vec2(-0.65,-0.8);

        if (uStateNum == 0) {
            xy = vec2(xy.x, xy.y);
            o = xy/30.0+vec2(-0.7,-0.725);
        }

        if (uStateNum == 3) {
            xy = vec2(-xy.x, xy.y);
            o = xy/30.0+vec2(0.75,-0.85);
        }

        float angle=atan(o.y,o.x)-1.0;
        float l=length(o);

        float dis=.2+l-t*2.0;
        float width=.05+l*0.2;
        float blur=.05;


        if (l > 0.1) {
            width = .03+l*0.2;
        }

        if (uStateNum == 0) {
            dis = 0.15;
            width=0.04;
            t = 0.0;
        }

        float offset=l+(angle/(2.*PI))*dis;
        float circles=mod(offset-t, dis);
        m = 
        (smoothstep(circles-blur,circles,width)
        -smoothstep(circles,circles+blur,width))
        *(sin(-uTime+(xy.x/xy.y)*30.0)*0.9+0.9);
    }
    if (uStateNum == 1 || uStateNum == 4 || uStateNum == 6) {
        m = (sin((xy.y*0.25+2.5+sin(xy.x*0.25+sin(xy.x*0.25)+(uTime*0.2))) )*0.4-s*0.2);
    }



    float f = 0.5-m;
    f = clamp(f, 0.0, 0.5);
    float f2 = sin(f)*0.1;
    float f3 = cos(f)*0.1;
    
    float d = length(uv-0.5);
    float circle1 = smoothstep(0.5-f, 0.4-f, d);
    float circle2 = smoothstep(0.25-f, 0.375-f, d);
    float circle3 = smoothstep(0.2-f3, 0.15-f3, d);

    //!------------------------
    if (uStateNum == 2) {

        if (m > 0.245) {
            col.a *= circle1;

            if (f < 0.06) {
                col.a *= circle2;
                col.rgb = vec3(0.4, 1.0, 0.8);
            }  
        } else {
            col.a *= circle3;
        }
    }
    //!------------------------
    if (uStateNum == 3) {
        col.a *= circle1;
        col.a *= circle2;

        if (m < 0.1)
        col.a += circle3;
    }
    //!------------------------
    if (uStateNum == 5 || uStateNum == 0) {
        col.a *= circle1;

        if (m > 0.1) {
            if (s > 0.28) {
                col.a *= circle2;
            }
        } else {
            col.a += circle3;
        }
    }
    //!------------------------
    if (uStateNum == 1 || uStateNum == 4 || uStateNum == 6) {
        
        if (m > 0.32) {
            col.a *= circle1;
            
            if (f < 0.125) {
                col.a *= circle2;
                col.rgb = vec3(0.4, 1.0, 0.8);
            } 
        } else {
            col.a *= circle3;
        }
    }










    gl_FragColor = vec4(col);
}