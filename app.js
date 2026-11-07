const tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#fbfbfd"); tg.setBackgroundColor("#f2f2f7"); } catch (e) {}
}

const KEY = "norma.v3";
const OLD_HEALTH = { knees: "knee", back: "low-back", shoulders: "shoulder" };
const GOALS = {
  cut: { label: "Сжечь жир", kcal: 0.82, protein: 1.8, focus: null },
  muscle: { label: "Стать сильнее", kcal: 1.08, protein: 1.8, focus: null },
  keep: { label: "Держать форму", kcal: 1, protein: 1.6, focus: null },
  abs: { label: "Пресс за 30 дней", kcal: 0.88, protein: 1.8, focus: ["abs"] },
  biceps: { label: "Бицепс за 30 дней", kcal: 1.06, protein: 1.8, focus: ["biceps"] },
  triceps: { label: "Трицепс за 30 дней", kcal: 1.06, protein: 1.8, focus: ["triceps"] },
  chest: { label: "Грудь за 30 дней", kcal: 1.06, protein: 1.8, focus: ["chest"] },
  back: { label: "Спина за 30 дней", kcal: 1.06, protein: 1.8, focus: ["back"] },
  legs: { label: "Ноги за 30 дней", kcal: 1.06, protein: 1.8, focus: ["legs"] },
  shoulders: { label: "Плечи за 30 дней", kcal: 1.06, protein: 1.8, focus: ["shoulders"] },
  glutes: { label: "Ягодицы за 30 дней", kcal: 1.06, protein: 1.8, focus: ["glutes"] },
  arms: { label: "Руки за 30 дней", kcal: 1.06, protein: 1.8, focus: ["biceps", "triceps"] },
  posture: { label: "Осанка за 30 дней", kcal: 1, protein: 1.6, focus: ["posture"] }
};
const NEAR = {
  abs: ["posture"], biceps: ["back"], triceps: ["chest"], chest: ["triceps", "shoulders"],
  back: ["biceps", "posture"], legs: ["glutes"], shoulders: ["chest", "posture"],
  glutes: ["legs"], posture: ["back", "shoulders"]
};
const PATTERN_RU = {
  impact: "прыжков и бега", jump: "прыжков", run: "бега", "deep-knee": "глубоких приседов и выпадов",
  twist: "скручиваний корпуса", hinge: "наклонов с весом", "spinal-flex": "складок вперёд",
  crunch: "скручиваний на пресс", "plank-hard": "долгой планки", overhead: "жима вверх",
  shoulder: "отжиманий и жимов", dip: "брусьев", "elbow-load": "сгибаний и разгибаний локтя",
  grip: "долгого виса", wrist: "упора на кисти", neck: "нагрузки на шею",
  inversion: "стоек вниз головой", valsalva: "задержки дыхания", isometric: "долгого упора",
  prone: "лежания на животе", balance: "стоек на одной ноге", "supine-long": "долгого лежания на спине",
  "calf-load": "подъёмов на носки", bike: "велосипеда"
};
const LINE_POOL = {
  start: [
    "{who}, начали.",
    "{who}, время пошло.",
    "{who}, приступайте.",
    "{who}, я засеку.",
    "{who}, {move}. Можно начинать.",
    "{who}, спокойно и ровно. Начали.",
    "{who}, не спешите. Время пошло.",
    "{who}, работаем."
  ],
  ten: [
    "{who}, осталось десять секунд.",
    "{who}, десять секунд.",
    "{who}, ещё десять.",
    "{who}, финиш близко. Десять секунд.",
    "{who}, держитесь, десять секунд.",
    "{who}, почти всё. Десять секунд.",
    "{who}, не сбавляйте. Десять.",
    "{who}, осталось десять, потом выдох."
  ],
  rest: [
    "{who}, отдых. Дышите ровно.",
    "{who}, пауза. Плечи вниз.",
    "{who}, переведите дыхание.",
    "{who}, отдых. Руки можно опустить.",
    "{who}, хорошая работа. Отдыхайте.",
    "{who}, стоп. Вдох и длинный выдох.",
    "{who}, пауза. Не проверяйте телефон."
  ],
  done: [
    "{who}, время.",
    "{who}, достаточно на этот отрезок.",
    "{who}, стоп.",
    "{who}, время вышло.",
    "{who}, можно опустить.",
    "{who}, хватит. Дышите ровно."
  ],
  next: [
    "{who}, можно продолжать.",
    "{who}, следующий подход.",
    "{who}, когда будете готовы.",
    "{who}, отдых кончился.",
    "{who}, возвращаемся.",
    "{who}, ещё подход, если есть силы."
  ],
  over: [
    "{who}, на сегодня достаточно.",
    "{who}, тренировка закрыта.",
    "{who}, вы сделали своё. Хватит.",
    "{who}, хороший день. Отпускаю вас.",
    "{who}, на этом всё.",
    "{who}, курс на сегодня выполнен."
  ]
};

