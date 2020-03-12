three-js-blackhole
=======

<p align="center">
   <img src="https://i.imgur.com/I6eMiFS.jpg" width="720px"/>
   <br> Screenshot
</p>

My attempt at building realtime blackhole ray tracer, 
reproducing [[1]](http://rantonels.github.io/starless/) and [[2]](https://github.com/oseiskar/black-hole).  
They helped me a lot because I had zero knowledge to begin with.  

I was fascinated by the idea of ray tracing blackhole with now popularized accretion disk around it. So I hopped in.  
 
### Features
- Left click your mouse drag to look around.
- Adjust quality for more accurate ray marching.
- Adjust bloom effect for aesthetics
- Can save as an image, allows higher resolution rendering.
- Custom Camera(Observer)
  - Orbit around the blackhole
  - Adjust field of view and distance
- Physics
  - Lorentz transform
  - Doppler shift
  - Relativistic beaming
  - Accretion disk
  - Background star color from blackbody spectrum (random and trivial velocity for red shift)
  
  
this may be a work-in-progess project(?).

### Maybe
- Add fog effect

--------------------

## How it was built

- Learn how to do basic ray tracing (ex: sphere)
- Think is light's perspective (ex: raymarching)
- Apply Camera concept to shader
- Learn a bit about various physical phenomena involving light and blackhole
- Scrutinize available resoureces, steal mathematical formulas because I am not a physics genius.
- Apply equations to shader.

--------------------

## License

Apache License, Version 2.0  
 - dat.GUI
     
MIT license
 - stats.js
 - three.js + other extra js files
 - [https://github.com/oseiskar/black-hole](https://github.com/oseiskar/black-hole)
   - Code works & derived formulae were referenced from.

CC-BY-NC 2.0  
 - Background image [/assets/milkyway.jpg](https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fmilkyway.jpg?1545745139132) is from Stellarium and "based on Nick Risinger's Photopic Sky Survey image under CC-BY-NC 2.0." as stated in [https://github.com/oseiskar/black-hole/blob/master/COPYRIGHT.md](https://github.com/oseiskar/black-hole/blob/master/COPYRIGHT.md)  
 
GNU, General Public License, Version 3.0
 - [https://github.com/rantonels/starless](https://github.com/rantonels/starless)
   - Original texture for accretion disk is provided by this repository. It is slightly modified to reduce the brightness at the edge. 
   - Code works & derived formulae were referenced from and reproduced in GLSL.


All other files in this glitch project are hereby licensed under GPL, v3.0  

This project renders schwarzchild blackhole (+ various effects). 

    Copyright (C) <2018>  <pizzakinggod>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
