#define M_PI 3.141592653589793238462643383279
#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))
#define DEG_TO_RAD (M_PI/180.0)
#define STEP 0.02
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


vec3 lorentz_velocity_transformation(vec3 moving_v, vec3 frame_v) {
    float v = length(frame_v);
    if (v > 0.0) {
        vec3 v_axis = -frame_v / v;
        float gamma = 1.0/sqrt(1.0 - v*v);

        float moving_par = dot(moving_v, v_axis);
        vec3 moving_perp = moving_v - v_axis*moving_par;

        float denom = 1.0 + v*moving_par;
        return (v_axis*(moving_par+v)+moving_perp/gamma)/denom;
    }
    return moving_v;
}

vec3 leapFrog(vec3 point, vec3 velocity){
 
  
  return point;
}

void main()	{
  vec2 p = squareFrame(resolution);
  vec3 pixel_pos = vec3(p.xy, 0.);
    
  // cam position
  vec3 cam_pos = vec3(0,0,-4);

  //leap frog
  vec3 point = pixel_pos;
  vec3 velocity = normalize(cam_pos - point);
  
  vec3 c = cross(point,velocity);
  float h2 = normalize(dot(c,c));
  
  vec3 old_point = point;
  for (int i=0; i<NITER;i++){ 
    old_point = point;
    
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;    
    
    if (length(point)
  }

  vec3 ray = normalize(point - old_point); 
  
  vec2 tex_coord = sphereMap(ray*BG_COORDS);
  gl_FragColor = texture2D(bg_texture, tex_coord);

  
 
    
  
  //color intesection
  
}