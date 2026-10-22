
function pack(lo, hi) {
  LANES.forEach(ln => {
    const ends = []; ln.row = [];
    ln.it.map((it, j) => [it, j]).filter(([it]) => it[1] >= lo && it[0] <= hi).sort((p, q) => p[0][0] - q[0][0]).forEach(([it, j]) => {
      let r = ends.findIndex(e => e <= it[0]); if (r < 0) { r = ends.length; ends.push(0); }
      ends[r] = it[1]; ln.row[j] = r;
    });
    ln.nr = Math.max(1, ends.length);
  });
}
const BIG = new Set(["Indépendance d'Israël"]);
const PLAGUE = new Set(["Déluge : Noé entre dans l'arche", "Tour de Babel", "Sodome et Gomorrhe détruites", "Les dix plaies d'Égypte", "La mer Rouge : l'armée de Pharaon engloutie", "La peste noire", "Début de la 1re Guerre mondiale", "Fin de la 1re Guerre mondiale", "Début de la 2e Guerre mondiale", "Fin de la 2e Guerre mondiale", "La Shoah", "Bombes atomiques sur le Japon", "Fin de la guerre en Europe", "Pandémie de Covid-19", "La grippe espagnole", "Début de la traite atlantique"]);
const TEMPLE = new Set(["Premier temple", "Temple détruit, captivité", "Second temple achevé", "Antiochus profane le temple", "Temple purifié : fête de la Dédicace", "Hérode agrandit le temple", "L'aigle d'or arraché du temple", "Fin des travaux du temple", "Le temple brûle", "Titus détruit Jérusalem"]);
const SRC = {"Grands savants": "Œuvres et biographies des savants", "Grandes inventions": "Histoire des sciences et des techniques ; Daniel 12:4", "Grandes découvertes": "Journaux de bord et récits des explorateurs", "Traite des esclaves": "Base de données Slave Voyages ; archives", "Chine": "Sima Qian ; archéologie chinoise", "Inde": "Inscriptions d'Ashoka ; histoire de l'Inde", "Afrique": "Ibn Battuta ; al-Bakri ; histoire de l'Afrique", "Amériques": "Codex mayas et aztèques ; chroniques espagnoles", "Europe": "Histoire de l'Europe", "Grands empires d'Asie": "Chroniques persanes, arabes, mongoles et ottomanes", "Voyages de Paul": "Actes des Apôtres ; épîtres de Paul ; Eusèbe", "Les croisades": "Gesta Francorum ; Guillaume de Tyr ; Villehardouin ; Joinville", "Les maîtres de Jérusalem": "Eric Cline, Jerusalem Besieged (2004) ; Bible ; Josèphe", "Statue de Daniel": "Daniel 2:31-45", "Le temple": "1 Rois ; Esdras ; Josèphe", "Le peuple juif": "Bible ; Josèphe ; histoire moderne", "Guerres et pandémies": "Archives historiques ; OMS", "Patriarches": "Genèse 5 ; 11 ; 25-50", "Mésopotamie": "Liste royale sumérienne ; fouilles", "Égypte": "Listes royales égyptiennes (Manéthon) ; inscriptions", "Juges": "Livre des Juges ; 1 Samuel", "Rois d'Israël": "1 et 2 Rois", "Rois de Juda": "1 et 2 Rois ; 2 Chroniques", "Prophètes": "Les livres des prophètes", "Écriture de la Bible": "Les livres eux-mêmes ; tradition juive et chrétienne", "Assyrie": "Chroniques et annales assyriennes", "Babylone": "Chroniques babyloniennes ; Daniel", "Perses": "Hérodote ; Esdras ; Néhémie ; Esther", "70 semaines de Daniel": "Daniel 9:24-27", "Macédoine et généraux": "Arrien ; Plutarque ; Diodore", "Ptolémées (Égypte)": "Polybe ; Daniel 11", "Séleucides (Syrie)": "Polybe ; Daniel 11", "Rome : la République": "Tite-Live ; Polybe ; Plutarque", "Empereurs romains": "Suétone, Vies des douze Césars ; Tacite ; Dion Cassius", "Papes (liste traditionnelle de Rome)": "Liber Pontificalis ; Annuaire pontifical", "Hérode et ses fils": "Josèphe, Antiquités 15-20 ; Évangiles ; Actes", "Persécutions romaines": "Tacite ; Pline ; Eusèbe", "Sept âges de l'Église": "Apocalypse 2-3 ; Branham, Exposé des sept âges", "Témoins de l'Église": "Eusèbe ; écrits et biographies de chacun"};
/* ---------- Dessin ---------- */
const NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("line");
const MINY = -4300, MAXY = 2115, NOW = 2030;
let W = 360, k = 0.1, c = -1000;
let sel = null;
function el(t, a, p, txt) { const e = document.createElementNS(NS, t); for (const x in a) e.setAttribute(x, a[x]); if (txt != null) e.textContent = txt; p.appendChild(e); return e; }
const X = y => (y - c) * k + W / 2;
const yr = y => { const v = Math.round(Math.abs(y)); return y > NOW ? "avenir, sans date" : v === 0 ? "an 0" : y < 0 ? v + " av. J.-C." : v + " ap. J.-C."; };
const level = () => k < 0.5 ? 1 : k < 2.5 ? 2 : 3;
const tw = (s, f) => s.length * f * 0.52 + 8;

