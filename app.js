const tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#fbfbfd"); tg.setBackgroundColor("#f2f2f7"); } catch (e) {}
}

const KEY = "norma.v2";
const EX = [
  { id: "squat", gear: "body", flat: true, avoid: [], name: "Присед к стулу", sets: 4, dose: "10–12", rest: 60, kind: "reps",
    steps: ["Пятки под тазом, стул сзади.", "Садитесь назад, колени смотрят в стороны носков.", "Коснитесь стула и встаньте, не отталкиваясь руками.", "Если колени ноют, садитесь выше."] },
  { id: "push", gear: "body", flat: true, avoid: ["shoulders"], name: "Отжимания", sets: 4, dose: "6–12", rest: 60, kind: "reps",
    steps: ["Ладони чуть шире плеч.", "Тело одна линия, локти примерно под 45°.", "Опуститесь, грудь ближе к полу, и выжмите себя.", "Тяжело — колени на пол, таз не задирайте."] },
  { id: "bridge", gear: "body", flat: true, avoid: [], name: "Ягодичный мост", sets: 3, dose: "12", rest: 45, kind: "reps",
    steps: ["Лёжа, стопы на полу, колени согнуты.", "Вытолкните таз вверх, сожмите ягодицы.", "Не прогибайте поясницу в верхней точке.", "Секунда вверху, медленно вниз."] },
  { id: "plank", gear: "body", flat: true, avoid: [], name: "Планка", sets: 3, dose: "30–40 с", rest: 40, kind: "time", seconds: 35,
    steps: ["Предплечья под плечами.", "Таз не выше и не ниже линии тела.", "Дышите, не задерживайте воздух.", "Поясница начала провисать — остановитесь."] },
  { id: "lunge", gear: "body", flat: true, avoid: ["knees"], name: "Выпад назад", sets: 3, dose: "8 на ногу", rest: 50, kind: "reps",
    steps: ["Шаг назад, передняя пятка на полу.", "Колено задней ноги мягко к полу, не бьёт его.", "Корпус почти вертикальный.", "Толкнитесь передней пяткой обратно."] },
  { id: "deadbug", gear: "body", flat: true, avoid: [], name: "Мёртвый жук", sets: 3, dose: "8 на сторону", rest: 40, kind: "reps",
    steps: ["На спине, поясница прижата к полу.", "Руки к потолку, колени над тазом.", "Выпрямите противоположные руку и ногу.", "Поясница оторвалась — укоротите движение."] },
  { id: "row-towel", gear: "body", flat: true, avoid: ["shoulders"], name: "Тяга полотенца под столом", sets: 4, dose: "8–10", rest: 60, kind: "reps",
    steps: ["Лягте под устойчивый стол, полотенце на край.", "Тяните грудь к краю, лопатки вместе.", "Не дёргайте шеей.", "Нет стола — пропустите и сделайте мост."] },
  { id: "jump", gear: "body", flat: false, avoid: ["knees", "back"], name: "Прыжки на месте", sets: 4, dose: "20 с", rest: 40, kind: "time", seconds: 20,
    steps: ["Мягкая обувь, колени чуть согнуты.", "Прыжок невысокий, приземление на всю стопу.", "Тихо, без хлопка пятками."] },
  { id: "swing", gear: "kb", flat: true, avoid: ["back"], name: "Мах гирей", sets: 4, dose: "12", rest: 50, kind: "reps",
    steps: ["Гиря в двух руках, ноги чуть шире плеч.", "Наклон из таза, спина ровная, гиря назад между ног.", "Резко выпрямите таз, руки не поднимают вес сами.", "Гиря до груди. Выше не забрасывайте."] },
  { id: "goblet", gear: "kb", flat: true, avoid: ["knees"], name: "Гоблет-присед", sets: 4, dose: "8–10", rest: 70, kind: "reps",
    steps: ["Гиря у груди, локти внутрь коленей.", "Садитесь между пяток.", "Колени идут за носками, пятки на полу.", "Встаньте, не заваливаясь вперёд."] },
  { id: "kb-row", gear: "kb", flat: true, avoid: ["back"], name: "Тяга гири в упоре", sets: 3, dose: "10 на руку", rest: 50, kind: "reps",
    steps: ["Одна рука на стул, спина почти параллельна полу.", "Тяните гирю к карману, локоть вдоль тела.", "Не крутите плечо.", "Опустите без рывка."] },
  { id: "pull", gear: "bar", flat: true, avoid: ["shoulders"], name: "Подтягивания", sets: 4, dose: "3–8", rest: 80, kind: "reps",
    steps: ["Хват чуть шире плеч.", "Начните с сведения лопаток, потом подбородок к перекладине.", "Опускайтесь 2–3 секунды.", "Не получается полный повтор — медленные негативы с прыжка на стул."] },
  { id: "knee", gear: "bar", flat: true, avoid: [], name: "Подъём коленей в висе", sets: 3, dose: "8–12", rest: 50, kind: "reps",
    steps: ["Повисните, плечи не у ушей.", "Подтяните колени к груди без раскачки.", "Таз чуть подкручен.", "Опустите медленно."] },
  { id: "hang", gear: "bar", flat: true, avoid: ["shoulders"], name: "Вис", sets: 3, dose: "20–30 с", rest: 40, kind: "time", seconds: 25,
    steps: ["Возьмитесь за турник.", "Плечи опущены, тело спокойно.", "Дышите.", "Хват сдался — отпуститесь на ноги, не спрыгивайте."] },
  { id: "db-press", gear: "db", flat: true, avoid: ["shoulders"], name: "Жим гантелей лёжа на полу", sets: 4, dose: "8–10", rest: 70, kind: "reps",
    steps: ["Лёжа, колени согнуты.", "Гантели над грудью.", "Опустите локти к полу и выжмите.", "Не стучите локтями о пол."] },
  { id: "db-row", gear: "db", flat: true, avoid: ["back"], name: "Тяга гантели", sets: 3, dose: "10 на руку", rest: 50, kind: "reps",
    steps: ["Упор коленом и рукой на стул.", "Тяните гантель к поясу.", "Лопатка идёт к позвоночнику.", "Корпус не крутите."] },
  { id: "band-row", gear: "band", flat: true, avoid: [], name: "Тяга резинки", sets: 4, dose: "12", rest: 45, kind: "reps",
    steps: ["Резинка на уровне груди, закреплена надёжно.", "Тяните локти назад, лопатки вместе.", "Верните руки медленно.", "Резинка не должна соскользнуть."] },
  { id: "band-squat", gear: "band", flat: true, avoid: ["knees"], name: "Присед с резинкой над коленями", sets: 3, dose: "12", rest: 45, kind: "reps",
    steps: ["Лента чуть выше коленей.", "Колени разводите в стороны против ленты.", "Присед до комфортной глубины.", "Пятки не отрывайте."] }
];