function fresh() {
  return {
    step: 0,
    profile: {
      name: "", sex: "m", age: "", height: "", weight: "", fat: "",
      neck: "", waist: "", hips: "", goal: "cut", health: [], note: "", gear: [], voice: true
    },
    started: "", water: {}, food: {}, screen: "setup", day: 1, open: null
  };
}
function migrate(data) {
  const p = data.profile || {};
  p.health = (p.health || []).map(id => OLD_HEALTH[id] || id).filter(id => HEALTH_BY[id]);
  if (!GOALS[p.goal]) p.goal = "cut";
  if (p.voice == null) p.voice = true;
  ["neck", "waist", "hips", "note", "name", "fat"].forEach(k => { if (p[k] == null) p[k] = ""; });
  p.gear = p.gear || [];
  data.profile = p;
  data.screen = data.screen || "setup";
  return data;
}
function load() {
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem("norma.v2");
    if (!raw) return fresh();
    return migrate(JSON.parse(raw));
  } catch (e) { return fresh(); }
}
let state = load();
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function goalMeta(id) { return GOALS[id] || GOALS.cut; }
function targets(p) {
  const w = +p.weight, h = +p.height, a = +p.age;
  const meta = goalMeta(p.goal);
  let kcal = (10 * w + 6.25 * h - 5 * a + (p.sex === "f" ? -161 : 5)) * 1.45 * meta.kcal;
  return {
    kcal: Math.round(kcal),
    protein: Math.round(w * meta.protein),
    water: Math.round(w * 35),
    bmi: Math.round((w / ((h / 100) ** 2)) * 10) / 10
  };
}
function navyFat(p) {
  const h = +p.height / 2.54, neck = +p.neck / 2.54, waist = +p.waist / 2.54, hip = +p.hips / 2.54;
  if (!(h > 0 && neck > 0 && waist > neck + 1)) return null;
  let bf;
  if (p.sex === "f") {
    if (!(hip > 0 && waist + hip > neck + 1)) return null;
    bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
  } else {
    bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
  }
  return isFinite(bf) ? Math.round(bf * 10) / 10 : null;
}
function gearOf(p) {
  const g = (p.gear || []).slice();
  if (g.indexOf("body") < 0) g.push("body");
  return g;
}
function hasGear(ex, owned) {
  const ok = String(ex.gear).split("|").some(g => g === "body" || owned.indexOf(g) >= 0);
  return ok && (!ex.also || owned.indexOf(ex.also) >= 0);
}
function healthFlags(p) {
  const ids = (p.health || []).slice();
  matchHealth(p.note || "").forEach(id => { if (ids.indexOf(id) < 0) ids.push(id); });
  const items = ids.map(id => HEALTH_BY[id]).filter(Boolean);
  const avoid = new Set();
  items.forEach(it => (it.avoid || []).forEach(tag => avoid.add(tag)));
  const stop = items.some(it => it.level === "stop");
  return { items: items, avoid: avoid, stop: stop, easy: !stop && items.some(it => it.level === "easy") };
}
function allowedMoves(p, flags) {
  const owned = gearOf(p);
  const ok = ex => hasGear(ex, owned) && !ex.bad.some(tag => flags.avoid.has(tag));
  let list = EX.filter(ex => ok(ex) && (!flags.easy || ex.easy));
  if (list.length < 3) list = EX.filter(ex => ex.gear === "body" && ex.easy && ok(ex));
  return list;
}
function pickPool(list, focus) {
  if (!focus) return list;
  const primary = list.filter(ex => ex.focus.some(tag => focus.indexOf(tag) >= 0));
  if (primary.length >= 4) return primary;
  const near = NEAR[focus[0]] || [];
  const extra = list.filter(ex => primary.indexOf(ex) < 0 && ex.focus.some(tag => near.indexOf(tag) >= 0));
  const out = primary.concat(extra);
  return out.length >= 3 ? out : out.concat(list.filter(ex => out.indexOf(ex) < 0)).slice(0, 8);
}
function planDay(p, n) {
  const flags = healthFlags(p);
  const meta = goalMeta(p.goal);
  if (flags.stop || n % 7 === 0) {
    return { n: n, rest: true, title: flags.stop ? "Спокойный день" : "Восстановление", items: RECOVERY, flags: flags };
  }
  let list = pickPool(allowedMoves(p, flags), meta.focus);
  if (!list.length) return { n: n, rest: true, title: "Спокойный день", items: RECOVERY, flags: flags };
  const week = Math.ceil(n / 7);
  const extra = week >= 3 && meta.kcal > 1 && !flags.easy ? 1 : 0;
  const start = (n * 3) % list.length;
  const items = [];
  const count = Math.min(5, list.length);
  for (let i = 0; i < count; i++) {
    const src = list[(start + i) % list.length];
    items.push(Object.assign({}, src, { sets: Math.min(6, src.sets + extra) }));
  }
  const title = meta.focus ? meta.label.replace(" за 30 дней", "") + ", день " + n : ["Сила", "Плотность", "Корпус и спина"][(n - 1) % 3] + ", неделя " + week;
  return { n: n, rest: false, title: title, items: items, flags: flags };
}
function courseDay() {
  if (!state.started) return 1;
  const a = new Date(state.started + "T00:00:00");
  const b = new Date(todayKey() + "T00:00:00");
  return Math.max(1, Math.min(30, Math.round((b - a) / 86400000) + 1));
}
function avoidText(flags) {
  const skip = new Set();
  if (flags.avoid.has("impact")) { skip.add("jump"); skip.add("run"); }
  const words = [];
  flags.avoid.forEach(tag => {
    if (skip.has(tag)) return;
    const word = PATTERN_RU[tag];
    if (word && words.indexOf(word) < 0) words.push(word);
  });
  return words.slice(0, 4).join(", ");
}

