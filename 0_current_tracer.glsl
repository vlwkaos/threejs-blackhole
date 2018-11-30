#define PI 3.141592653589793238462643383279
#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))
#define DEG_TO_RAD (PI/180.0)
#define STEP 0.1
#define NITER 100
#define SPEED 1


uniform float time;
uniform vec2 resolution;

uniform sampler2D bg_texture;
mat3 BG_COORDS = ROT_Y(90.0 * DEG_TO_RAD);

// helper functions
vec3 blendColors(vec3 colorB, float alphaB, vec3 colorA, float alphaA){
 return colorA+colorB*(alphaB*(1.-alphaA)); 
}

float blendAlphas(float alphaB, float alphaA){
  return (alphaA+alphaB*(1.-alphaA));
}

vec2 squareFrame(vec2 screenSize){
  
  vec2 position = 2.0 * (gl_FragCoord.xy / screenSize.xy) - 1.0;
  return position;
}

vec2 sphereMap(vec3 p){
  return vec2(atan(p.x,p.y)/PI*0.5+0.5, asin(p.z)/PI+0.5);
}



void main()	{
  vec3 cameraPosition = vec3(0.0, 0.0, 5.0);
  vec3 cameraDirection = vec3(0.0, 0.0, -1.0);
  vec3 cameraUp = vec3(0.0, 1.0, 0.0);
  float fov = 90.0;
  float fovx = PI * fov / 360.0;
  
  // camera variables 
  float fovy = fovx * resolution.y/resolution.x;
  float ulen = tan(fovx);
  float vlen = tan(fovy);
  
  
  vec2 uv = squareFrame(resolution);
  // generate ray
  vec3 nright = normalize(cross(cameraUp, cameraDirection));
  vec3 pixelPos = cameraPosition + cameraDirection +
                 nright*uv.x*ulen + cameraUp*uv.y*vlen;
  vec3 rayDirection = normalize(pixelPos - cameraPosition);

  // initial color
  vec4 color = vec4(0.0,0.0,0.0,1.0);

  

  // geodesic by leapfrog integration
  vec3 point = cameraPosition;
  vec3 velocity = rayDirection;
  vec3 c = cross(point,velocity);
  float h2 = normalize(dot(c,c));
  
  vec3 oldPoint; 
  float pointsqr;
  for (int i=0; i<NITER;i++){ 
    oldPoint = point; // for finding intersection
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;    
    
     pointsqr = dot(point,point);
    if (pointsqr < 1.) break;
  }
  
  vec2 tex_coord = sphereMap(normalize(point-oldPoint) * BG_COORDS);
  color+=texture2D(bg_texture, tex_coord);
  
  
 
  float oldpointsqr = dot(oldPoint,oldPoint);
  
  bool horizonMask = pointsqr < 1. ;
  // does it enter event horizon?
  if (horizonMask) {
    float lambda = 1. - ((1.-oldpointsqr)/((pointsqr - oldpointsqr)));
    //vec3 colPoint = lambda * point + (1-lambda)*oldPoint; // for drawing grid
    
    
    color = vec4(0.,0.,0.,1.0);
  }
  

  gl_FragColor = color;
  //color intesection
  
}