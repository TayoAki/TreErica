import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { sans, serif } from "./fonts";

const C = {
  stage: "#2B2B2B",
  ink: "#1F1F1F",
  text: "#2E2E2E",
  muted: "#6E6A63",
  soft: "#8F8A82",
  line: "#E3DED4",
  cream: "#F3EEE5",
  bg: "#F7F5F0",
  dark: "#2B2B2B",
};

// Fade everything out at the end so the loop restarts cleanly.
const useLoopFade = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - 24, durationInFrames - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const usePop = (start: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.8 } });
};

const fadeUp = (frame: number, start: number, dist = 18) => {
  const t = interpolate(frame, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
};

const Check: React.FC<{ on: number; size?: number; dark?: boolean }> = ({ on, size = 22, dark = true }) => {
  const s = usePop(on, 12);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        flex: "none",
        background: s > 0.02 ? (dark ? C.dark : C.cream) : "transparent",
        border: `2px solid ${s > 0.02 ? (dark ? C.dark : C.cream) : C.line}`,
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" style={{ transform: `scale(${s})` }}>
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={dark ? C.cream : C.dark} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Counter: React.FC<{ from: number; to: number; start: number; end: number }> = ({ from, to, start, end }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <>{Math.round(v)}</>;
};

const Chip: React.FC<{ label: string; tone: "done" | "flag" | "held" | "wait" }> = ({ label, tone }) => {
  const styles: Record<string, React.CSSProperties> = {
    done: { background: C.dark, color: C.cream, borderColor: C.dark },
    flag: { background: "#FFF6E6", color: "#8A5A00", borderColor: "#F2DDB4" },
    held: { background: C.bg, color: C.text, borderColor: C.line },
    wait: { background: "#fff", color: C.soft, borderColor: C.line },
  };
  return (
    <span
      style={{
        fontSize: 17,
        fontWeight: 500,
        borderRadius: 999,
        padding: "7px 15px",
        border: "1.5px solid",
        whiteSpace: "nowrap",
        ...styles[tone],
      }}
    >
      {label}
    </span>
  );
};

const AgendaRow: React.FC<{
  start: number;
  time: string;
  title: string;
  note: string;
  chip: React.ReactNode;
  last?: boolean;
}> = ({ start, time, title, note, chip, last }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "92px 1fr auto",
        alignItems: "center",
        gap: 18,
        padding: "20px 24px",
        borderBottom: last ? "none" : `1.5px solid ${C.line}`,
        opacity: t,
        transform: `translateX(${(1 - t) * 30}px)`,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{time}</span>
      <div>
        <div style={{ fontSize: 21, fontWeight: 500, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 17, color: C.muted, marginTop: 2 }}>{note}</div>
      </div>
      {chip}
    </div>
  );
};

const FloatCard: React.FC<{
  start: number;
  style: React.CSSProperties;
  rotate: number;
  title: string;
  icon: React.ReactNode;
  items: { label: string; at: number }[];
  footer?: React.ReactNode;
}> = ({ start, style, rotate, title, icon, items, footer }) => {
  const frame = useCurrentFrame();
  const s = usePop(start, 13);
  const bob = Math.sin((frame - start) / 22) * 4;
  return (
    <div
      style={{
        position: "absolute",
        width: 330,
        background: "#fff",
        borderRadius: 22,
        padding: "22px 24px",
        boxShadow: "0 0 0 8px rgba(255,255,255,.16), 0 30px 60px -20px rgba(0,0,0,.6)",
        transform: `translateY(${(1 - s) * 40 + (s > 0.98 ? bob : 0)}px) rotate(${rotate}deg) scale(${0.85 + s * 0.15})`,
        opacity: s,
        fontFamily: sans,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 600, color: C.ink, marginBottom: 14 }}>
        {icon}
        {title}
      </div>
      <div style={{ display: "grid", gap: 11 }}>
        {items.map((it) => (
          <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 18, color: C.text }}>
            <Check on={it.at} size={22} />
            {it.label}
          </div>
        ))}
        {footer}
      </div>
    </div>
  );
};