let timer = null;
let lastTemplate = "";
function clockText(sec) {
  sec = Math.max(0, sec | 0);
  return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
}
function currentMove() {
  if (state.open == null) return null;
  const block = planDay(state.profile, state.day || courseDay());
  return block.items[state.open] || null;
}
function fillLine(template, who, move) {
  return template.replace(/\{who\}/g, who).replace(/\{move\}/g, move);
}
function composeLine(kind) {
  const who = state.profile.sex === "f" ? "Мэм" : "Сэр";
  const moveName = (currentMove() || {}).name || "";
  const move = moveName.toLowerCase();
  let pool = (LINE_POOL[kind] || LINE_POOL.done).filter(template => move || template.indexOf("{move}") < 0);
  if (!pool.length) pool = LINE_POOL.done;
  let template = pool[Math.floor(Math.random() * pool.length)];
  for (let i = 0; i < 6 && template === lastTemplate && pool.length > 1; i++) {
    template = pool[Math.floor(Math.random() * pool.length)];
  }
  lastTemplate = template;
  return fillLine(template, who, move);
}
function russianVoice() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  return voices.find(v => /ru/i.test(v.lang) && /dmitry|pavel|male/i.test(v.name)) || voices.find(v => /ru/i.test(v.lang)) || null;
}
function speakLive(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ru-RU";
  utter.rate = 0.9;
  utter.pitch = 0.8;
  const voice = russianVoice();
  if (voice) utter.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}
function say(id) {
  const text = composeLine(id);
  if (state.clock) state.clock.line = text;
  const line = document.getElementById("said");
  if (line) line.textContent = text;
  if (state.profile.voice === false) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    return;
  }
  speakLive(text);
}
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}
function ensureTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (!state.clock || !state.clock.run) return;
    state.clock.left -= 1;
    const el = document.getElementById("clock");
    const bar = document.getElementById("clockbar");
    if (el) el.textContent = clockText(state.clock.left);
    if (bar) bar.style.width = Math.max(0, (state.clock.left / state.clock.total) * 100) + "%";
    if (!state.clock.warned && state.clock.left === 10 && state.clock.total > 10) {
      state.clock.warned = true;
      say("ten");
    }
    if (state.clock.left <= 0) {
      state.clock.run = false;
      say(state.clock.mode === "rest" ? "next" : "done");
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      render();
    }
  }, 1000);
}
function startClock(sec, mode) {
  state.clock = { left: sec, total: sec, run: true, mode: mode, warned: false, line: "" };
  ensureTimer();
  say(mode === "rest" ? "rest" : "start");
  render();
}

let healthQuery = "";
let healthGroup = "Все";
let picked = null;
let localHits = [];
let offHits = [];
let foodTimer = 0;
let scanning = false;
let scanStream = null;
let zxing = null;

function render() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = state.screen === "setup" ? setupHtml() : mainHtml();
  bind();
  syncTelegram();
  save();
}

