const POSE = {
  walk: "walk", squat: "squat", push: "push", wallpush: "push", bridge: "bridge",
  plank: "plank", deadbug: "bug", birddog: "dog", lunge: "lunge", crunch: "core",
  legrise: "core", kick: "bridge", superman: "dog", angel: "press", chin: "breath",
  chairdip: "push", pike: "push", towelcurl: "curl", calf: "walk", hinge: "hinge",
  step: "lunge", jump: "jump", rowtowel: "row",
  swing: "hinge", goblet: "squat", kbrow: "row", kbpress: "press", kbdead: "hinge", kbcurl: "curl",
  dbpress: "push", dbrow: "row", dbcurl: "curl", dblat: "press", dbohp: "press", dbrdl: "hinge",
  bbsquat: "squat", bbrdl: "hinge", bbrow: "row", bbohp: "press", bbcurl: "curl",
  pull: "pull", hang: "pull", knees: "core", ausrow: "row",
  dips: "push", ringrow: "row", ringpush: "push",
  bandrow: "row", bandpull: "press", bandcurl: "curl", bandtri: "press", bandsquat: "squat",
  bandglute: "lunge", pallof: "twist",
  trxrow: "row", trxcurl: "curl",
  rope: "jump", bike: "bike", hill: "walk", jog: "walk",
  benchpress: "push", split: "lunge", wheel: "core", ballbridge: "bridge", ballcrunch: "core",
  platesquat: "squat", platetwist: "twist",
  packrow: "row", packsquat: "squat", packcurl: "curl", packrdl: "hinge"
};

const GLYPH = {
  squat: `<circle cx="32" cy="20" r="4.5"/><path d="M32 24.5 V34"/><path d="M32 29 L20 35"/><path d="M32 29 L44 35"/><path d="M32 34 L17 38 L15 54"/><path d="M32 34 L47 38 L49 54"/>`,
  push: `<circle cx="15" cy="27" r="4.5"/><path d="M19 29 L47 33"/><path d="M23 30 L14 42"/><path d="M47 33 L55 45"/>`,
  hinge: `<circle cx="18" cy="27" r="4.5"/><path d="M22 29 L42 38"/><path d="M30 32 L27 46"/><path d="M42 38 L35 54"/><path d="M42 38 L51 54"/>`,
  row: `<circle cx="16" cy="29" r="4.5"/><path d="M20 31 L42 40"/><path d="M28 34 L21 41 L31 37"/><path d="M42 40 L35 54"/><path d="M42 40 L51 54"/>`,
  press: `<circle cx="32" cy="22" r="4.5"/><path d="M32 26.5 V40"/><path d="M32 32 L21 12"/><path d="M32 32 L43 12"/><path d="M32 40 L24 54"/><path d="M32 40 L40 54"/>`,
  curl: `<circle cx="32" cy="12" r="4.5"/><path d="M32 16.5 V34"/><path d="M32 23 L21 33 L23 20"/><path d="M32 23 L43 33 L41 20"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  plank: `<circle cx="13" cy="30" r="4.5"/><path d="M17 31 L48 31"/><path d="M23 31 L16 43"/><path d="M48 31 L56 42"/>`,
  bridge: `<circle cx="12" cy="36" r="4.5"/><path d="M16 38 L33 20 L49 38 L57 50"/>`,
  lunge: `<circle cx="36" cy="13" r="4.5"/><path d="M36 17.5 V30"/><path d="M36 23 L26 29"/><path d="M36 23 L46 26"/><path d="M36 30 L48 38 L48 54"/><path d="M36 30 L14 46 L8 54"/>`,
  pull: `<path d="M15 10 H49"/><circle cx="32" cy="18" r="4.5"/><path d="M24 10 L29 16"/><path d="M40 10 L35 16"/><path d="M32 22.5 V40"/><path d="M32 40 L25 54"/><path d="M32 40 L39 54"/>`,
  jump: `<circle cx="32" cy="20" r="4.5"/><path d="M32 24.5 V33"/><path d="M32 28 L19 15"/><path d="M32 28 L45 15"/><path d="M32 33 L22 45"/><path d="M32 33 L42 45"/>`,
  bike: `<circle cx="16" cy="46" r="7.5"/><circle cx="48" cy="46" r="7.5"/><path d="M16 46 L31 33 L48 46"/><path d="M31 33 L36 46"/><circle cx="41" cy="20" r="4.2"/><path d="M39 24 L32 33"/>`,
  walk: `<circle cx="30" cy="12" r="4.5"/><path d="M30 16.5 V30"/><path d="M30 22 L19 30"/><path d="M30 22 L43 16"/><path d="M30 30 L43 44 L47 54"/><path d="M30 30 L17 42 L13 52"/>`,
  twist: `<circle cx="32" cy="13" r="4.5"/><path d="M32 17.5 V34"/><path d="M32 24 L13 19"/><path d="M32 24 L51 33"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  breath: `<circle cx="32" cy="16" r="4.5"/><path d="M32 20.5 V36"/><path d="M32 27 L18 35"/><path d="M32 27 L46 35"/><path d="M32 36 L24 54"/><path d="M32 36 L40 54"/><path d="M12 30 Q8 36 12 42"/><path d="M52 30 Q56 36 52 42"/>`,
  core: `<circle cx="14" cy="32" r="4.5"/><path d="M18 34 L34 26 L52 36"/><path d="M40 30 L47 18 L54 28"/>`,
  bug: `<circle cx="13" cy="40" r="4.5"/><path d="M17 40 H42"/><path d="M26 40 L18 24"/><path d="M34 40 L48 24"/><path d="M42 40 L54 50"/>`,
  dog: `<circle cx="14" cy="28" r="4.5"/><path d="M18 31 L46 35"/><path d="M24 32 L18 45"/><path d="M38 33 L44 46"/><path d="M26 30 L18 16"/><path d="M42 34 L56 22"/>`
};

