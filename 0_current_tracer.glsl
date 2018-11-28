#define M_PI 3.141592653589793238462643383279
#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))
#define DEG_TO_RAD (M_PI/180.0)
#define STEP 0.02
#define ITER 30

uniform float time;
uniform vec2 resolution;


uniform sampler2D bg_texture;
mat3 BG_COORDS = ROT_Y(45.0 * DEG_TO_RAD);

// helper functions
vec2 squareFrame(vec2 screenSize){
  vec2 position = 2.0 * (gl_FragCoord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

vec2 sphereMap(vec3 p){
  return vec2(atan(p.x,p.y)/M_PI*0.5+0.5, asin(p.z)/M_PI+0.5);
}


// Ray represents a ray of light's origin and direction
struct Ray {
  vec3 origin; // Origin
  vec3 direction; // Direction
};

struct Sphere{
  vec3 position;
  float radius;
};

vec3 leapFrog(vec3 point, vec3 velocity){
  vec3 c = cross(point,velocity);
  float h2 = normalize(dot(c,c));
  
  for (int i=0; i<ITER;i++){ 
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;
  }
  
  return point;
}

void main()	{
  vec2 uv = squareFrame(resolution);
  vec3 pixelPos = vec3(uv, 0.);
  // The eye position in this example is fixed.
  vec3 eyePos = vec3(0, 0, -0.3); // Some distance in front of the screen
  // The ray for the raytrace - which is just intersectSphere in this tutorial
  vec3 rayDir = normalize(pixelPos - eyePos);
  
  vec3 arrival = leapFrog(eyePos, rayDir);
  vec2 tex_coord = sphereMap(arrival*BG_COORDS);
    
  
  //color intesection
  gl_FragColor = texture2D(bg_texture, tex_coord);
}