function setupHtml() {
  const p = state.profile;
  const s = state.step;
  if (s === 0) {
    return `<section class="hello">
      <div class="orb"></div><div class="orb two"></div>
      <h1>Привет</h1>
      <p>Соберём курс на 30 дней под ваши цифры, здоровье и то, что есть под рукой.</p>
      <button class="textbtn" data-act="next">Продолжить</button>
    </section>`;
  }
  const back = `<div class="nav"><button class="back" data-act="back">Назад</button></div>`;
  const dock = (act, label) => `<div class="dock"><button class="primary" data-act="${act}">${label}</button></div>`;
  if (s === 1) {
    return `<div class="page">${back}<h1>О вас</h1>
      <div class="group"><label class="field"><span>Имя</span><input id="name" value="${esc(p.name)}" placeholder="Можно пропустить"></label></div>
      <div class="seg">
        <button class="${p.sex === "m" ? "on" : ""}" data-set="sex" data-val="m">Мужчина</button>
        <button class="${p.sex === "f" ? "on" : ""}" data-set="sex" data-val="f">Женщина</button>
      </div>
      <div class="group row2">
        <label class="field"><span>Возраст</span><input id="age" inputmode="numeric" value="${esc(p.age)}" placeholder="32"></label>
        <label class="field"><span>Рост, см</span><input id="height" inputmode="numeric" value="${esc(p.height)}" placeholder="178"></label>
      </div>
      <div class="group row2">
        <label class="field"><span>Вес, кг</span><input id="weight" inputmode="decimal" value="${esc(p.weight)}" placeholder="80"></label>
        <label class="field"><span>Жир, %</span><input id="fat" inputmode="decimal" value="${esc(p.fat)}" placeholder="если знаете"></label>
      </div>
      <details class="hint">
        <summary>Как измерить жир</summary>
        <p>Это оценка сантиметром, не исследование в клинике. Поле выше можно оставить пустым.</p>
        <ol>
          <li>Утром, до еды и тренировки.</li>
          <li>Лента плотно, без вдавливания, параллельно полу.</li>
          <li>Шея — под кадыком, спереди чуть ниже.</li>
          <li>Талия: мужчинам на уровне пупка, женщинам в самом узком месте. Живот не втягивать.</li>
          <li>Бёдра женщинам — самая широкая точка, ноги вместе.</li>
        </ol>
        <div class="group" style="margin-top:10px">
          <div class="row2">
            <label class="field"><span>Шея, см</span><input id="neck" inputmode="decimal" value="${esc(p.neck)}" placeholder="38"></label>
            <label class="field"><span>Талия, см</span><input id="waist" inputmode="decimal" value="${esc(p.waist)}" placeholder="84"></label>
          </div>
          ${p.sex === "f" ? `<label class="field"><span>Бёдра, см</span><input id="hips" inputmode="decimal" value="${esc(p.hips)}" placeholder="98"></label>` : ""}
        </div>
        <button class="ghost wide" data-act="fatcalc" style="margin-top:10px">Посчитать %</button>
      </details>
      <p class="warn" id="err"></p>
      ${dock("next", "Дальше")}</div>`;
  }
  if (s === 2) return healthHtml(p, back, dock);
  if (s === 3) {
    return `<div class="page">${back}<h1>Инвентарь</h1>
      <p class="lead">Стул, пол и своё тело есть всегда, их отмечать не нужно. Можно несколько.</p>
      ${GEAR_GROUPS.map(group => `<div><div class="kicker">${esc(group[0])}</div><div class="group">${group[1].map(item => tick("gear", item[0], item[1], p.gear.indexOf(item[0]) >= 0)).join("")}</div></div>`).join("")}
      ${dock("next", "Дальше")}</div>`;
  }
  const base = [["cut", "Сжечь жир"], ["muscle", "Стать сильнее"], ["keep", "Держать форму"]];
  const order = p.sex === "f"
    ? ["glutes", "abs", "legs", "back", "posture", "arms", "biceps", "triceps", "chest", "shoulders"]
    : ["abs", "chest", "back", "arms", "biceps", "triceps", "shoulders", "legs", "glutes", "posture"];
  return `<div class="page">${back}<h1>Цель</h1>
    <div class="kicker">Общая</div>
    <div class="group">${base.map(item => tick("goal", item[0], item[1], p.goal === item[0], true)).join("")}</div>
    <div class="kicker">За 30 дней</div>
    <div class="group">${order.map(id => tick("goal", id, GOALS[id].label, p.goal === id, true)).join("")}</div>
    <p class="lead">Шесть рабочих дней и один спокойный. На таймере Джарвис каждый раз собирает новую фразу: сэр или мэм — по полу из анкеты.</p>
    ${dock("finish", "Собрать курс")}</div>`;
}
function tick(key, id, label, on, single) {
  const attr = single ? `data-set="${key}"` : `data-toggle="${key}"`;
  return `<button class="tick ${on ? "on" : ""}" ${attr} data-val="${esc(id)}"><span>${esc(label)}</span><i class="mark"></i></button>`;
}
function healthHtml(p, back, dock) {
  const groups = ["Все"];
  HEALTH.forEach(item => { if (groups.indexOf(item.g) < 0) groups.push(item.g); });
  const chosen = (p.health || []).map(id => HEALTH_BY[id]).filter(Boolean);
  const guessed = matchHealth(p.note || "").filter(id => (p.health || []).indexOf(id) < 0).map(id => HEALTH_BY[id]).filter(Boolean);
  return `<div class="page">${back}<h1>Здоровье</h1>
    <p class="lead">Отметьте диагноз или напишите его своими словами. Это подбор нагрузки, не назначение врача. Острую боль не тренируйте.</p>
    ${chosen.length ? `<div class="group">${chosen.map(item => `<div class="tick"><span><b>${esc(item.n)}</b><small class="note">${esc(item.note)}</small></span></div>`).join("")}</div>` : ""}
    <div class="group"><label class="field"><span>Поиск</span><input id="hq" value="${esc(healthQuery)}" placeholder="грыжа, колено, астма"></label></div>
    <div class="chips">${groups.map(g => `<button class="chip ${healthGroup === g ? "on" : ""}" data-act="hgroup" data-val="${esc(g)}">${esc(g)}</button>`).join("")}</div>
    <div class="group">${HEALTH.map(item => `<button class="tick ${p.health.indexOf(item.id) >= 0 ? "on" : ""}" data-toggle="health" data-val="${esc(item.id)}" data-health-item data-group="${esc(item.g)}" data-name="${esc(foodText(item.n))}"><span>${esc(item.n)}</span><i class="mark"></i></button>`).join("")}</div>
    <div class="group"><label class="field"><span>Или напишите свой диагноз</span><textarea id="note" placeholder="Грыжа диска, давление, астма">${esc(p.note)}</textarea></label></div>
    <p class="lead" id="guess">${guessed.length ? "Из текста добавится: " + guessed.map(item => item.n).join(", ") + "." : (p.note ? "Этого диагноза нет в списке. Он останется заметкой, а при боли останавливайтесь сами." : "")}</p>
    ${dock("next", "Дальше")}</div>`;
}

