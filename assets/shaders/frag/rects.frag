#include <chunk>


uniform sampler2D tMask0;
//uniform sampler2D tMaskV0;
//uniform sampler2D tMaskV1;


uniform float uTime;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform int uStateNum;
uniform int uTheme;


in vec2 vUv;
in float vInstanceID;
in vec2 vXY;


#define colorB1 vec3(217.0/255.0, 217.0/255.0, 217.0/255.0);
#define colorB2 vec3(8.0/255.0, 223.0/255.0, 180.0/255.0);

#define colorW1 vec3(96.0/255.0, 96.0/255.0, 96.0/255.0);
#define colorW2 vec3(0.0/255.0, 166.0/255.0, 133.0/255.0);




float loopTime(float time, float period) {
    float modTime = mod(time, period);
    return modTime < 0.5 * period ? modTime : period - modTime;
}
float diamondShape(vec2 uv, float size) {
    vec2 p = (uv - 0.5) * size;
    return max(abs(p.x) + abs(p.y), 0.001);
}
float smoothEdge(float dist, float radius) {
    return smoothstep(radius - 0.01, radius + 0.01, dist);
}

void main() {

    vec3 COL1, COL2;
    if (uTheme == 0) {
        COL1 = colorB1;
        COL2 = colorB2;
    } else {
        COL1 = colorW1;
        COL2 = colorW2;
    }


    vec4 col = vec4(COL1, 1.0);
    vec2 uv = (vUv);
    vec2 xy = vXY;

    float as = uResolution.y / uResolution.x;

    float s = sin(uTime+vInstanceID/sin(xy.x*2.0))*0.15+0.15;
    float m;


    float t = uTime*0.1;
    vec2 distortedUV = vec2(
        surface3(vec3(xy.xy/15.0+t, 0.0)),
        surface3(vec3(xy.yx/15.0-t-10.0, 0.0))
    );

    distortedUV = distortedUV*2.0-1.0;

    if (uStateNum == 2) {
        xy += distortedUV*0.4;
    }
    if (uStateNum == 3 || uStateNum == 5) {
        xy += distortedUV*0.2;
    }

    /*if (uStateNum == 2) {
        xy = ((xy)-0.5)/vec2(80.0)-vec2(-0.62, -0.2);

        m = texture(tMask0, xy).r;
        if (distance(xy, vec2(0.5, 0.45)) <= 0.13) {
            m = 0.3;
        }
    }*/

    if (uStateNum == 2) {
        xy = ((xy)-vec2(0.9, -0.1))/vec2(15.0, 50.0)-vec2(0.9, -0.1);

        m = texture(tMask0, xy*vec2(0.9, 1.0)).r;
    }
    if (uStateNum == 0 || uStateNum == 3 || uStateNum == 5) {
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
        //float width=0.05+l*0.2;
        float width=.05+l*0.1;
        //float blur=0.05;
        float blur=.06;


        if (l > 0.1) {
            width = .03+l*0.2;
        }

        if (uStateNum == 0) {
            dis = 0.19;
            width=0.04;
        }

        float offset=l+(angle/(2.*PI))*dis;
        float circles=mod(offset-t, dis);
        m = 
        (smoothstep(circles-blur,circles,width)
        -smoothstep(circles,circles+blur,width));
    }
    if (uStateNum == 1 || uStateNum == 4 || uStateNum == 6) {
        m = (sin((xy.y*0.25+2.5+sin(xy.x*0.25+sin(xy.x*0.25)+(uTime*0.2))) )*0.4-s*0.2);
    }



    float f = 0.5-m;
    f = clamp(f, 0.0, 0.5);
    float f2 = sin(f)*0.1;
    float f3 = cos(f)*0.1;
    
    
    float d = length(uv-0.5);
    float sm = as*0.04;
    float circle1 = smoothstep(0.5-f, 0.44-sm-f, d);
    float circle2 = smoothstep(0.25-f, 0.325+sm-f, d);
    float circle3 = smoothstep(0.2-f3, 0.15-f3, d);




    float diamond = diamondShape(uv, 1.0);
    float smoothedDiamond = smoothEdge(diamond, 0.35);
    circle2 = max(circle2, smoothedDiamond);
/*
    //!------------------------
    if (uStateNum == 2) {

        if (m > 0.245) {
            col.a *= circle1;

            if (f < 0.06) {
                col.a *= circle2;
                col.rgb = COL2;
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
    */
    //!------------------------
    if (uStateNum == 2) {
        m = ceil(m*5.0);
        if (m > 0.5) {
            col.a *= circle1;

            if (s > 0.2) {
                col.a *= circle2;
            }
        } else {
            col.a *= circle3;
        }
    }
    //!------------------------
    if (uStateNum == 3) {
        if (m > 0.5) {
            col.a *= circle1;
            
            if (f < 0.125) {
                col.a *= circle2;
            } 
        } else {
            col.a *= circle3;
        }
    }
    //!------------------------
    if (uStateNum == 5 || uStateNum == 0) {
        if (m > 0.5) {
            col.a *= circle1;

            if (s > 0.28) {
                col.a *= circle2;
            }
        } else {
            col.a *= circle3;
        }
    }
    //!------------------------
    if (uStateNum == 1 || uStateNum == 4 || uStateNum == 6) {
        
        if (m > 0.32) {
            col.a *= circle1;
            
            if (f < 0.125) {
                col.a *= circle2;
                col.rgb = COL2;
            } 
        } else {
            col.a *= circle3;
        }
    }










    gl_FragColor = vec4(col);
}