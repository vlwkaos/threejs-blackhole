#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define ROT_Y(a) mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a))
#define STEP 1.0
#define NITER 15
#define SPEED 1


uniform float time;
uniform vec2 resolution;

uniform vec3 cam_pos;
uniform vec3 cam_dir;
uniform vec3 cam_up;
uniform float fov;
uniform bool moving;

uniform float velsqr;


uniform sampler2D bg_texture;

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
  
  // from frame to camera
  vec3 ray_dir = normalize(pixel_pos - cam_pos);
  
  if (moving){
  // aberration
    float ray_angle = acos(dot(vec3(1.0,0.0,0.0),ray_dir));
    //ray_angle += 
    //ray_dir = vec3(1.0,0.0,0.0)/cos(ray_angle);
   // ray_dir = 
  }
  // initial color
  vec4 color = vec4(0.0,0.0,0.0,1.0);

  // geodesic by leapfrog integration
  vec3 point = cam_pos;
  vec3 velocity = ray_dir;
  vec3 c = cross(point,velocity);
  float h2 = normalize(dot(c,c));
  
  vec3 oldpoint; 
  float pointsqr;
  for (int i=0; i<NITER;i++){ 
    oldpoint = point; // remember previous point for finding intersection
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;    

    if (length(point) < 1.0) break; // ray is lost at rs
  }
  
  ray_dir = normalize(point - oldpoint);
  // angle of ray

  vec2 tex_coord = sphereMap(ray_dir);
  color = texture2D(bg_texture, tex_coord);

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