function mainHtml() {
  const p = state.profile;
  const t = targets(p);
  const day = state.day || courseDay();
  const block = planDay(p, day);
  const key = todayKey();
  const drunk = (state.water[key] || 0) * 250;
  const meals = state.food[key] || [];
  const kcal = meals.reduce((sum, meal) => sum + (+meal.kcal || 0), 0);
  const protein = meals.reduce((sum, meal) => sum + (+meal.p || 0), 0);
  if (state.screen === "food") return foodHtml(t, meals, kcal, protein);
  if (state.screen === "move" && state.open != null) return moveHtml(block);
  const banned = avoidText(block.flags);
  return `<div class="page">
    <div class="top"><div><div class="kicker">День ${day} из 30</div><h1>${esc(p.name || "Сегодня")}</h1></div><button class="link" data-act="reset">Сначала</button></div>
    <div class="stats"><div class="stat"><b>${t.kcal}</b><span>ккал</span></div><div class="stat"><b>${t.protein}</b><span>белок, г</span></div><div class="stat"><b>${t.bmi}</b><span>индекс</span></div></div>
    <div class="card"><div class="top"><b>Вода</b><span class="kicker">${drunk} / ${t.water} мл</span></div><div class="bar"><i style="width:${Math.min(100, t.water ? (drunk / t.water) * 100 : 0)}%"></i></div><button class="primary" data-act="water">+ 250 мл</button></div>
    <button class="tick" data-act="food" style="border-radius:16px"><span><b>Еда</b><br><small style="color:#6e6e73">${Math.round(kcal)} ккал · белок ${Math.round(protein)} г</small></span><span class="chev">›</span></button>
    <div>
      <div class="kicker" style="margin-bottom:8px">${esc(goalMeta(p.goal).label)}</div>
      <h1 style="font-size:28px">${esc(block.title)}</h1>
      ${block.flags.stop ? `<p class="lead" style="margin-top:8px">Отмечено состояние, при котором обычный курс лучше не включать. Сегодня ходьба и дыхание.</p>` : ""}
      ${banned ? `<p class="lead" style="margin-top:8px">Сегодня без: ${esc(banned)}.</p>` : ""}
      <div class="group" style="margin-top:12px">${block.items.map((ex, i) => `<button class="tick ex" data-act="open" data-i="${i}"><span><b>${esc(ex.name)}</b><small>${block.rest ? esc(ex.dose) : ex.sets + " × " + esc(ex.dose)}</small></span><span class="chev">›</span></button>`).join("")}</div>
    </div>
    <div class="days">${Array.from({ length: 30 }, (_, i) => `<button class="day ${day === i + 1 ? "on" : ""}" data-day="${i + 1}">${i + 1}</button>`).join("")}</div>
  </div>`;
}
function foodHtml(t, meals, kcal, protein) {
  return `<div class="page">
    <div class="nav"><button class="back" data-act="home">Назад</button></div>
    <h1>${Math.round(kcal)}</h1>
    <p class="lead">из ${t.kcal} ккал · белок ${Math.round(protein)} из ${t.protein} г. Своя база: Беларусь, Россия и привычные продукты. Упаковку ищет Open Food Facts.</p>
    <div class="group">
      <label class="field"><span>Название</span><input id="q" placeholder="творог, драники, гречка"></label>
      <button class="tick" data-act="scan"><span>Сканировать штрихкод</span><span class="chev">›</span></button>
      <div class="row2">
        <label class="field"><span>Цифры штрихкода</span><input id="code" inputmode="numeric" placeholder="4810…"></label>
        <button class="ghost" data-act="lookup" style="margin:12px">Найти</button>
      </div>
    </div>
    <p class="warn" id="foodmsg"></p>
    <div id="hits"></div>
    <div id="pick"></div>
    <details class="hint"><summary>Ввести калории вручную</summary>
      <div class="group" style="margin-top:10px">
        <label class="field"><span>Что съели</span><input id="meal" placeholder="Своё блюдо"></label>
        <div class="row2">
          <label class="field"><span>Ккал</span><input id="mkcal" inputmode="numeric"></label>
          <label class="field"><span>Белок, г</span><input id="mp" inputmode="decimal"></label>
        </div>
      </div>
      <button class="ghost wide" data-act="addmeal" style="margin-top:10px">Добавить вручную</button>
    </details>
    <div class="group">${meals.map((meal, i) => `<div class="tick food"><span><b>${esc(meal.name)}</b><br><small style="color:#6e6e73">${meal.kcal} ккал · ${meal.p} г</small></span><button class="link" data-act="delmeal" data-i="${i}">Убрать</button></div>`).join("") || `<p class="lead" style="padding:16px">Пока пусто.</p>`}</div>
    <div id="scan" class="scan" hidden>
      <p class="lead" id="scanmsg" style="color:#fff;padding:16px">Наведите камеру на штрихкод.</p>
      <div id="scan-box"></div>
      <button class="primary" data-act="scan-close" style="margin:16px;width:auto">Закрыть</button>
    </div>
  </div>`;
}
function moveHtml(block) {
  const ex = block.items[state.open];
  if (!ex) { state.screen = "home"; return mainHtml(); }
  const clock = state.clock;
  const left = clock ? clock.left : (ex.kind === "time" ? (ex.seconds || 40) : 40);
  const who = state.profile.sex === "f" ? "мэм" : "сэр";
  return `<div class="page">
    <div class="nav"><button class="back" data-act="home">Назад</button><button class="link" data-act="mute">${state.profile.voice === false ? "Голос выкл" : "Джарвис"}</button></div>
    <p class="kicker">${esc(ex.dose || "")}</p>
    <h1>${esc(ex.name)}</h1>
    ${block.rest ? "" : `<p class="lead">${ex.sets} подхода · отдых ${ex.rest || 45} с</p>`}
    <ol class="steps">${(ex.steps || []).map(step => `<li>${esc(step)}</li>`).join("")}</ol>
    <div class="card">
      <div class="timer" id="clock">${clockText(left)}</div>
      <p class="jarvis" id="said">${esc(clock && clock.line || "Фраза собирается в момент старта. На десяти секундах " + who + " услышит новый вариант.")}</p>
      <div class="bar"><i id="clockbar" style="width:${clock ? Math.max(0, (clock.left / clock.total) * 100) : 100}%"></i></div>
      <div class="pair">
        <button class="primary" data-act="go" data-sec="${ex.kind === "time" ? (ex.seconds || 40) : 40}">${ex.kind === "time" ? "Старт" : "40 секунд"}</button>
        <button class="ghost" data-act="rest" data-sec="${ex.rest || 45}">Отдых</button>
      </div>
      <button class="ghost wide" data-act="stop">Стоп</button>
      <button class="ghost wide" data-act="over">Джарвис, закончили</button>
    </div>
  </div>`;
}

