// ============================================================
// MJ's Suno Track Component — Hosted Bundle
// Loaded via Babel Standalone in the browser. Exposes window.renderSunoTrack(trackData, container).
// ============================================================

const {
  useState,
  useEffect,
  useRef
} = React;

// ============================================================
// INJECTED GLOBAL STYLES — keyframes + utility classes
// ============================================================
const GLOBAL_CSS = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .suno-animate { animation: fadeSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .suno-animate-1 { animation-delay: 0.05s; }
  .suno-animate-2 { animation-delay: 0.12s; }
  .suno-animate-3 { animation-delay: 0.19s; }
  .suno-animate-4 { animation-delay: 0.26s; }
  .suno-animate-5 { animation-delay: 0.33s; }
  .suno-animate-6 { animation-delay: 0.40s; }

  .suno-pill:hover {
    opacity: 1 !important;
    transform: translateY(-1px);
  }
  .suno-collapse-btn:hover {
    opacity: 1 !important;
  }
  .suno-nav-btn:hover {
    transform: translateY(-1px);
  }
  .suno-copy-btn:hover {
    opacity: 0.85;
  }

  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 3px;
  }
`;

// ============================================================
// GENRE THEMES
// ============================================================
const themes = {
  psychedelic: {
    accent: "#e8613a",
    accentDim: "#e8613a33",
    accentGlow: "#e8613a18",
    label: "Psychedelic"
  },
  electronic: {
    accent: "#38bdf8",
    accentDim: "#38bdf833",
    accentGlow: "#38bdf818",
    label: "Electronic"
  },
  hiphop: {
    accent: "#f5c842",
    accentDim: "#f5c84233",
    accentGlow: "#f5c84218",
    label: "Hip-Hop"
  },
  rnb: {
    accent: "#c084fc",
    accentDim: "#c084fc33",
    accentGlow: "#c084fc18",
    label: "R&B / Soul"
  },
  lofi: {
    accent: "#86efac",
    accentDim: "#86efac33",
    accentGlow: "#86efac18",
    label: "Lo-Fi"
  }
};

// ============================================================
// CHECKLIST LOGIC
// ============================================================
function buildChecklist(data) {
  const styleTags = data.stylePrompt.split(",").length;
  const hasExclude = data.excludeStyles && data.excludeStyles.trim().length > 0;
  const hasBPM = /\d+\s*bpm/i.test(data.stylePrompt);
  const hasStructure = data.lyrics.includes("[Verse") || data.lyrics.includes("[Chorus") || data.lyrics.includes("[Hook");
  const hasFadeOut = data.lyrics.includes("[Fade Out]") || data.lyrics.includes("[End]");
  const tagCount = (data.lyrics.match(/^\[/gm) || []).length;
  return [{
    label: "Style tags (4–8 ideal, ≤10 ok)",
    ok: styleTags >= 4 && styleTags <= 10,
    note: `${styleTags} tags`
  }, {
    label: "BPM in style prompt",
    ok: hasBPM,
    note: hasBPM ? `${data.metadata.BPM} BPM` : "Add BPM"
  }, {
    label: "Exclude field filled",
    ok: hasExclude,
    note: hasExclude ? "Set" : "Missing"
  }, {
    label: "Song structure present",
    ok: hasStructure,
    note: hasStructure ? "Structure ✓" : "Add structure"
  }, {
    label: "Clean ending tag",
    ok: hasFadeOut,
    note: hasFadeOut ? "[End] ✓" : "Add [End]"
  }, {
    label: "Meta-tags in lyrics",
    ok: tagCount >= 3,
    note: `${tagCount} tags`
  }];
}

// ============================================================
// COPY BUTTON
// ============================================================
function CopyButton({
  text,
  label,
  accent
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:absolute;left:-9999px;top:-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: handleCopy,
    className: "suno-copy-btn",
    style: {
      background: copied ? accent + "18" : "transparent",
      color: copied ? accent : accent + "bb",
      border: `1px solid ${copied ? accent + "66" : accent + "33"}`,
      borderRadius: "4px",
      padding: "5px 12px",
      fontSize: "10px",
      fontFamily: "monospace",
      cursor: "pointer",
      transition: "all 0.2s ease",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      whiteSpace: "nowrap"
    }
  }, copied ? "✓ Copied" : label);
}

// ============================================================
// BPM DISPLAY
// ============================================================
function BPMDisplay({
  bpm,
  accent,
  dark
}) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 120);
    }, 60 / bpm * 1000);
    return () => clearInterval(interval);
  }, [bpm]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "9px",
      height: "9px",
      borderRadius: "50%",
      background: pulse ? accent : accent + "33",
      boxShadow: pulse ? `0 0 10px 3px ${accent}55` : "none",
      transition: "all 0.08s ease",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "22px",
      fontWeight: "700",
      color: accent,
      fontFamily: "monospace",
      letterSpacing: "0.05em"
    }
  }, bpm), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "10px",
      color: dark ? "#555" : "#aaa",
      marginLeft: "4px",
      letterSpacing: "0.15em",
      textTransform: "uppercase"
    }
  }, "BPM")));
}

// ============================================================
// COLLAPSIBLE SECTION
// ============================================================
function CollapsibleSection({
  title,
  children,
  accent,
  dark,
  defaultOpen = true,
  animClass = ""
}) {
  const [open, setOpen] = useState(defaultOpen);
  const textDim = dark ? "#aaa" : "#44415a";
  return /*#__PURE__*/React.createElement("div", {
    className: `suno-animate ${animClass}`,
    style: {
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    className: "suno-collapse-btn",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0 0 10px 0",
      opacity: 0.85,
      transition: "opacity 0.2s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "10px",
      color: accent + "99",
      fontFamily: "monospace",
      letterSpacing: "0.1em",
      transition: "transform 0.25s ease",
      transform: open ? "rotate(0deg)" : "rotate(-90deg)"
    }
  }, "\u25BE")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      maxHeight: open ? "2000px" : "0",
      opacity: open ? 1 : 0,
      transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease"
    }
  }, children));
}

// ============================================================
// STYLE PROMPT PILLS
// ============================================================
function StylePills({
  text,
  accent,
  dark
}) {
  const pills = text.split(",").map(t => t.trim()).filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      padding: "14px 16px",
      background: dark ? "#0a0a18" : "#ffffff",
      border: `1px solid ${dark ? "#14142a" : "#e8e8e0"}`,
      borderRadius: "6px"
    }
  }, pills.map((pill, i) => {
    const isBPM = /\d+\s*bpm/i.test(pill);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "suno-pill",
      style: {
        display: "inline-block",
        padding: "3px 9px",
        background: isBPM ? accent + "22" : dark ? "#14142a" : "#f0f0ea",
        color: isBPM ? accent : dark ? "#8880a0" : "#555570",
        border: `1px solid ${isBPM ? accent + "55" : dark ? "#1e1e30" : "#ddddd5"}`,
        borderRadius: "3px",
        fontSize: "10px",
        fontFamily: "monospace",
        letterSpacing: "0.05em",
        opacity: 0.85,
        cursor: "default",
        transition: "all 0.15s ease"
      }
    }, pill);
  }));
}

// ============================================================
// GENERATION SETTINGS
// ============================================================
function GenerationSettings({
  settings,
  accent,
  dark
}) {
  const rowBg = dark ? "#0d0d1a" : "#f8f8f4";
  const rowBorder = dark ? "#16162a" : "#e4e4dc";
  const textMain = dark ? "#c0b8d4" : "#1a1a2e";
  const textDim = dark ? "#4a4870" : "#9090a0";
  const tickColor = dark ? "#252540" : "#d4d4cc";
  const rowStyle = {
    background: rowBg,
    border: `1px solid ${rowBorder}`,
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "8px"
  };
  const ToggleRow = ({
    label,
    value,
    options
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowStyle,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: textMain
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "4px",
      alignItems: "center"
    }
  }, options.map(opt => {
    const active = value === opt;
    return /*#__PURE__*/React.createElement("span", {
      key: opt,
      style: {
        padding: "5px 16px",
        borderRadius: "6px",
        fontSize: "12px",
        fontFamily: "monospace",
        letterSpacing: "0.04em",
        background: active ? dark ? "#e8e0f8" : "#1a1a2e" : "transparent",
        color: active ? dark ? "#0a0a18" : "#f0f0f8" : textDim,
        fontWeight: active ? "600" : "400"
      }
    }, opt);
  })));
  const NUM_TICKS = 12;
  const SliderRow = ({
    label,
    value
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowStyle
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: textMain
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      fontFamily: "monospace",
      color: accent,
      letterSpacing: "0.05em"
    }
  }, value, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "28px",
      display: "flex",
      alignItems: "center"
    }
  }, Array.from({
    length: NUM_TICKS + 1
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: `${i / NUM_TICKS * 100}%`,
      top: "50%",
      transform: "translateY(-50%)",
      width: "1.5px",
      height: i % 4 === 0 ? "14px" : "9px",
      background: tickColor,
      borderRadius: "1px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${value}%`,
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "11px",
      height: "26px",
      background: accent,
      borderRadius: "6px",
      boxShadow: `0 0 10px ${accent}88, 0 2px 4px rgba(0,0,0,0.4)`,
      zIndex: 1
    }
  })));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ToggleRow, {
    label: "Vocal Gender",
    value: settings.vocalGender,
    options: ["Male", "Female"]
  }), /*#__PURE__*/React.createElement(ToggleRow, {
    label: "Lyrics Mode",
    value: settings.lyricsMode,
    options: ["Manual", "Auto"]
  }), /*#__PURE__*/React.createElement(SliderRow, {
    label: "Weirdness",
    value: settings.weirdness
  }), /*#__PURE__*/React.createElement(SliderRow, {
    label: "Style Influence",
    value: settings.styleInfluence
  }), /*#__PURE__*/React.createElement(SliderRow, {
    label: "Audio Influence",
    value: settings.audioInfluence
  }));
}

