#define PI 3.141592653589793238462643383279
#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))
#define DEG_TO_RAD (PI/180.0)

uniform float time;
uniform vec2 resolution;

uniform vec3 cam_pos;
uniform vec3 cam_dir;
uniform vec3 cam_up;
uniform float fov;


uniform sampler2D bg_texture;
mat3 BG_COORDS = ROT_Y(45.0 * DEG_TO_RAD);


// Frame to draw on
vec2 squareFrame(vec2 screen_size)
{
  vec2 position = 2.0 * (gl_FragCoord.xy / screen_size.xy) - 1.0;
  position.x *= screen_size.x / screen_size.y;
  return position;
}

vec2 sphereMap(vec3 p){
  return vec2(atan(p.x,p.y)/PI*0.5+0.5, asin(p.z)/PI+0.5);
}

void main()	{

  vec2 uv = squareFrame(resolution); 

  // generate ray
  vec3 pixel_pos =vec3(uv,0.);
  
  vec3 eye_pos = vec3(0,0,0.5);
  // The ray for the raytrace - which is just intersectSphere in this tutorial
  vec3 ray_dir = normalize(eye_pos-pixel_pos);
  vec2 tex_coord = sphereMap(ray_dir*BG_COORDS);
    
  gl_FragColor = texture2D(bg_texture, tex_coord);
}