const RECOVERY = [
  { name: "Спокойная ходьба", dose: "25–40 мин", steps: ["Темп, при котором можете говорить.", "Без телефона у глаз, смотрите вперёд.", "Это тоже тренировочный день."] },
  { name: "Дыхание 4–6", dose: "5 мин", steps: ["Вдох на 4 счёта.", "Выдох на 6.", "Плечи не поднимайте."] }
];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || fresh(); }
  catch (e) { return fresh(); }
}
function fresh() {
  return {
    step: 0,
    profile: { name: "", sex: "m", age: "", height: "", weight: "", fat: "", goal: "cut", health: [], note: "", gear: [] },
    started: "",
    water: {},
    food: {},
    screen: "setup",
    day: 1,
    open: null
  };
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
function targets(p) {
  const w = +p.weight, h = +p.height, a = +p.age;
  let bmr = 10 * w + 6.25 * h - 5 * a + (p.sex === "f" ? -161 : 5);
  let kcal = bmr * 1.45;
  if (p.goal === "cut") kcal *= 0.82;
  if (p.goal === "muscle") kcal *= 1.08;
  return {
    kcal: Math.round(kcal),
    protein: Math.round(w * (p.goal === "cut" ? 1.8 : 1.6)),
    water: Math.round(w * 35),
    bmi: Math.round((w / ((h / 100) ** 2)) * 10) / 10
  };
}
function gearOf(p) {
  const g = p.gear.slice();
  if (!g.includes("body")) g.push("body");
  return g;
}
function pool(p) {
  const gear = gearOf(p);
  const fit = ex => gear.includes(ex.gear) && !p.health.some(h => ex.avoid.indexOf(h) >= 0);
  let list = EX.filter(fit);
  if (list.length < 5) list = EX.filter(ex => gear.includes(ex.gear));
  if (list.length < 4) list = EX.filter(ex => ex.gear === "body");
  return list;
}
function planDay(p, n) {
  if (n % 7 === 0) return { n, rest: true, title: "Восстановление", items: RECOVERY };
  const list = pool(p);
  const titles = ["Сила", "Плотность", "Корпус и спина"];
  const week = Math.ceil(n / 7);
  const start = (n * 2) % list.length;
  const items = [];
  for (let i = 0; i < Math.min(5, list.length); i++) {
    const src = list[(start + i) % list.length];
    const extra = week >= 3 && p.goal !== "cut" ? 1 : 0;
    items.push(Object.assign({}, src, { sets: src.sets + extra, week }));
  }
  return { n, rest: false, title: titles[(n - 1) % 3] + ", неделя " + week, items };
}
function courseDay() {
  if (!state.started) return 1;
  const a = new Date(state.started + "T00:00:00");
  const b = new Date(todayKey() + "T00:00:00");
  const diff = Math.round((b - a) / 86400000) + 1;
  return Math.max(1, Math.min(30, diff));
}
function goalLabel(g) {
  return g === "cut" ? "сжечь жир" : g === "muscle" ? "стать сильнее" : "держать форму";
}

let timer = null;
function clockText(sec) {
  sec = Math.max(0, sec | 0);
  return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
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
    if (state.clock.left <= 0) {
      state.clock.run = false;
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      render();
    }
  }, 1000);
}
function startClock(sec) {
  state.clock = { left: sec, total: sec, run: true };
  ensureTimer();
  render();
}

