[original source](http://rantonels.github.io/starless/) for most of the physics.  
[upmath.me](https://upmath.me/) for tex image generation.  


## Schwarzchild metric and coordinates  
Schwarzchild metric is distribution of mass where it satisfies sphere symmetry and stationary condition. [more](https://en.wikipedia.org/wiki/Schwarzschild_metric)

Using certain values for variables, we can simplify the equation to:  
<img src="https://tex.s2cms.ru/svg/%5Cvec%20F(r)%20%3D%20-%20%5Cfrac%7B3%7D%7B2%7D%20h%5E2%20%5Cfrac%7B%5Chat%20r%7D%7Br%5E5%7D" alt="\vec F(r) = - \frac{3}{2} h^2 \frac{\hat r}{r^5}" />
(*h* is some constant and hat denotes unit vector)

Above takes a form of Binet Equation.  
In Binet Equation, r denotes the position of a particle. For example, a photon.     
F(r) is force applied to the particle. [more](https://en.wikipedia.org/wiki/Binet_equation)

Integrate above equation for parameterized geodesic equation:  
<img align="center" src="https://tex.s2cms.ru/svg/%5Cvec%20x%20(T)" alt="\vec x (T)" /> where *T* is the abstract time coordinate for this system.  

## Methods for Integration  
[**Leapfrog Integration**](https://en.wikipedia.org/wiki/Leapfrog_integration)  
From Wikipedia, "Leapfrog integration is a method for numerically integrating differential equations of the form:"  
<img align="center" src="https://tex.s2cms.ru/svg/%7B%5Cddot%20%7Bx%7D%7D%3Dd%5E%7B2%7Dx%2Fdt%5E%7B2%7D%3DF(x)" alt="{\ddot {x}}=d^{2}x/dt^{2}=F(x)" />
Which matches our case. So how does it work?  
Take a look at the below diagram. [image source](http://einstein.drexel.edu/courses/Comp_Phys/Integrators/leapfrog/)    
<img align="center" src="https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fimage.png?1543388348310"/>
To summarize:  
1. Position is updated with a velocity within a certain time-step.
2. Velocity is numerically integrated with new position from above.
3. Go to 1.