function clamp() {
  const kmin = (W - 20) / (MAXY - MINY);
  k = Math.max(kmin, Math.min(400, k));
  const half = W / 2 / k;
  c = Math.max(MINY + half, Math.min(MAXY - half, c));
  if (MAXY - MINY < 2 * half) c = (MINY + MAXY) / 2;
}

function render() {
  W = svg.clientWidth || 360; clamp();
  pack(c - W / 2 / k, c + W / 2 / k);
  const LINE = 160, LT = 192, RH = 26, H = LT + LANES.reduce((t, l) => t + l.nr * RH + 14, 0) + 10;
  if (turned()) {
    const Hv = document.getElementById("svgbox").clientHeight || 300;
    oy = Math.max(0, Math.min(Math.max(0, H - Hv), oy));
    svg.style.height = "";
    svg.setAttribute("viewBox", `0 ${oy} ${W} ${Hv}`);
  } else {
    oy = 0;
    svg.style.height = H + "px";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  }
  svg.textContent = "";
  const L = level();
  const showRef = k >= 6;
  document.getElementById("lvl").textContent = showRef ? "Détail 3/3 · références" : "Détail " + L + "/3";

  // graduations
  const steps = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
  let step = steps[0]; for (const s of steps) if (s * k >= 64) step = s;
  const y0 = Math.ceil((c - W / 2 / k) / step) * step;
  for (let y = y0; X(y) <= W && y <= NOW; y += step) {
    const x = X(y);
    el("line", { x1: x, x2: x, y1: 30, y2: H - 8, stroke: "var(--grid)", "stroke-width": 1 }, svg);
    el("line", { x1: x, x2: x, y1: LINE - 6, y2: LINE + 6, stroke: "var(--ink)", "stroke-width": 1.2 }, svg);
    el("text", { x: x, y: LINE + 20, "text-anchor": "middle", "font-size": 11, "font-family": "var(--mono)", fill: y === 0 ? "var(--red)" : "var(--ink)" }, svg, y === 0 ? "an 0" : Math.abs(y) + (y < 0 ? " av." : ""));
  }
  el("line", { x1: 0, x2: Math.min(W, X(NOW)), y1: LINE, y2: LINE, stroke: "var(--ink)", "stroke-width": 2.5 }, svg);
  if (X(NOW) < W) {
    el("rect", { x: X(NOW), y: 24, width: W - X(NOW) + 10, height: H - 30, fill: "var(--gold)", "fill-opacity": .07, stroke: "var(--gold)", "stroke-dasharray": "6 5" }, svg);
    el("line", { x1: X(NOW), x2: W, y1: LINE, y2: LINE, stroke: "var(--gold)", "stroke-width": 2.5, "stroke-dasharray": "8 6" }, svg);
    el("text", { x: X(NOW) + 8, y: LINE + 20, "font-size": 11, "font-family": "var(--mono)", fill: "var(--gold)" }, svg, "AVENIR ANNONCÉ · SANS DATE");
  }
  if (X(0) > 0 && X(0) < W) {
    el("line", { x1: X(0), x2: X(0), y1: 20, y2: H - 8, stroke: "var(--red)", "stroke-width": 1.5, "stroke-dasharray": "3 4" }, svg);
  }

  // bandes
  // traits verticaux : relient les grands événements à toutes les bandes
  EV.forEach(e => {
    const tpl = TEMPLE.has(e[1]), big = BIG.has(e[1]), pl = PLAGUE.has(e[1]);
    if (!(e[2] === 1 || tpl || big || pl) || e[6]) return;
    const x = X(e[0]); if (x < 0 || x > W) return;
    const col = big || tpl ? "var(--red)" : pl ? "var(--plague)" : "var(--ink)";
    el("line", { x1: x, x2: x, y1: LINE, y2: H - 6, stroke: col, "stroke-width": big || pl ? 2.2 : 1.2, "stroke-dasharray": big ? "" : "4 4", opacity: big || pl ? .75 : .45 }, svg);
  });
  let top = LT;
  LANES.forEach((ln, i) => {
    if (i) top += LANES[i - 1].nr * RH + 14;
    ln.top = top;
    const col = `var(${ln.c})`;
    el("rect", { x: 0, y: top, width: W, height: ln.nr * RH + 8, fill: i % 2 ? "transparent" : "var(--grid)", opacity: .35 }, svg);
    ln.it.forEach((it, j) => {
      const [a, b, name, note] = it;
      let x1 = X(a), x2 = X(b === a ? a + 1 : b);
      if (x2 < 0 || x1 > W) return;
      const w = Math.max(3, x2 - x1);
      const g = el("g", { "data-id": `L${i}-${j}`, style: "cursor:pointer" }, svg);
      const on = sel === `L${i}-${j}`;
      const ry = top + 8 + ln.row[j] * RH;
      el("rect", { x: x1, y: ry, width: w, height: 22, rx: 3, fill: col, "fill-opacity": ln.statue ? .28 : .16, stroke: col, "stroke-width": on ? 3 : 1.2 }, g);
      const vx1 = Math.max(x1, 0), vx2 = Math.min(x1 + w, W);
      if (tw(name, 12) < vx2 - vx1) el("text", { x: (vx1 + vx2) / 2, y: ry + 16, "text-anchor": "middle", "font-size": 12, "font-weight": 600, fill: "var(--fg)" }, g, name);
    });
    const lab = ln.n.toUpperCase(), lw = tw(lab, 10) + 4;
    el("rect", { x: 0, y: top - 4, width: lw, height: 14, fill: "var(--paper)", opacity: .9 }, svg);
    el("text", { x: 4, y: top + 7, "font-size": 10, "font-family": "var(--mono)", fill: col, "letter-spacing": ".06em" }, svg, lab);
  });

  // événements (au-dessus de la ligne)
  const rows = [[], [], [], [], []], RY = [118, 94, 70, 46, 22];
  const vis = EV.map((e, i) => [e, i]).filter(([e]) => e[2] <= L && X(e[0]) > -60 && X(e[0]) < W + 60).sort((p, q) => p[0][2] - q[0][2]);
  vis.forEach(([e, i]) => {
    const pl = PLAGUE.has(e[1]), tpl = TEMPLE.has(e[1]) || BIG.has(e[1]) || pl, x = X(e[0]), fix = !!e[5], col = e[6] ? "var(--gold)" : pl ? "var(--plague)" : tpl ? "var(--red)" : fix ? "var(--corr)" : "var(--ink)";
    const lab = showRef && e[3] ? e[1] + " · " + e[3] : e[1];
    const w = tw(lab, 13);
    let x1 = Math.max(2, Math.min(W - w - 2, x - w / 2)), r = -1;
    for (let q = 0; q < rows.length; q++) if (rows[q].every(([a, b]) => x1 + w < a || x1 > b)) { r = q; break; }
    const g = el("g", { "data-id": "E" + i, style: "cursor:pointer" }, svg);
    const on = sel === "E" + i;
    if (r >= 0) {
      rows[r].push([x1 - 6, x1 + w + 6]);
      el("line", { x1: x, x2: x, y1: RY[r] + 5, y2: LINE, stroke: col, "stroke-width": 1, opacity: .6 }, g);
      el("rect", { x: x1, y: RY[r] - 14, width: w, height: 20, rx: 10, fill: on || tpl ? col : "var(--paper)", stroke: col, "stroke-width": tpl ? 2 : e[2] === 1 ? 1.6 : 1 }, g);
      el("text", { x: x1 + w / 2, y: RY[r] + 1, "text-anchor": "middle", "font-size": 13, "font-weight": e[2] === 1 || tpl ? 600 : 400, fill: on || tpl ? "var(--paper)" : "var(--fg)" }, g, lab);
    }
    el("circle", { cx: x, cy: LINE, r: BIG.has(e[1]) ? 11 : e[2] === 1 ? 6 : 4.5, fill: BIG.has(e[1]) ? "var(--red)" : col, stroke: "var(--paper)", "stroke-width": BIG.has(e[1]) ? 3 : 1.5 }, g);
    if (BIG.has(e[1])) el("circle", { cx: x, cy: LINE, r: 17, fill: "none", stroke: "var(--red)", "stroke-width": 2 }, g);
  });
}

