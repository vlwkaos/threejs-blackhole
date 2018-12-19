#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define ROT_Y(a) mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a))
#define STEP 1.0
#define NSTEPS 15
#define SPEED 1


uniform float time;
uniform vec2 resolution;

uniform vec3 cam_pos;
uniform vec3 cam_dir;
uniform vec3 cam_up;
uniform float fov;
uniform bool moving;

uniform vec3 cam_vel;


uniform sampler2D bg_texture;
uniform sampler2D star_texture;

vec2 squareFrame(vec2 screen_size){
  vec2 position = 2.0 * (gl_FragCoord.xy / screen_size.xy) - 1.0; 
  // first make pixels arranged in 0..1
  // then by multiplying by 2 and subtracting 1, put them in -1..1
  
  return position;
}

vec2 sphereMap(vec3 direction){
  // spherical projection
  // polar angles are directly used as horizontal and vertical coordinates
  // here angle to y-axis mapped to latitude (looking vertically 180 degrees)
  // xz plane to longitude (looking horizontally 360 degrees)
  vec2 uv = vec2(atan(direction.z,direction.x), asin(direction.y)); 
  uv *= vec2(1.0/(2.0*PI), 1.0/PI); //long, lat
  uv += 0.5;
  return uv;
}

vec3 lorentz_transform_velocity(vec3 u, vec3 v){ 
  // u = ray
  // v = observer
  float speed = length(v);
  if (speed > 0.0){
    float gamma = 1.0/sqrt(1.0-dot(v,v));
    
    float denominator = 1.0 - dot(v,u);
    
    vec3 new_u = (u/gamma - v + (gamma/(gamma+1.0)) * dot(u,v)*v)/denominator;
    return new_u;
  }
  return u;
}

vec3 temp_to_color(float temp_kelvin){
  vec3 color;
  // 1k ~ 40k rescale by deviding 100
  temp_kelvin = clamp(temp_kelvin, 1000.0, 40000.0) / 100.0;
  if (temp_kelvin <= 66.0){
    color.r = 255.0;
    color.g = temp_kelvin;
    color.g = 99.4708025861 * log(color.g) - 161.1195681661;
    if (color.g < 0.0) color.g = 0.0;
    if (color.g > 255.0)  color.g = 255.0;
  } else {
    color.r = temp_kelvin - 60.0;
    if (color.r < 0.0) color.r = 0.0;
    color.r = 329.698727446 * pow(color.r, -0.1332047592);
    if (color.g > 255.0) color.r = 255.0;
    color.g = temp_kelvin - 60.0;
    if (color.g < 0.0) color.g = 0.0;
    color.g = 288.1221695283 * pow(color.g, -0.0755148492);
    if (color.g > 255.0)  color.g = 255.0;  
  }
  if (temp_kelvin >= 66.0){
    color.b = 0.0;
  } else {
    color.b = temp_kelvin - 10.0;
    color.b = 138.5177312231 * log(color.b) - 305.0447927307;
    if (color.b < 0.0) color.b = 0.0;
    if (color.b > 255.0) color.b = 255.0;
  }
  color /= 255.0;
  return color;
}

void main()	{
  // z towards you, y towards up, x towards your left
  float uvfov = fov / 2.0 * DEG_TO_RAD;
  
  vec2 uv = squareFrame(resolution); 
  uv *= vec2(resolution.x/resolution.y, 1.0);
  vec3 cam_ndir = normalize(cam_dir); // 
  vec3 nright = normalize(cross(cam_dir, cam_up));
  // generate ray
  vec3 pixel_pos =cam_pos + cam_ndir +
                 nright*uv.x*uvfov+ cam_up*uv.y*uvfov;

  vec3 ray_dir = normalize(pixel_pos - cam_pos); // 
  
  // light aberration alters ray path 
  ray_dir = lorentz_transform_velocity(ray_dir, cam_vel);

  // initial color
  vec4 color = vec4(0.0,0.0,0.0,1.0);

  // geodesic by leapfrog integration

  vec3 point = cam_pos;
  vec3 velocity = ray_dir;
  vec3 c = cross(point,velocity);
  float h2 = normalize(dot(c,c));
  
  vec3 oldpoint; 
  float pointsqr;
  for (int i=0; i<NSTEPS;i++){ 
    oldpoint = point; // remember previous point for finding intersection
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;    
    
    
    
    if (length(point) < 1.0) break; // ray is lost at rs
  }

  ray_dir = normalize(point - oldpoint);
  vec2 tex_coord = sphereMap(ray_dir);
  
  float t_coord;
  // taken from source
  vec4 star_color = texture2D(star_texture, tex_coord);
  if (star_color.r > 0.0){
    t_coord = (1000.0 + 39000.0*star_color.g);
    color+= temp_to_color(t_coord) * star_color.r 
  }
  
  
  color += texture2D(bg_texture, tex_coord) * 0.4;;
  

  bool horizon_mask = length(point) < 1. ; // intersecting eventhorizon
  // does it enter event horizon?
  if (horizon_mask) {
    //float lambda = 1. - ((1.-oldpointsqr)/((pointsqr - oldpointsqr)));
    //vec3 colPoint = lambda * point + (1-lambda)*oldPoint; // for drawing grid
    
    color = vec4(0.,0.,0.,1.0);
  
  }
  

  gl_FragColor = color;
  //color intesection
  
}