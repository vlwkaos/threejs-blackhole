#define M_PI 3.141592653589793238462643383279
#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))
#define DEG_TO_RAD (M_PI/180.0)
#define STEP 0.2
#define NITER 50
#define SPEED 1

uniform float time;
uniform vec2 resolution;

uniform sampler2D bg_texture;
mat3 BG_COORDS = ROT_Y(45.0 * DEG_TO_RAD);

const float FOV_ANGLE_DEG = 90.0;
float FOV_MULT = 1.0 / tan(DEG_TO_RAD * FOV_ANGLE_DEG*0.5);

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
  
  vec3 old_point = point;
  for (int i=0; i<NITER;i++){ 
    old_point = point;
    
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;
    
  }
  
  return point;
}

void main()	{
  vec2 p = squareFrame(resolution);
  
  // cam position
  vec3 pos = vec3(0,0,-10);
  // ray position
  vec3 ray = normalize(p.x*pos.x + p.y*pos.y + FOV_MULT*pos.z);
  
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  vec3 ray_dir = normalize(ray - pos);
  
  vec3 arrival = leapFrog(eyePos, rayDir);
  

     vec2 tex_coord = sphereMap(arrival*BG_COORDS);
    gl_FragColor = texture2D(bg_texture, tex_coord);

  
 
    
  
  //color intesection
  
}