/* ---------- Fiche ---------- */
function show(id) {
  sel = id;
  document.getElementById("detail").classList.add("has");
  let t, w, n, x;
  if (id[0] === "E") { const e = EV[+id.slice(1)]; t = e[1]; w = yr(e[0]) + (e[3] ? " · " + e[3] : ""); n = e[4] || ""; x = e[5]; }
  else { const [i, j] = id.slice(1).split("-").map(Number); const it = LANES[i].it[j]; t = it[2]; w = LANES[i].n + " · " + (it[0] === it[1] ? yr(it[0]) : yr(it[0]) + " → " + yr(it[1])) + (SRC[LANES[i].n] ? " · Source : " + SRC[LANES[i].n] : ""); n = it[3] || ""; }
  document.getElementById("d-t").textContent = t;
  document.getElementById("d-w").textContent = w;
  document.getElementById("d-n").textContent = n;
  const dx = document.getElementById("d-x"); dx.hidden = !x; dx.textContent = x || "";
  render();
}

/* ---------- Gestes ---------- */
const P = new Map(); let moved = 0, downId = null, pinch = null, oy = 0, pref = null;
const turned = () => document.body.classList.contains("turned");
const localX = (pt, r) => turned() ? pt.y - r.top : pt.x - r.left;
svg.addEventListener("pointerdown", ev => {
  P.set(ev.pointerId, { x: ev.clientX, y: ev.clientY }); moved = 0;
  const g = ev.target.closest("[data-id]"); downId = g ? g.getAttribute("data-id") : null;
  if (P.size === 2) { const [a, b] = [...P.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k }; }
  svg.setPointerCapture(ev.pointerId);
});
svg.addEventListener("pointermove", ev => {
  if (!P.has(ev.pointerId)) return;
  const p = P.get(ev.pointerId), dx = ev.clientX - p.x, dy = ev.clientY - p.y;
  if (P.size === 1) {
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const ldx = turned() ? dy : dx, ldy = turned() ? -dx : 0;
    moved += Math.abs(ldx) + Math.abs(ldy); c -= ldx / k; oy -= ldy; P.set(ev.pointerId, { x: ev.clientX, y: ev.clientY }); render();
  } else if (P.size === 2 && pinch) {
    P.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const [a, b] = [...P.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
    const r = svg.getBoundingClientRect(), mx = localX({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, r);
    const yAt = c + (mx - W / 2) / k; k = pinch.k * d / pinch.d; clamp(); c = yAt - (mx - W / 2) / k; moved = 99; render();
  }
});
const up = ev => { P.delete(ev.pointerId); if (P.size < 2) pinch = null; if (P.size === 0 && moved < 6 && downId) show(downId); };
svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", ev => { P.delete(ev.pointerId); pinch = null; });
svg.addEventListener("wheel", ev => {
  ev.preventDefault();
  const r = svg.getBoundingClientRect(), mx = localX({ x: ev.clientX, y: ev.clientY }, r), yAt = c + (mx - W / 2) / k;
  k *= Math.exp(-ev.deltaY * 0.0015); clamp(); c = yAt - (mx - W / 2) / k; render();
}, { passive: false });

/* ---------- Recherche ---------- */
const norm = t => (t || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const INDEX = [];
EV.forEach((e, i) => INDEX.push({ id: "E" + i, t: e[1], sub: (e[6] ? "Avenir annoncé" : yr(e[0])) + (e[3] ? " · " + e[3] : ""), y: e[0], key: norm(e[1] + " " + e[3] + " " + e[4] + " " + Math.round(Math.abs(e[0]))) }));
LANES.forEach((ln, i) => ln.it.forEach((it, j) => INDEX.push({ id: "L" + i + "-" + j, t: it[2], sub: ln.n + " · " + (it[0] === it[1] ? yr(it[0]) : yr(it[0]) + " → " + yr(it[1])), y: it[0], y2: it[1], lane: i, key: norm(it[2] + " " + ln.n + " " + (it[3] || "") + " " + Math.round(Math.abs(it[0]))) })));
const qEl = document.getElementById("q"), resEl = document.getElementById("res");
let hits = [];
function search() {
  const q = norm(qEl.value.trim());
  if (q.length < 2) { resEl.hidden = true; return; }
  const words = q.split(/\s+/);
  hits = INDEX.filter(x => words.every(w => x.key.includes(w)))
    .sort((a, b) => (norm(a.t).startsWith(q) ? 0 : norm(a.t).includes(q) ? 1 : 2) - (norm(b.t).startsWith(q) ? 0 : norm(b.t).includes(q) ? 1 : 2)).slice(0, 12);
  resEl.textContent = "";
  const m = q.match(/^(\d{1,4})\s*(av|avant|ap|apres)?/);
  if (m) {
    const yv = (m[2] && m[2].startsWith("av") ? -1 : 1) * +m[1];
    const evs = INDEX.filter(x => x.y2 == null && x.y <= NOW).sort((a, b) => Math.abs(a.y - yv) - Math.abs(b.y - yv)).slice(0, 5);
    const bars = INDEX.filter(x => x.y2 != null && x.y <= yv && x.y2 >= yv).slice(0, 7);
    const near = evs.concat(bars);
    const go = document.createElement("button"); const t = document.createElement("b"); t.textContent = "Aller à l'année " + yr(yv); const sm = document.createElement("small"); sm.textContent = "Voir ce qui se passe autour de cette date"; go.append(t, sm);
    go.onclick = () => { resEl.hidden = true; qEl.blur(); animateTo(yv, (W - 20) / 40); };
    resEl.appendChild(go);
    hits = near;
  }
  if (!hits.length) { const d = document.createElement("div"); d.className = "none"; d.textContent = "Rien trouvé pour « " + qEl.value.trim() + " »."; resEl.appendChild(d); }
  hits.forEach(h => { const b = document.createElement("button"); const t = document.createElement("b"); t.textContent = h.t; const sm = document.createElement("small"); sm.textContent = h.sub; b.append(t, sm); b.onclick = () => goTo(h); resEl.appendChild(b); });
  resEl.hidden = false;
}
function goTo(h) {
  resEl.hidden = true; qEl.blur();
  const span = h.y2 != null ? Math.max(20, Math.abs(h.y2 - h.y) * 3) : (h.y > NOW ? 120 : 30);
  const mid = h.y2 != null ? (h.y + h.y2) / 2 : h.y;
  animateTo(mid, (W - 20) / span);
  show(h.id);
  setTimeout(() => {
    if (h.lane == null) { if (turned()) { oy = 0; render(); } else window.scrollTo({ top: svg.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" }); return; }
    const ln = LANES[h.lane];
    if (turned()) { oy = Math.max(0, ln.top - 60); render(); }
    else window.scrollTo({ top: svg.getBoundingClientRect().top + scrollY + ln.top - 140, behavior: "smooth" });
  }, 450);
}
qEl.addEventListener("input", search);
qEl.addEventListener("keydown", ev => { if (ev.key === "Enter" && hits[0]) { ev.preventDefault(); goTo(hits[0]); } if (ev.key === "Escape") resEl.hidden = true; });
document.addEventListener("pointerdown", ev => { if (!ev.target.closest(".search")) resEl.hidden = true; });

function animateTo(c2, k2) {
  const c1 = c, k1 = k, t0 = performance.now(), D = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 420;
  (function f(t) { const p = Math.min(1, (t - t0) / D), e = p * (2 - p); c = c1 + (c2 - c1) * e; k = Math.exp(Math.log(k1) + (Math.log(k2) - Math.log(k1)) * e); render(); if (p < 1) requestAnimationFrame(f); })(t0);
}
const zoomBy = f => animateTo(c, k * f);
document.getElementById("zin").onclick = () => zoomBy(2);
document.getElementById("zout").onclick = () => zoomBy(.5);
document.getElementById("all").onclick = () => animateTo((MINY + MAXY) / 2, (W - 20) / (MAXY - MINY));
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { const [a, z] = b.dataset.go.split(",").map(Number); animateTo((a + z) / 2, (W - 20) / (z - a)); });
function layout() {
  const narrow = innerHeight > innerWidth && innerWidth < 700;
  const t = pref === null ? narrow : pref;
  document.body.classList.toggle("turned", t);
  const st = document.getElementById("stage").style;
  if (t) { st.width = innerHeight + "px"; st.height = innerWidth + "px"; st.transform = `translateX(${innerWidth}px) rotate(90deg)`; }
  else { st.width = st.height = st.transform = ""; }
  document.getElementById("turn").textContent = t ? "Vue normale" : "Vue en largeur";
  render();
}
document.getElementById("turn").onclick = () => { const kw = k * W; pref = !turned(); layout(); k = kw / W; render(); };
document.getElementById("d-close").onclick = () => document.getElementById("detail").classList.remove("has");
addEventListener("resize", () => { const kw = k * W; layout(); k = kw / W; render(); });
W = svg.clientWidth || 360; k = (W - 20) / (MAXY - MINY); c = (MINY + MAXY) / 2;
layout(); k = (W - 20) / (MAXY - MINY); render();
