# ET4-PROJET-WEB-FRONT

Copyright (c) 2025 Maxime DAUPHIN, Maël HOUPLINE, Julien TAP. All rights reserved.
Licensed under the MIT License. See LICENSE file for details.

Front-end repository of project "PolyHUB" for ET4 web project.

---

## Structure
- `public`: static files (HTML template, images, etc.)
- `src`: source code (React components, styles, etc.)
- `build`: built files for production (after running `npm run build`)

---

## Customization

Modify files in `src` folder to customize the application (except `index.tsx`).

To edit outisde of src for customization:
- `webpack.config.js` (`plugins.webpack.DefinePlugin` to add environment variables to application)

---

## Commands
- `npm run lint` : lint the code with ESLint (automatically run before `dev` and `build`)
- `npm run dev` : run the application in development mode (with hot-reloading)
- `npm run build` : build the application for production
