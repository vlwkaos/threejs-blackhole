## three-js-blackhole

<p align="center">
   <img src="https://i.imgur.com/I6eMiFS.jpg" width="720px"/>
   <br> Screenshot
</p>

My attempt at grokking realtime blackhole ray tracer with an accretion disk around. 
I tried to reproduce [[1]](http://rantonels.github.io/starless/) and [[2]](https://github.com/oseiskar/black-hole).  

I was fascinated by the idea of ray tracing blackhole with now popularized accretion disk around it, So I hopped in.  

```sh
// dev server
pnpm vite dev
```

### Features

- Drag to look around
- Adjustable quality vs performance
- Adjustable bloom effect
- Save to an image
- Physics
  - Lorentz transform
  - Doppler shift
  - Relativistic beaming
  - Accretion disk
  - Background star color from blackbody spectrum (random and trivial velocity for red shift)
  
### TODO

- Add foggy effect

--------------------

## How it was built

There are two parts to implementing this type of project: physics and graphics.

- First, you need to grasp the basics of computer graphics: ray tracing.
  - Find an example that draws a sphere using a shader and learn from it.
  - It helps to think in a perspective of light when playing with ray tracing.
- Try to implement a camera movement inside the shader.
- Now, you want to apply varying degrees of physical phenomena with shader.
- In this case, they are about light and blackhole. There are lots of resources out there to understand them. But remember that you might not understand everything. If you could you'd have a different major.
- Find formulas, try them to better understand.
- Slowly move towards the correct implementation of the formulas

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
