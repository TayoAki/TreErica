import { continueRender, delayRender, staticFile } from "remotion";

export const sans = "DM Sans";
export const serif = "Fraunces";

// Fonts are bundled locally so renders don't depend on network access.
const handle = delayRender("Loading fonts");
Promise.all([
  new FontFace(sans, `url(${staticFile("fonts/DMSans.woff2")}) format("woff2")`, { weight: "100 1000" }).load(),
  new FontFace(serif, `url(${staticFile("fonts/Fraunces-Italic.woff2")}) format("woff2")`, { style: "italic", weight: "500" }).load(),
])
  .then((faces) => {
    faces.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