function readInputs() {
  const p = state.profile;
  ["name", "age", "height", "weight", "fat", "neck", "waist", "hips", "note"].forEach(id => {
    const el = document.getElementById(id);
    if (el) p[id] = el.value.trim();
  });
  const hq = document.getElementById("hq");
  if (hq) healthQuery = hq.value;
}
function validBody() {
  const p = state.profile;
  const age = +p.age, h = +p.height, w = +p.weight;
  if (!(age >= 16 && age <= 80)) return "Возраст: от 16 до 80.";
  if (!(h >= 140 && h <= 220)) return "Рост в сантиметрах, от 140 до 220.";
  if (!(w >= 40 && w <= 220)) return "Вес в килограммах, от 40 до 220.";
  if (p.fat && !(+p.fat >= 3 && +p.fat <= 60)) return "Процент жира, если указываете: от 3 до 60.";
  return "";
}
function foodMsg(text) {
  const el = document.getElementById("foodmsg");
  if (el) el.textContent = text || "";
}
function mealPortion(item, grams) {
  return {
    name: item.n + ", " + grams + " г" + (item.approx ? ", примерно" : ""),
    kcal: Math.round(item.k * grams / 100),
    p: Math.round(item.p * grams / 10) / 10
  };
}
function showPick(item) {
  picked = item;
  const box = document.getElementById("pick");
  if (!box) return;
  const grams = item.g || 100;
  box.innerHTML = `<div class="card"><b>${esc(item.n)}</b><p class="lead">${item.where ? FOOD_WHERE[item.where] + " · " : ""}на 100 г: ${Math.round(item.k)} ккал, ${item.p} г белка${item.approx ? " · среднее для блюда" : ""}</p><label class="field"><span>Сколько грамм</span><input id="grams" inputmode="decimal" value="${grams}"></label><p class="lead" id="preview"></p><button class="primary" data-act="addpick">Добавить</button></div>`;
  const input = document.getElementById("grams");
  const preview = () => {
    const g = +input.value;
    const line = document.getElementById("preview");
    if (!line) return;
    if (!(g > 0)) { line.textContent = "Укажите граммы."; return; }
    const meal = mealPortion(item, g);
    line.textContent = "Выйдет " + meal.kcal + " ккал и " + meal.p + " г белка.";
  };
  input.oninput = preview;
  preview();
}
function drawHits() {
  const box = document.getElementById("hits");
  if (!box) return;
  const local = localHits.map((item, i) => `<button class="tick" data-act="pick" data-i="${i}"><span><b>${esc(item.n)}</b><small class="note">${FOOD_WHERE[item.where] || ""} · ${item.k} ккал / 100 г</small></span></button>`).join("");
  const remote = offHits.map(item => `<button class="tick" data-act="offcode" data-code="${esc(item.code)}"><span><b>${esc(item.n)}</b><small class="note">штрихкод ${esc(item.code)}</small></span></button>`).join("");
  box.innerHTML = (local || remote) ? `<div class="group">${local}${remote ? `<div class="kicker" style="padding:10px 16px 0">С упаковок</div>${remote}` : ""}</div>` : "";
}
async function searchOff(query) {
  try {
    const res = await fetch("https://search.openfoodfacts.org/search?page_size=5&q=" + encodeURIComponent(query));
    if (!res.ok) return;
    const data = await res.json();
    if (document.getElementById("q") && document.getElementById("q").value.trim() !== query) return;
    offHits = (data.hits || []).map(hit => ({
      code: hit.code,
      n: [hit.product_name, Array.isArray(hit.brands) ? hit.brands[0] : ""].filter(Boolean).join(", ")
    })).filter(hit => hit.code && hit.n);
    drawHits();
  } catch (e) { offHits = []; }
}
function onFoodQuery() {
  const input = document.getElementById("q");
  if (!input) return;
  const query = input.value.trim();
  localHits = searchFoods(query);
  offHits = [];
  drawHits();
  clearTimeout(foodTimer);
  if (query.length >= 2) foodTimer = setTimeout(() => searchOff(query), 500);
}
async function lookupBarcode(code) {
  const clean = String(code || "").replace(/\D/g, "");
  if (clean.length < 8 || clean.length > 14) { foodMsg("Штрихкод: от 8 до 14 цифр."); return; }
  const known = foodByCode(clean);
  if (known) { foodMsg(""); showPick(known); return; }
  foodMsg("Ищу упаковку…");
  try {
    const res = await fetch("https://world.openfoodfacts.org/api/v2/product/" + clean + ".json?fields=product_name,product_name_ru,brands,nutriments,serving_quantity,status");
    if (!res.ok) throw new Error("down");
    const data = await res.json();
    if (!data || data.status !== 1 || !data.product) { foodMsg("Такого штрихкода в базе нет. Можно ввести калории вручную."); return; }
    const nut = data.product.nutriments || {};
    let kcal = +nut["energy-kcal_100g"];
    if (!isFinite(kcal)) {
      const kj = +nut["energy-kj_100g"] || +nut.energy_100g;
      if (isFinite(kj)) kcal = kj / 4.184;
    }
    if (!isFinite(kcal)) { foodMsg("У этой упаковки нет калорий на 100 г. Введите вручную."); return; }
    const protein = +nut.proteins_100g;
    const serving = +data.product.serving_quantity;
    showPick({
      n: [data.product.product_name_ru || data.product.product_name || "Продукт", data.product.brands].filter(Boolean).join(", "),
      k: Math.round(kcal),
      p: isFinite(protein) ? Math.round(protein * 10) / 10 : 0,
      g: serving >= 5 && serving <= 500 ? Math.round(serving) : 100,
      where: "world"
    });
    foodMsg("");
  } catch (e) { foodMsg("База штрихкодов не ответила. Можно ввести калории вручную."); }
}
function stopScan() {
  scanning = false;
  if (scanStream) scanStream.getTracks().forEach(track => track.stop());
  scanStream = null;
  if (zxing) { const current = zxing; zxing = null; current.stop().catch(() => {}); }
  const root = document.getElementById("scan");
  if (root) root.hidden = true;
}
async function openScan() {
  const root = document.getElementById("scan");
  const msg = document.getElementById("scanmsg");
  if (!root) return;
  root.hidden = false;
  scanning = true;
  const found = code => { stopScan(); const input = document.getElementById("code"); if (input) input.value = String(code).replace(/\D/g, ""); lookupBarcode(code); };
  try {
    if ("BarcodeDetector" in window) {
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.muted = true;
      const box = document.getElementById("scan-box");
      box.innerHTML = "";
      box.appendChild(video);
      scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      video.srcObject = scanStream;
      await video.play();
      const detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
      const loop = async () => {
        if (!scanning) return;
        try {
          const codes = await detector.detect(video);
          if (codes[0]) { found(codes[0].rawValue); return; }
        } catch (e) {}
        requestAnimationFrame(loop);
      };
      loop();
      return;
    }
    if (window.Html5Qrcode) {
      const formats = ["EAN_13", "EAN_8", "UPC_A", "UPC_E", "CODE_128"].map(name => Html5QrcodeSupportedFormats[name]).filter(Boolean);
      zxing = new Html5Qrcode("scan-box");
      await zxing.start({ facingMode: "environment" }, { fps: 8, qrbox: { width: 240, height: 120 }, formatsToSupport: formats }, found, () => {});
      return;
    }
    if (msg) msg.textContent = "Камера в этом окне недоступна. Введите цифры штрихкода.";
  } catch (e) {
    if (msg) msg.textContent = "Камера не открылась. Введите цифры вручную.";
    stopScan();
  }
}
function pushMeal(name, kcal, p) {
  const key = todayKey();
  state.food[key] = state.food[key] || [];
  state.food[key].push({ name: name, kcal: Math.round(kcal), p: Math.round(p * 10) / 10 });
}
function applyHealthFilter() {
  const query = foodText(healthQuery);
  document.querySelectorAll("[data-health-item]").forEach(el => {
    const okQ = !query || (el.dataset.name || "").indexOf(query) >= 0;
    const okG = healthGroup === "Все" || el.dataset.group === healthGroup;
    el.style.display = okQ && okG ? "" : "none";
  });
}