const Icon: React.FC<{ d: string; size?: number; color?: string }> = ({ d, size = 22, color = C.dark }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const HeroBriefing: React.FC = () => {
  const frame = useCurrentFrame();
  const loop = useLoopFade();
  const win = usePop(4, 18);

  const row1Ready = frame >= 150;
  const toast = usePop(232, 15);
  const sweep = interpolate(frame, [0, 330], [-30, 130]);

  return (
    <AbsoluteFill style={{ background: C.stage, fontFamily: sans, overflow: "hidden" }}>
      {/* soft grid + glow, echoing the hero stage */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(ellipse at 50% 30%, #000 30%, transparent 75%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(600px 400px at ${sweep}% 0%, rgba(243,238,229,.12), transparent)` }} />

      <AbsoluteFill style={{ opacity: loop }}>
        {/* window */}
        <div
          style={{
            position: "absolute",
            left: 170,
            right: 170,
            top: 90,
            bottom: -30,
            background: "#fff",
            borderRadius: "28px 28px 0 0",
            border: "10px solid rgba(255,255,255,.18)",
            backgroundClip: "padding-box",
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            overflow: "hidden",
            transform: `translateY(${(1 - win) * 120}px)`,
            opacity: win,
            boxShadow: "0 -20px 80px -20px rgba(0,0,0,.6)",
          }}
        >
          {/* sidebar */}
          <div style={{ background: "#FAF8F3", borderRight: `1.5px solid ${C.line}`, padding: "26px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.dark, display: "grid", placeItems: "center" }}>
                <Icon d="M5 12.5l4.5 4.5L19 7.5" size={18} color={C.cream} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>Tre</span>
            </div>
            <div style={{ fontSize: 15, color: C.soft, margin: "0 8px 10px" }}>This week</div>
            {[
              ["Monday brief", "M4 6h16M4 12h10M4 18h7", true],
              ["Calendar", "M3 10h18M5 4.5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-12a2 2 0 012-2z", false],
              ["Travel", "M2 16l20-8-8 14-3-6z", false],
              ["Vendors", "M9 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0", false],
              ["Projects", "M3 7h18v13H3zM8 7V4h8v3", false],
            ].map(([label, d, on], i) => (
              <div
                key={label as string}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 12,
                  fontSize: 18,
                  color: on ? C.ink : "#55524D",
                  fontWeight: on ? 500 : 400,
                  background: on ? "#fff" : "transparent",
                  boxShadow: on ? `0 0 0 1.5px ${C.line}` : "none",
                  marginBottom: 4,
                  ...fadeUp(frame, 14 + i * 4, 8),
                }}
              >
                <Icon d={d as string} size={19} color="#6E6A63" />
                {label as string}
              </div>
            ))}
          </div>

          {/* main */}
          <div style={{ padding: "30px 34px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", ...fadeUp(frame, 22) }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>
                  Monday Morning <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, background: "#EAE2D3", borderRadius: 8, padding: "0 8px" }}>Briefing</span>
                </div>
                <div style={{ fontSize: 17, color: C.muted, marginTop: 6 }}>Sent before the week's first meeting</div>
              </div>
              <span style={{ fontSize: 15, letterSpacing: ".1em", textTransform: "uppercase", color: C.soft, border: `1.5px solid ${C.line}`, borderRadius: 8, padding: "6px 10px" }}>
                Illustrative sample
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, margin: "26px 0 20px" }}>
              {[
                { label: "Meetings this week", n: <Counter from={0} to={14} start={34} end={74} />, sub: "after consolidating 3", at: 30 },
                { label: "Open loops", n: <Counter from={7} to={2} start={40} end={160} />, sub: "both waiting on vendors", at: 36 },
                { label: "Decisions for you", n: <Counter from={0} to={1} start={50} end={70} />, sub: "venue pick by Wed", at: 42 },
              ].map((k) => (
                <div key={k.label} style={{ border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", ...fadeUp(frame, k.at) }}>
                  <div style={{ fontSize: 16, color: C.muted }}>{k.label}</div>
                  <div style={{ fontSize: 42, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{k.n}</div>
                  <div style={{ fontSize: 15, color: C.soft }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
              <AgendaRow
                start={70}
                time="9:00"
                title="Board deck review with CFO"
                note="Final numbers came in late Friday. Updated slide 7 is attached."
                chip={row1Ready ? <Chip label="Ready ✓" tone="done" /> : <Chip label="Updating…" tone="wait" />}
              />
              <AgendaRow
                start={92}
                time="11:30"
                title="Call with partner team"
                note="They asked to push 30 minutes. Confirmed, calendar updated."
                chip={<Chip label="Overlaps lunch 1:1" tone="flag" />}
              />
              <AgendaRow
                start={114}
                time="2:00"
                title="Open block"
                note="Held for the proposal review you mentioned Friday."
                chip={<Chip label="Protected" tone="held" />}
                last
              />
            </div>
          </div>
        </div>

        <FloatCard
          start={130}
          rotate={-4}
          style={{ left: 60, top: 520 }}
          title="Venue search"
          icon={<Icon d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />}
          items={[
            { label: "9 options researched", at: 150 },
            { label: "Narrowed to 3", at: 166 },
            { label: "Recommendation ready", at: 182 },
          ]}
        />
        <FloatCard
          start={176}
          rotate={3.5}
          style={{ right: 70, top: 600 }}
          title="Chicago trip"
          icon={<Icon d="M2 16l20-8-8 14-3-6z" />}
          items={[
            { label: "Flights & car booked", at: 196 },
            { label: "Briefing doc packed", at: 212 },
          ]}
          footer={
            <div style={{ marginTop: 4 }}>
              <Chip label="Check-in reminder set" tone="held" />
            </div>
          }
        />

        {/* toast */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 60,
            transform: `translate(-50%, ${(1 - toast) * 80}px)`,
            opacity: toast,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: C.dark,
            color: C.cream,
            borderRadius: 999,
            padding: "14px 26px 14px 16px",
            fontSize: 21,
            boxShadow: "0 0 0 6px rgba(255,255,255,.12), 0 20px 40px -10px rgba(0,0,0,.5)",
          }}
        >
          <Check on={240} size={30} dark={false} />
          Brief sent · 3 things to know before your first meeting
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
