# Overview
https://signals.fancybinary.sg/

Frontend for my hilo game, built with Vue and Typescript

Backend repo: https://github.com/roycehoe/signals-backend

# Game logic
 - Implement Axios client; All API calls are made via Axios to application backend
 - Utilize backend error codes to generate in-game error messages
 - Use Vue.js to build, and stitch together, game application components
 - Use vue-router to authenticate users based on JWT tokens
 - Utilize Typescript to implement Typing and Interfaces for all JS objects
 - Implement Enums to elucidate error codes and messages used

# CSS
 - Built responsive web design without CSS components
 - Utilized BEM methodology when creating CSS classes
 - Used SCSS pre-processor to use pre-defined variables and colour themes

# Design
 - Used [Figma to create a prototype design](https://www.figma.com/community/file/1085180273187267171) for my website across different screensizes
 - Used photoshop to create custom game logo and textured game table
 - Obtained and implemented stock videos from free online libraries for game login page
 - Obtained and implemented playing card images from free online libraries
 - Obtained and implemented button sounds and card dealing sounds from free online libraries

# Deployment
 - Used Docker to dockerize my application for deployment
 - Used DigitalOcean to deploy application on a virtual private server
 - Used Cloudflare to set up a DNS to redirect users from my application domain name to my virtual private server
