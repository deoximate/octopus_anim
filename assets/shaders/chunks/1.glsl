#define PI 3.14159265359
#define PI2 6.28318530718

vec2 Sample(in float theta, inout float r)
{
  r += 1.0 / r;
	return (r-1.0) * vec2(cos(theta), sin(theta)) * .06;
}

vec3 blurBokeh(sampler2D tex, vec2 uv, vec2 tSize, float radius, float amount)
{
  float ITERATIONS = 150.0;
  float ONEOVER_ITR = 1.0 / ITERATIONS;
  float GOLDEN_ANGLE = 2.39996323;

	vec3 acc = vec3(0.0);
	vec3 div = vec3(0.0);
  vec2 pixel = vec2(tSize.y/tSize.x, 1.0) * radius * .025;
  float r = 1.0;

	for (float j = 0.0; j < GOLDEN_ANGLE * ITERATIONS; j += GOLDEN_ANGLE)
    {

		vec3 col = texture(tex, uv + pixel * Sample(j, r)).xyz;
       // col = col * col * 1.2; // ...contrast it for better highlights
		vec3 bokeh = vec3(.5) + pow(col, vec3(10.0)) * amount;
		acc += col * bokeh;
		div += bokeh;
	}
	return acc / div;
}

float rand (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

vec3 randomOnSphere(in vec2 st) {
  vec3 randN = vec3(rand(st), rand(st), rand(st)); 
  float theta = randN.x * 2.0 * 3.14159265;
  float v = randN.y;

  float phi = acos(2.0 * v - 1.0);
  float r = pow(randN.z, 1.0 / 3.0);
  float x = r * sin(phi) * cos(theta);
  float y = r * sin(phi) * sin(theta);
  float z = r * cos(phi);

  return vec3(x, y, z);
}

float cnoise (vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float surface3 ( vec3 coord ) {
        float frequency = 4.0;
        float n = 0.0;  
        n += 1.0    * abs( cnoise( vec2(coord * frequency) ) );
        n += 0.5    * abs( cnoise( vec2(coord * frequency * 2.0) ) );
        n += 0.25   * abs( cnoise( vec2(coord * frequency * 4.0) ) );
        return n;
}

float normalizeRange (float value, float minValue, float maxValue) {
  return ((value - minValue) / (maxValue - minValue))*2.0-0.5;
}

vec3 generateNormal(sampler2D tex, vec2 texCoord, vec2 texelSize) {
    vec3 dx = vec3(texelSize.x, 0.0, texture(tex, texCoord + vec2(texelSize.x, 0.0)).r - texture(tex, texCoord - vec2(texelSize.x, 0.0)).r);
    vec3 dy = vec3(0.0, texelSize.y, texture(tex, texCoord + vec2(0.0, texelSize.y)).r - texture(tex, texCoord - vec2(0.0, texelSize.y)).r);
    return normalize(cross(dy, -dx));
}

int vec3ToInt(vec3 color) {
  vec3 scaledColor = color * 255.0;
  vec3 roundedColor = round(scaledColor);
  int intValue = int(roundedColor.r) * 256 * 256 + int(roundedColor.g) * 256 + int(roundedColor.b);
  return intValue;
}

float sumVec3(vec3 vec) {
  return vec.x+vec.y+vec.z;
}

vec3 powVec3(vec3 vec, float n) {
  return vec3(pow(vec.x, n), pow(vec.y, n), pow(vec.z, n));
}

float linearizeDepth(float depth, float near, float far)
{
    float z = depth * 2.0 - 1.0; 
    return (2.0 * near * far) / (far + near - z * (far - near));
}

vec3 clampVec3(vec3 value, vec3 minVal, vec3 maxVal) {
  return vec3(
    clamp(value.x, minVal.x, maxVal.x),
    clamp(value.y, minVal.y, maxVal.y),
    clamp(value.z, minVal.z, maxVal.z)
  );
}