function render() {
  const app = document.getElementById("app");
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
      <div class="orb"></div>
      <div class="orb two"></div>
      <h1>Привет</h1>
      <p>Соберём курс на 30 дней под ваши цифры и то, что есть под рукой.</p>
      <button class="textbtn" data-act="next">Продолжить</button>
    </section>`;
  }
  const back = `<div class="nav"><button class="back" data-act="back">Назад</button></div>`;
  const dock = (act, label) => `<div class="dock"><button class="primary" data-act="${act}">${label}</button></div>`;
  if (s === 1) {
    return `<div class="page">
      ${back}
      <h1>О вас</h1>
      <div class="group">
        <label class="field"><span>Имя</span><input id="name" value="${esc(p.name)}" placeholder="Можно пропустить"></label>
      </div>
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
      <p class="warn" id="err"></p>
      ${dock("next", "Дальше")}
    </div>`;
  }
  if (s === 2) {
    const health = [["knees", "Колени"], ["back", "Спина"], ["shoulders", "Плечи"]];
    return `<div class="page">
      ${back}
      <h1>Здоровье</h1>
      <p class="lead">Отметьте, что лучше не нагружать. Это не диагноз: при боли сначала к врачу.</p>
      <div class="group">
        ${health.map(([id, label]) => `<button class="tick ${p.health.indexOf(id) >= 0 ? "on" : ""}" data-toggle="health" data-val="${id}"><span>${label}</span><i class="mark"></i></button>`).join("")}
      </div>
      <div class="group">
        <label class="field"><span>Своими словами</span><textarea id="note" placeholder="После работы ноет поясница">${esc(p.note)}</textarea></label>
      </div>
      ${dock("next", "Дальше")}
    </div>`;
  }
  if (s === 3) {
    const gear = [["kb", "Гиря"], ["bar", "Турник"], ["db", "Гантели"], ["band", "Резинка"]];
    return `<div class="page">
      ${back}
      <h1>Инвентарь</h1>
      <p class="lead">Можно несколько. Если ничего нет, курс будет на своём теле.</p>
      <div class="group">
        ${gear.map(([id, label]) => `<button class="tick ${p.gear.indexOf(id) >= 0 ? "on" : ""}" data-toggle="gear" data-val="${id}"><span>${label}</span><i class="mark"></i></button>`).join("")}
      </div>
      ${dock("next", "Дальше")}
    </div>`;
  }
  const goals = [["cut", "Сжечь жир"], ["muscle", "Стать сильнее"], ["keep", "Держать форму"]];
  return `<div class="page">
    ${back}
    <h1>Цель</h1>
    <div class="group">
      ${goals.map(([id, label]) => `<button class="tick ${p.goal === id ? "on" : ""}" data-set="goal" data-val="${id}"><span>${label}</span><i class="mark"></i></button>`).join("")}
    </div>
    <p class="lead">30 дней. Шесть рабочих и один спокойный. С третьей недели, если цель не «сжечь жир», добавляется подход.</p>
    ${dock("finish", "Собрать курс")}
  </div>`;
}

function readInputs() {
  const p = state.profile;
  ["name", "age", "height", "weight", "fat", "note"].forEach(id => {
    const el = document.getElementById(id);
    if (el) p[id] = el.value.trim();
  });
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

function mainHtml() {
  const p = state.profile;
  const t = targets(p);
  const day = state.day || courseDay();
  const block = planDay(p, day);
  const key = todayKey();
  const glasses = state.water[key] || 0;
  const drunk = glasses * 250;
  const meals = state.food[key] || [];
  const kcal = meals.reduce((s, m) => s + (+m.kcal || 0), 0);
  const protein = meals.reduce((s, m) => s + (+m.p || 0), 0);
  if (state.screen === "food") return foodHtml(t, meals, kcal, protein);
  if (state.screen === "move" && state.open) return moveHtml(block);
  return `<div class="page">
    <div class="top">
      <div>
        <div class="kicker">День ${day} из 30</div>
        <h1>${esc(p.name || "Сегодня")}</h1>
      </div>
      <button class="link" data-act="reset">Сначала</button>
    </div>
    <div class="stats">
      <div class="stat"><b>${t.kcal}</b><span>ккал</span></div>
      <div class="stat"><b>${t.protein}</b><span>белок, г</span></div>
      <div class="stat"><b>${t.bmi}</b><span>индекс</span></div>
    </div>
    <div class="card">
      <div class="top"><b>Вода</b><span class="kicker">${drunk} / ${t.water} мл</span></div>
      <div class="bar"><i style="width:${Math.min(100, (drunk / t.water) * 100)}%"></i></div>
      <button class="primary" data-act="water">+ 250 мл</button>
    </div>
    <button class="tick" data-act="food" style="border-radius:16px"><span><b>Еда</b><br><small style="color:#6e6e73">${kcal} ккал · белок ${protein} г</small></span><span class="chev">›</span></button>
    <div>
      <div class="kicker" style="margin-bottom:8px">${esc(goalLabel(p.goal))}</div>
      <h1 style="font-size:28px">${esc(block.title)}</h1>
      ${p.note ? `<p class="lead" style="margin-top:8px">${esc(p.note)}</p>` : ""}
      <div class="group" style="margin-top:12px">
        ${block.items.map((ex, i) => `<button class="tick ex" data-act="open" data-i="${i}"><span><b>${esc(ex.name)}</b><small>${block.rest ? esc(ex.dose) : ex.sets + " × " + esc(ex.dose)}</small></span><span class="chev">›</span></button>`).join("")}
      </div>
    </div>
    <div class="days">${Array.from({ length: 30 }, (_, i) => `<button class="day ${day === i + 1 ? "on" : ""}" data-day="${i + 1}">${i + 1}</button>`).join("")}</div>
  </div>`;
}

function foodHtml(t, meals, kcal, protein) {
  return `<div class="page">
    <div class="nav"><button class="back" data-act="home">Назад</button></div>
    <h1>${kcal}</h1>
    <p class="lead">из ${t.kcal} ккал · белок ${protein} из ${t.protein} г. Цифры вводите сами.</p>
    <div class="group">
      <label class="field"><span>Что съели</span><input id="meal" placeholder="Гречка, курица"></label>
      <div class="row2">
        <label class="field"><span>Ккал</span><input id="mkcal" inputmode="numeric"></label>
        <label class="field"><span>Белок, г</span><input id="mp" inputmode="decimal"></label>
      </div>
    </div>
    <p class="warn" id="err"></p>
    <div class="group">${meals.map((m, i) => `<div class="tick food"><span><b>${esc(m.name)}</b><br><small style="color:#6e6e73">${m.kcal} ккал · ${m.p} г</small></span><button class="link" data-act="delmeal" data-i="${i}">Убрать</button></div>`).join("") || `<p class="lead" style="padding:16px">Пока пусто.</p>`}</div>
    <div class="dock"><button class="primary" data-act="addmeal">Добавить</button></div>
  </div>`;
}

function moveHtml(block) {
  const ex = block.items[state.open];
  if (!ex) { state.screen = "home"; return mainHtml(); }
  const clock = state.clock;
  const left = clock ? clock.left : (ex.kind === "time" ? (ex.seconds || 40) : 40);
  return `<div class="page">
    <div class="nav"><button class="back" data-act="home">Назад</button></div>
    <p class="kicker">${esc(ex.dose || "")}</p>
    <h1>${esc(ex.name)}</h1>
    ${block.rest ? "" : `<p class="lead">${ex.sets} подхода · отдых ${ex.rest || 45} с</p>`}
    <ol class="steps">${(ex.steps || []).map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    <div class="card">
      <div class="timer" id="clock">${clockText(left)}</div>
      <div class="bar"><i id="clockbar" style="width:${clock ? Math.max(0, (clock.left / clock.total) * 100) : 100}%"></i></div>
      <div class="pair">
        <button class="primary" data-act="go" data-sec="${ex.kind === "time" ? (ex.seconds || 40) : 40}">${ex.kind === "time" ? "Старт" : "40 секунд"}</button>
        <button class="ghost" data-act="rest" data-sec="${ex.rest || 45}">Отдых</button>
      </div>
      <button class="ghost" style="width:100%;margin-top:8px" data-act="stop">Стоп</button>
    </div>
  </div>`;
}

function bind() {
  const app = document.getElementById("app");
  app.onclick = ev => {
    const el = ev.target.closest("[data-act], [data-set], [data-toggle], [data-day]");
    if (!el) return;
    if (el.dataset.set) {
      readInputs();
      state.profile[el.dataset.set] = el.dataset.val;
      render();
      return;
    }
    if (el.dataset.toggle) {
      readInputs();
      const key = el.dataset.toggle;
      const val = el.dataset.val;
      const arr = state.profile[key];
      const i = arr.indexOf(val);
      if (i >= 0) arr.splice(i, 1); else arr.push(val);
      render();
      return;
    }
    if (el.dataset.day) {
      state.day = +el.dataset.day;
      state.screen = "home";
      state.open = null;
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
        if (msg) { const e = document.getElementById("err"); if (e) e.textContent = msg; return; }
      }
      state.step += 1;
      render();
    } else if (act === "finish") {
      readInputs();
      state.started = todayKey();
      state.day = 1;
      state.screen = "home";
      render();
    } else if (act === "water") {
      const k = todayKey();
      state.water[k] = (state.water[k] || 0) + 1;
      render();
    } else if (act === "food") {
      state.screen = "food";
      render();
    } else if (act === "home") {
      state.screen = "home";
      state.open = null;
      render();
    } else if (act === "open") {
      state.open = +el.dataset.i;
      state.screen = "move";
      state.clock = null;
      render();
    } else if (act === "go" || act === "rest") {
      startClock(+el.dataset.sec);
    } else if (act === "stop") {
      if (state.clock) state.clock.run = false;
      render();
    } else if (act === "addmeal") {
      const name = document.getElementById("meal").value.trim();
      const kcal = +document.getElementById("mkcal").value;
      const p = +document.getElementById("mp").value || 0;
      if (!name || !(kcal > 0)) { document.getElementById("err").textContent = "Нужны название и калории."; return; }
      const k = todayKey();
      state.food[k] = state.food[k] || [];
      state.food[k].push({ name, kcal: Math.round(kcal), p: Math.round(p) });
      render();
    } else if (act === "delmeal") {
      const k = todayKey();
      (state.food[k] || []).splice(+el.dataset.i, 1);
      render();
    } else if (act === "reset") {
      if (confirm("Стереть анкету, еду и воду на этом телефоне?")) {
        state = fresh();
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

render();
