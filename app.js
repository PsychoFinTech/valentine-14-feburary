const el = (id) => document.getElementById(id);

const state = {
  step: 1,
  cfg: null,
  love: 120
};

function setThemeColors(cfg) {
  const c = cfg.colors;
  document.documentElement.style.setProperty("--bg1", c.backgroundStart);
  document.documentElement.style.setProperty("--bg2", c.backgroundEnd);
  document.documentElement.style.setProperty("--btn", c.buttonBackground);
  document.documentElement.style.setProperty("--btnHover", c.buttonHover);
  document.documentElement.style.setProperty("--text", c.textColor);
  document.title = cfg.pageTitle || "Valentine";
}

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function spawnFloat() {
  const cfg = state.cfg;
  if (!cfg) return;

  const pool = [...cfg.floatingEmojis.hearts, ...cfg.floatingEmojis.bears];
  const node = document.createElement("div");
  node.className = "float";
  node.textContent = pick(pool);

  node.style.left = `${rand(5, 95)}%`;
  node.style.setProperty("--drift", `${rand(-120, 120)}px`);
  node.style.setProperty("--rot", `${rand(-45, 45)}deg`);
  node.style.animationDuration = `${cfg.animations.floatLifetimeMs / 1000}s`;

  el("bg").appendChild(node);
  setTimeout(() => node.remove(), cfg.animations.floatLifetimeMs + 300);
}

async function setStage(html, controlsHtmlOrNodes = []) {
  const stage = el("stage");
  if (!stage) return;
  
  // fade out
  stage.classList.remove("pop");
  stage.classList.add("fade-out");
  
  await new Promise(r => setTimeout(r, 150));
  
  stage.innerHTML = html;
  setControls(controlsHtmlOrNodes);
  
  stage.classList.remove("fade-out");
  void stage.offsetWidth; // trigger reflow
  stage.classList.add("pop");
}

function setControls(buttons) {
  const wrap = el("controls");
  if (!wrap) return;
  wrap.innerHTML = "";
  buttons.forEach((b) => wrap.appendChild(b));
}

function makeBtn(text, className) {
  const b = document.createElement("button");
  b.className = `btn ${className || ""}`.trim();
  b.textContent = text;
  return b;
}

function showLoading() {
  setStage(`
    <div class="big">Loading...</div>
    <div class="small">Preparing something special 💖</div>
  `);
}

function showInitError(err) {
  console.error(err);
  setStage(`
    <div class="big">Oops! Something went wrong 😵</div>
    <div class="small">Couldn't load customization.</div>
  `);
}

function showDrama(text) {
  setStage(`
    <div class="big">${text}</div>
    <div class="small">Rejection is being processed…</div>
  `);
  for (let i = 0; i < 25; i++) setTimeout(() => spawnFloat(), i * 40);
}

function forceLove() {
  let count = 3;

  const tick = () => {
    setStage(`
      <div class="big">System Error: "No" not supported 😤</div>
      <div class="small">Auto-accepting in ${count}…</div>
    `);

    for (let i = 0; i < 8; i++) setTimeout(spawnFloat, i * 50);

    count--;
    if (count < 0) { state.step = 2; render(); }
    else setTimeout(tick, 1000);
  };

  tick();
}

function renderStep1() {
  const q = state.cfg.questions.first;

  el("title").textContent = `Hey ${state.cfg.valentineName} ✨`;
  el("subtitle").textContent = "I have a very important question for you...";

  const yes = makeBtn(q.yesBtn, "");
  const no = makeBtn(q.noBtn, "danger");

  yes.onclick = () => { state.step = 2; render(); };

  no.onmouseenter = () => {
    el("hint").textContent = q.secretAnswer || "";
    const wrap = el("controls");
    const rect = wrap.getBoundingClientRect();
    const x = rand(0, Math.max(0, rect.width - 130));
    const y = rand(-20, 40);
    no.style.transform = `translate(${x}px, ${y}px)`;
  };

  no.onmouseleave = () => { 
    no.style.transform = ""; 
    el("hint").textContent = "";
  };

  let noClicks = 0;
  no.onclick = () => {
    noClicks++;
    if (noClicks === 1) showDrama("Wait... try again 🥺");
    else if (noClicks === 2) showDrama("The 'No' button is currently out of order 🛠️");
    else forceLove();
  };

  setStage(
    `<div class="big">${q.text}</div><div class="small" id="hint"></div>`,
    [yes, no]
  );
}

function loveMessage(pct) {
  const m = state.cfg.loveMessages;
  if (pct > 5000) return m.extreme;
  if (pct > 1000) return m.high;
  if (pct > 100) return m.normal;
  return "";
}

function renderStep2() {
  const q = state.cfg.questions.second;

  const next = makeBtn(q.nextBtn, "");
  next.onclick = () => { state.step = 3; render(); };

  setStage(`
    <div class="big">${q.text}</div>
    <div class="meter">
      <div class="small" id="meterMsg">${loveMessage(state.love)}</div>
      <input id="range" type="range" min="100" max="6000" value="${state.love}" />
      <div class="big"><span>${q.startText}</span> <span id="pct">${state.love}%</span></div>
    </div>
  `, [next]).then(() => {
    const range = el("range");
    const pct = el("pct");
    const msg = el("meterMsg");

    if (range) {
      range.addEventListener("input", () => {
        const v = Number(range.value);
        state.love = v;
        pct.textContent = `${v}%`;
        msg.textContent = loveMessage(v);
      });
    }
  });
}

function renderStep3() {
  const q = state.cfg.questions.third;

  const yes = makeBtn(q.yesBtn, "");
  const no = makeBtn(q.noBtn, "danger");

  yes.onclick = () => { state.step = 4; render(); };

  no.onmouseenter = () => {
    const wrap = el("controls");
    const rect = wrap.getBoundingClientRect();
    const x = rand(0, Math.max(0, rect.width - 130));
    const y = rand(-20, 40);
    no.style.transform = `translate(${x}px, ${y}px)`;
  };

  no.onmouseleave = () => { no.style.transform = ""; };

  setStage(`<div class="big">${q.text}</div><div class="small">Choose wisely...</div>`, [yes, no]);
}

function renderStep4() {
  const c = state.cfg.celebration;
  setStage(`
    <div class="big">${c.title}</div>
    <div class="small">${c.message}</div>
    <div style="margin-top:20px;font-size:36px;animation: heartbeat 1.5s infinite;">${c.emojis}</div>
  `, []);
  
  // extra celebration emojis
  let count = 0;
  const interval = setInterval(() => {
    spawnFloat();
    count++;
    if (count > 50) clearInterval(interval);
  }, 100);
}

function render() {
  if (!state.cfg) return;
  if (state.step === 1) return renderStep1();
  if (state.step === 2) return renderStep2();
  if (state.step === 3) return renderStep3();
  return renderStep4();
}

async function init() {
  try {
    showLoading();

    const res = await fetch("customize.json", { cache: "no-store" });
    if (!res.ok) throw new Error(\`fetch customize.json failed\`);

    state.cfg = await res.json();

    setThemeColors(state.cfg);
    setInterval(spawnFloat, state.cfg.animations.floatIntervalMs);
    render();
  } catch (err) {
    showInitError(err);
  }
}

window.addEventListener("DOMContentLoaded", init);