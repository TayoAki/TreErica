# Hero animation (Remotion)

Source for the looping "Monday Morning Briefing" animation in the site hero.
The composition is `HeroBriefing` in `src/HeroBriefing.tsx` (1600×960, 30 fps, 11 s loop).

```bash
cd video
npm install
npx remotion studio src/index.ts          # live preview / edit
npx remotion render src/index.ts HeroBriefing out/hero.mp4  --codec=h264 --crf=24 --scale=0.75
npx remotion render src/index.ts HeroBriefing out/hero.webm --codec=vp9  --crf=36 --scale=0.75
npx remotion still  src/index.ts HeroBriefing out/hero-poster.jpg --frame=265 --scale=0.75
cp out/hero.mp4 out/hero.webm out/hero-poster.jpg ../assets/
```

Fonts are bundled in `public/fonts` so renders work offline. If Remotion can't
download its browser, pass `--browser-executable=/path/to/chrome-headless-shell`.
