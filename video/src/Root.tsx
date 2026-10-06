import { Composition } from "remotion";
import { HeroBriefing } from "./HeroBriefing";

export const Root: React.FC = () => (
  <Composition
    id="HeroBriefing"
    component={HeroBriefing}
    durationInFrames={330}
    fps={30}
    width={1600}
    height={960}
  />
);