function bind() {
  const app = document.getElementById("app");
  const hq = document.getElementById("hq");
  if (hq) {
    hq.oninput = () => { healthQuery = hq.value; applyHealthFilter(); };
    applyHealthFilter();
  }
  const note = document.getElementById("note");
  if (note) note.oninput = () => {
    state.profile.note = note.value;
    const box = document.getElementById("guess");
    if (!box) return;
    const extra = matchHealth(note.value).filter(id => state.profile.health.indexOf(id) < 0).map(id => HEALTH_BY[id]).filter(Boolean);
    box.textContent = extra.length ? "Из текста добавится: " + extra.map(item => item.n).join(", ") + "." : (note.value.trim() ? "Этого диагноза нет в списке. Он останется заметкой, а при боли останавливайтесь сами." : "");
  };
  const query = document.getElementById("q");
  if (query) query.oninput = onFoodQuery;
  app.onclick = ev => {
    const el = ev.target.closest("[data-act], [data-set], [data-toggle], [data-day]");
    if (!el || el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
    if (el.dataset.set) {
      readInputs();
      state.profile[el.dataset.set] = el.dataset.val;
      render();
      return;
    }
    if (el.dataset.toggle) {
      readInputs();
      const arr = state.profile[el.dataset.toggle];
      const at = arr.indexOf(el.dataset.val);
      if (at >= 0) arr.splice(at, 1); else arr.push(el.dataset.val);
      render();
      return;
    }
    if (el.dataset.day) {
      state.day = +el.dataset.day;
      state.screen = "home";
      state.open = null;
      state.clock = null;
      render();
      return;
    }
    const act = el.dataset.act;
    if (act === "back") {
      readInputs();
      if (state.step > 0) state.step -= 1;
      render();
    } else if (act === "next") {
      readInputs();
      if (state.step === 1) {
        const msg = validBody();
        if (msg) { const err = document.getElementById("err"); if (err) err.textContent = msg; return; }
      }
      if (state.step === 2) matchHealth(state.profile.note).forEach(id => { if (state.profile.health.indexOf(id) < 0) state.profile.health.push(id); });
      state.step += 1;
      render();
    } else if (act === "hgroup") {
      readInputs();
      healthGroup = el.dataset.val;
      render();
    } else if (act === "fatcalc") {
      readInputs();
      const bf = navyFat(state.profile);
      const err = document.getElementById("err");
      if (bf == null || bf < 3 || bf > 60) { if (err) err.textContent = "Цифры не сходятся: талия должна быть больше шеи, женщинам нужны ещё бёдра."; return; }
      state.profile.fat = String(bf);
      render();
    } else if (act === "finish") {
      readInputs();
      state.started = todayKey();
      state.day = 1;
      state.screen = "home";
      render();
    } else if (act === "water") {
      const key = todayKey();
      state.water[key] = (state.water[key] || 0) + 1;
      render();
    } else if (act === "food") {
      state.screen = "food";
      picked = null;
      localHits = [];
      offHits = [];
      render();
    } else if (act === "home") {
      stopScan();
      state.screen = "home";
      state.open = null;
      render();
    } else if (act === "open") {
      state.open = +el.dataset.i;
      state.screen = "move";
      state.clock = null;
      render();
    } else if (act === "go") startClock(+el.dataset.sec, "work");
    else if (act === "rest") startClock(+el.dataset.sec, "rest");
    else if (act === "stop") {
      if (state.clock) state.clock.run = false;
      if (window.speechSynthesis) speechSynthesis.cancel();
      render();
    } else if (act === "mute") {
      state.profile.voice = state.profile.voice === false;
      if (state.profile.voice === false && window.speechSynthesis) speechSynthesis.cancel();
      render();
    } else if (act === "over") say("over");
    else if (act === "pick") showPick(localHits[+el.dataset.i]);
    else if (act === "offcode") lookupBarcode(el.dataset.code);
    else if (act === "lookup") lookupBarcode(document.getElementById("code").value);
    else if (act === "scan") openScan();
    else if (act === "scan-close") stopScan();
    else if (act === "addpick") {
      const grams = +document.getElementById("grams").value;
      if (!picked || !(grams >= 1 && grams <= 2000)) { foodMsg("Граммы от 1 до 2000."); return; }
      const meal = mealPortion(picked, grams);
      pushMeal(meal.name, meal.kcal, meal.p);
      picked = null;
      render();
    } else if (act === "addmeal") {
      const name = document.getElementById("meal").value.trim();
      const kcal = +document.getElementById("mkcal").value;
      const protein = +document.getElementById("mp").value || 0;
      if (!name || !(kcal > 0)) { foodMsg("Нужны название и калории."); return; }
      pushMeal(name, kcal, protein);
      render();
    } else if (act === "delmeal") {
      (state.food[todayKey()] || []).splice(+el.dataset.i, 1);
      render();
    } else if (act === "reset") {
      if (confirm("Стереть анкету, еду и воду на этом телефоне?")) {
        state = fresh();
        healthQuery = "";
        healthGroup = "Все";
        save();
        render();
      }
    }
  };
}
function syncTelegram() {
  if (!tg) return;
  if (!tg.__normaBound) {
    tg.__normaBound = true;
    tg.MainButton.onClick(() => {
      const btn = document.querySelector("[data-act=next], [data-act=finish]");
      if (btn) btn.click();
    });
  }
  if (state.screen !== "setup") { tg.MainButton.hide(); return; }
  const labels = ["Продолжить", "Дальше", "Дальше", "Дальше", "Собрать курс"];
  tg.MainButton.setText(labels[state.step] || "Дальше");
  tg.MainButton.show();
}

if (typeof document !== "undefined") render();