function poseOf(ex) {
  if (ex && ex.id && POSE[ex.id]) return POSE[ex.id];
  const name = (ex && ex.name) || "";
  if (/дых/.test(name)) return "breath";
  if (/ходьб|бег|горк/.test(name)) return "walk";
  return "squat";
}

const START = {
  squat: `<circle cx="32" cy="12" r="4.5"/><path d="M32 16.5 V34"/><path d="M32 22 L22 30"/><path d="M32 22 L42 30"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  push: `<circle cx="16" cy="20" r="4.5"/><path d="M20 22 L48 24"/><path d="M23 23 L12 38"/><path d="M48 24 L56 38"/>`,
  hinge: `<circle cx="32" cy="12" r="4.5"/><path d="M32 16.5 V34"/><path d="M32 22 L22 30"/><path d="M32 22 L42 30"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  row: `<circle cx="16" cy="29" r="4.5"/><path d="M20 31 L42 40"/><path d="M28 34 L24 48"/><path d="M42 40 L35 54"/><path d="M42 40 L51 54"/>`,
  press: `<circle cx="32" cy="22" r="4.5"/><path d="M32 26.5 V40"/><path d="M32 32 L23 24"/><path d="M32 32 L41 24"/><path d="M32 40 L24 54"/><path d="M32 40 L40 54"/>`,
  curl: `<circle cx="32" cy="12" r="4.5"/><path d="M32 16.5 V34"/><path d="M32 23 L22 40"/><path d="M32 23 L42 40"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  plank: `<circle cx="14" cy="22" r="4.5"/><path d="M18 25 L34 16 L50 28"/><path d="M24 20 L18 38"/><path d="M50 28 L56 40"/>`,
  bridge: `<circle cx="12" cy="40" r="4.5"/><path d="M16 42 L52 42 L58 50"/>`,
  lunge: `<circle cx="32" cy="12" r="4.5"/><path d="M32 16.5 V34"/><path d="M32 22 L22 30"/><path d="M32 22 L42 30"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  pull: `<path d="M15 10 H49"/><circle cx="32" cy="32" r="4.5"/><path d="M22 10 L28 28"/><path d="M42 10 L36 28"/><path d="M32 36.5 V48"/><path d="M32 48 L24 58"/><path d="M32 48 L40 58"/>`,
  jump: `<circle cx="32" cy="30" r="4.5"/><path d="M32 34.5 V42"/><path d="M32 38 L22 34"/><path d="M32 38 L42 34"/><path d="M32 42 L22 54"/><path d="M32 42 L42 54"/>`,
  bike: `<circle cx="16" cy="46" r="7.5"/><circle cx="48" cy="46" r="7.5"/><path d="M16 46 L31 33 L48 46"/><path d="M31 33 L24 48"/><circle cx="41" cy="20" r="4.2"/><path d="M39 24 L32 33"/>`,
  walk: `<circle cx="34" cy="12" r="4.5"/><path d="M34 16.5 V30"/><path d="M34 22 L45 30"/><path d="M34 22 L22 16"/><path d="M34 30 L22 44 L18 54"/><path d="M34 30 L46 42 L50 52"/>`,
  twist: `<circle cx="32" cy="13" r="4.5"/><path d="M32 17.5 V34"/><path d="M32 24 L13 33"/><path d="M32 24 L51 19"/><path d="M32 34 L24 54"/><path d="M32 34 L40 54"/>`,
  breath: `<circle cx="32" cy="18" r="4.5"/><path d="M32 22.5 V38"/><path d="M32 28 L24 34"/><path d="M32 28 L40 34"/><path d="M32 38 L25 54"/><path d="M32 38 L39 54"/>`,
  core: `<circle cx="12" cy="38" r="4.5"/><path d="M16 40 L50 40"/><path d="M36 40 L44 28 L54 36"/>`,
  bug: `<circle cx="13" cy="36" r="4.5"/><path d="M17 38 H48"/><path d="M26 38 L22 50"/><path d="M34 38 L42 50"/><path d="M44 38 L54 48"/>`,
  dog: `<circle cx="16" cy="30" r="4.5"/><path d="M20 33 L44 36"/><path d="M26 34 L20 46"/><path d="M36 35 L42 47"/><path d="M30 33 L26 22"/><path d="M40 35 L46 24"/>`
};

function glyph(pose) {
  return `<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true">${GLYPH[pose] || GLYPH.squat}</svg>`;
}

function demo(pose) {
  const key = START[pose] ? pose : "squat";
  return `<svg class="demo" viewBox="0 0 64 64" aria-hidden="true"><g class="a">${START[key]}</g><g class="b">${GLYPH[key]}</g></svg>`;
}

function stick(pose) {
  return `<svg class="stick" data-pose="${pose}" viewBox="0 0 200 140" aria-hidden="true">
    <g class="man">
      <g class="upper">
        <circle class="head" cx="100" cy="34" r="8"></circle>
        <path d="M100 42 V74"></path>
        <g class="arm l"><path d="M100 52 L76 68"></path></g>
        <g class="arm r"><path d="M100 52 L124 68"></path></g>
      </g>
      <g class="leg l"><path d="M100 74 L84 114"></path></g>
      <g class="leg r"><path d="M100 74 L116 114"></path></g>
    </g>
  </svg>`;
}
