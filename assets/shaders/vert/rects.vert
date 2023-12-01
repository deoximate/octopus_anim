#define PI 3.1415926

uniform sampler2D tDraw;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPlaneSize;
uniform float uRectCount;

out vec4 vColor;
out vec2 vUv;
out float vInstanceID;
out vec2 vXY;



// 7
// 15

void main() {
  vec2 SIZE = vec2(0.125);
  vec2 OFFSET = vec2(SIZE+SIZE/4.2);
  //vec2 OFFSET = vec2(SIZE+0.01);

  float idx = float(gl_InstanceID);
  float x = mod(idx, uRectCount);
  float y = floor(idx / uRectCount);


  //! POSITION
  vec3 pos = vec3(position.x*SIZE.x, position.y*SIZE.y, 0.0);
  pos.xy += vec2(x*OFFSET.x, y*OFFSET.y);
  pos.xy -= OFFSET*(uRectCount*0.5);

/*
  //! UV & MAPS
  vec2 uv = vec2(vec2(x, y)*OFFSET)*0.2;
  uv = (uv.xy)*vec2(1.0, 0.5)+vec2(0.0, 0.5);
  vec4 mapColor = texture(tDraw, uv);
  vec4 mapTouch = texture(tDraw, uv-vec2(0.0, 0.5));
*/




  vUv = uv;
  vInstanceID = idx;
  vXY = vec2(x, y);


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}