// ============================================================
// CHECKLIST WITH PROGRESS BAR
// ============================================================
function Checklist({
  data,
  accent,
  dark,
  animClass = ""
}) {
  const items = buildChecklist(data);
  const passCount = items.filter(i => i.ok).length;
  const pct = Math.round(passCount / items.length * 100);
  const allGood = passCount === items.length;
  const textDim = dark ? "#aaa" : "#44415a";
  const cardBg = dark ? "#0a0a18" : "#f5f5f0";
  const cardBorder = allGood ? accent + "44" : "#ff444433";
  return /*#__PURE__*/React.createElement("div", {
    className: `suno-animate ${animClass}`,
    style: {
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: "6px",
      padding: "16px",
      marginBottom: "24px",
      boxShadow: dark ? `0 0 20px ${allGood ? accent + "0a" : "#ff44440a"} inset` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }
  }, "Suno Checklist"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "10px",
      color: allGood ? accent : "#ff6644",
      fontFamily: "monospace",
      letterSpacing: "0.05em"
    }
  }, passCount, "/", items.length, " ", allGood ? "✓" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "3px",
      background: dark ? "#14142a" : "#e0e0d8",
      borderRadius: "2px",
      marginBottom: "14px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: allGood ? accent : `linear-gradient(90deg, ${accent} 0%, #ff6644 100%)`,
      borderRadius: "2px",
      transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)"
    }
  })), items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: i < items.length - 1 ? "8px" : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      flexShrink: 0,
      background: item.ok ? accent + "1a" : "#ff444418",
      border: `1px solid ${item.ok ? accent + "77" : "#ff444477"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "9px",
      color: item.ok ? accent : "#ff6644"
    }
  }, item.ok ? "✓" : "✗"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      color: dark ? "#5a5580" : "#8880a0"
    }
  }, item.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "10px",
      color: item.ok ? accent + "88" : "#ff664488",
      fontFamily: "monospace"
    }
  }, item.note)))));
}

// ============================================================
// SECTION NAVIGATOR
// ============================================================
function SectionNavigator({
  lyrics,
  accent,
  dark,
  animClass = ""
}) {
  const sections = [];
  lyrics.split("\n").forEach((line, i) => {
    if (line.startsWith("[") && !line.startsWith("([")) {
      const label = line.replace(/\[|\]/g, "").split("|")[0].trim();
      const keys = ["Verse", "Chorus", "Hook", "Bridge", "Intro", "Outro", "Build", "Drop", "Breakdown", "Pre-Chorus", "Post-Chorus", "Instrumental", "Silence"];
      if (keys.some(k => label.startsWith(k)) && !sections.find(s => s.label === label)) {
        sections.push({
          label,
          id: `section-${i}`
        });
      }
    }
  });
  if (!sections.length) return null;
  const textDim = dark ? "#aaa" : "#44415a";
  const cardBg = dark ? "#0a0a18" : "#f5f5f0";
  const cardBorder = dark ? "#14142a" : "#e0e0d8";
  return /*#__PURE__*/React.createElement("div", {
    className: `suno-animate ${animClass}`,
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      padding: "12px 16px",
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: "6px",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      fontSize: "11px",
      color: textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: "6px"
    }
  }, "Jump to section"), sections.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "suno-nav-btn",
    onClick: () => {
      const el = document.getElementById(s.id);
      if (el) el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    },
    style: {
      background: "transparent",
      color: accent + "cc",
      border: `1px solid ${accent}33`,
      borderRadius: "3px",
      padding: "3px 9px",
      fontSize: "11px",
      fontFamily: "monospace",
      cursor: "pointer",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      transition: "all 0.15s ease"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = accent + "18";
      e.currentTarget.style.borderColor = accent + "66";
      e.currentTarget.style.color = accent;
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = accent + "33";
      e.currentTarget.style.color = accent + "cc";
    }
  }, s.label)));
}

// ============================================================
// LYRICS RENDERER
// ============================================================
function LyricsRenderer({
  lyrics,
  accent,
  dark
}) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const lines = lyrics.split("\n");
  const rendered = lines.map((line, i) => {
    const isTag = line.startsWith("[");
    const isAdLib = line.startsWith("(");
    const isEmpty = line.trim() === "";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      id: isTag ? `section-${i}` : undefined,
      onMouseEnter: () => isTag && setHoveredSection(i),
      onMouseLeave: () => setHoveredSection(null),
      style: {
        color: isTag ? accent : isAdLib ? dark ? "#7878b8" : "#6868a0" : dark ? "#c0b8d4" : "#222",
        fontFamily: isTag ? "monospace" : "'Georgia', serif",
        fontSize: isTag ? "10px" : isAdLib ? "12px" : "14px",
        letterSpacing: isTag ? "0.12em" : "0.01em",
        fontStyle: isAdLib ? "italic" : "normal",
        marginTop: isTag ? "18px" : "0",
        padding: isTag ? "4px 8px" : "0",
        background: isTag && hoveredSection === i ? accent + "12" : "transparent",
        borderLeft: isTag ? hoveredSection === i ? `2px solid ${accent}` : `2px solid ${accent}22` : "2px solid transparent",
        borderRadius: "2px",
        transition: "background 0.15s, border-color 0.15s",
        cursor: isTag ? "default" : "text",
        lineHeight: isEmpty ? "1" : "2.3",
        minHeight: isEmpty ? "14px" : "auto"
      }
    }, line || "\u00A0");
  });
  return /*#__PURE__*/React.createElement("div", null, rendered);
}

// ============================================================
// MAIN COMPONENT — receives trackData as prop
// ============================================================
function SunoTrack({
  trackData
}) {
  const [dark, setDark] = useState(true);
  const theme = themes[trackData.genre] || themes.psychedelic;
  const {
    accent
  } = theme;
  const bg = dark ? "#07070f" : "#f8f8f2";
  const cardBg = dark ? "#0a0a18" : "#ffffff";
  const cardBorder = dark ? "#14142a" : "#e8e8e0";
  const textMain = dark ? "#c8c0d8" : "#1a1a2e";
  const textDim = dark ? "#44415a" : "#999990";
  const cardShadow = dark ? `0 1px 24px ${accent}08, 0 0 0 1px ${cardBorder}` : `0 1px 8px rgba(0,0,0,0.06)`;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, GLOBAL_CSS), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      minHeight: "100vh",
      color: textMain,
      fontFamily: "'Georgia', serif",
      padding: "clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px)",
      maxWidth: "780px",
      margin: "0 auto",
      transition: "background 0.35s ease, color 0.35s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "suno-animate suno-animate-1",
    style: {
      marginBottom: "28px",
      borderBottom: `1px solid ${cardBorder}`,
      paddingBottom: "22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: accent,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: "10px",
      opacity: 0.85
    }
  }, "Anti-Cheese Elite Writing Lab \xB7 ", theme.label), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(28px, 6vw, 48px)",
      fontWeight: "300",
      color: dark ? "#e8e0f8" : "#0a0a1a",
      margin: "0 0 6px 0",
      letterSpacing: "0.14em"
    }
  }, trackData.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: textDim,
      letterSpacing: "0.1em"
    }
  }, trackData.metadata.Key, " \xB7 ", trackData.version, trackData.voice ? ` · Voice: ${trackData.voice}` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDark(!dark),
    style: {
      background: "transparent",
      border: `1px solid ${cardBorder}`,
      borderRadius: "4px",
      padding: "6px 14px",
      cursor: "pointer",
      color: textDim,
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: "monospace",
      transition: "all 0.2s ease"
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = accent + "55";
      e.currentTarget.style.color = accent + "99";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = cardBorder;
      e.currentTarget.style.color = textDim;
    }
  }, dark ? "☀ Light" : "☾ Dark"), /*#__PURE__*/React.createElement(BPMDisplay, {
    bpm: trackData.metadata.BPM,
    accent: accent,
    dark: !dark
  })))), /*#__PURE__*/React.createElement(CollapsibleSection, {
    title: "Style Prompt",
    accent: accent,
    dark: !dark,
    defaultOpen: true,
    animClass: "suno-animate-2"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "8px",
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(CopyButton, {
    text: trackData.stylePrompt,
    label: "Copy Style Prompt",
    accent: accent
  })), /*#__PURE__*/React.createElement(StylePills, {
    text: trackData.stylePrompt,
    accent: accent,
    dark: !dark
  })), trackData.excludeStyles && /*#__PURE__*/React.createElement(CollapsibleSection, {
    title: "Exclude Styles",
    accent: accent,
    dark: !dark,
    defaultOpen: true,
    animClass: "suno-animate-3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "8px",
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(CopyButton, {
    text: trackData.excludeStyles,
    label: "Copy Exclude Styles",
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: cardBg,
      border: "1px solid #ff444422",
      borderRadius: "6px",
      padding: "12px 16px",
      display: "flex",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, trackData.excludeStyles.split(",").map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      padding: "3px 9px",
      background: "#ff44440d",
      color: "#ff664488",
      border: "1px solid #ff444422",
      borderRadius: "3px",
      fontSize: "10px",
      fontFamily: "monospace",
      letterSpacing: "0.05em"
    }
  }, t.trim())))), /*#__PURE__*/React.createElement("div", {
    className: "suno-animate suno-animate-4",
    style: {
      marginBottom: "28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      flexWrap: "wrap",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }
  }, "Engineered Lyrics & Meta-Tags"), /*#__PURE__*/React.createElement(CopyButton, {
    text: trackData.lyrics,
    label: "Copy Lyrics",
    accent: accent
  })), /*#__PURE__*/React.createElement(SectionNavigator, {
    lyrics: trackData.lyrics,
    accent: accent,
    dark: !dark,
    animClass: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: cardBg,
      border: `1px solid ${accent}33`,
      borderRadius: "6px",
      padding: "clamp(16px, 3vw, 28px)",
      lineHeight: "2.3",
      boxShadow: dark ? `0 0 40px ${accent}18, 0 0 80px ${accent}08, 0 0 0 1px ${accent}22` : `0 2px 20px rgba(0,0,0,0.10)`
    }
  }, /*#__PURE__*/React.createElement(LyricsRenderer, {
    lyrics: trackData.lyrics,
    accent: accent,
    dark: !dark
  }))), /*#__PURE__*/React.createElement(CollapsibleSection, {
    title: "Generation Settings",
    accent: accent,
    dark: !dark,
    defaultOpen: true,
    animClass: "suno-animate-5"
  }, /*#__PURE__*/React.createElement(GenerationSettings, {
    settings: trackData.settings,
    accent: accent,
    dark: !dark
  })), /*#__PURE__*/React.createElement(Checklist, {
    data: trackData,
    accent: accent,
    dark: !dark,
    animClass: "suno-animate-5"
  }), /*#__PURE__*/React.createElement(CollapsibleSection, {
    title: "Track Metadata",
    accent: accent,
    dark: !dark,
    defaultOpen: false,
    animClass: "suno-animate-5"
  }, /*#__PURE__*/React.createElement("pre", {
    style: {
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: "6px",
      padding: "16px",
      fontSize: "11px",
      color: textDim,
      fontFamily: "monospace",
      overflowX: "auto",
      lineHeight: "1.9",
      margin: 0,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      boxShadow: cardShadow
    }
  }, JSON.stringify(trackData.metadata, null, 2))), /*#__PURE__*/React.createElement("div", {
    className: "suno-animate suno-animate-6",
    style: {
      marginTop: "24px",
      padding: "14px 18px",
      background: cardBg,
      borderLeft: `3px solid ${accent}`,
      borderRadius: "4px",
      boxShadow: dark ? `0 0 0 1px ${cardBorder}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: textDim,
      lineHeight: "1.8"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "Suno tip:"), " Paste Style Prompt \u2192 Style of Music field. Paste Lyrics \u2192 Lyrics field. Paste Exclude Styles \u2192 Exclude Styles field. Use Custom Mode for all three.", trackData.voice ? ` Set Voice/Persona to "${trackData.voice}".` : ""))));
}

// ============================================================
// GLOBAL EXPOSURE — called by the thin HTML loader
// ============================================================
window.renderSunoTrack = function (trackData, container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(SunoTrack, {
    trackData
  }));
};
