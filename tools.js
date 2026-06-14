/**
 * TRIGGER POINT GAMING — tools.js
 * All 4 browser-based gaming tools. Pure Vanilla JS, zero dependencies.
 * Attaches to DOM after DOMContentLoaded.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     SHARED UTILITIES
  ============================================================ */
  function $(id) { return document.getElementById(id); }
  function showResult(el) { if (el) el.classList.add('is-visible'); }
  function hideResult(el) { if (el) el.classList.remove('is-visible'); }

  /* ============================================================
     TOOL 1 — Universal Mouse DPI & eDPI Calculator
  ============================================================ */
  var dpiInput   = $('t1-dpi');
  var sensInput  = $('t1-sens');
  var calcBtn    = $('t1-calc');
  var resultBox  = $('t1-result');
  var resultVal  = $('t1-result-value');
  var resultCat  = $('t1-result-category');
  var resultDesc = $('t1-result-desc');
  var gaugeFill  = $('t1-gauge-fill');

  function calcEdpi() {
    var dpi  = parseFloat(dpiInput ? dpiInput.value : 0);
    var sens = parseFloat(sensInput ? sensInput.value : 0);

    if (!dpi || !sens || dpi <= 0 || sens <= 0) {
      if (resultBox) hideResult(resultBox);
      return;
    }

    var edpi = dpi * sens;

    // Category thresholds (standard FPS community ranges)
    var category, desc, chipClass;
    if (edpi < 400) {
      category  = 'Low Sensitivity — Arm Aim';
      desc      = 'Ideal for large sweeping movements. Common in pro snipers & tactical shooters. Requires a large mousepad.';
      chipClass = 'status-low';
    } else if (edpi <= 1000) {
      category  = 'Medium Sensitivity — Balanced';
      desc      = 'The sweet spot for most FPS players. Good for both tracking and flicking. Most pros sit here.';
      chipClass = 'status-medium';
    } else {
      category  = 'High Sensitivity — Wrist Aim';
      desc      = 'Fast, reactive play style. Common in games like Overwatch. Requires excellent micro-adjustment control.';
      chipClass = 'status-high';
    }

    if (resultVal) resultVal.textContent = edpi.toFixed(1);
    if (resultCat) {
      resultCat.textContent  = category;
      resultCat.className    = 'status-chip ' + chipClass;
    }
    if (resultDesc) resultDesc.textContent = desc;

    // Gauge: map 0–2000 range to 0–100%
    var gaugePercent = Math.min((edpi / 2000) * 100, 100);
    if (gaugeFill) {
      gaugeFill.style.width = gaugePercent + '%';
      if (edpi < 400) {
        gaugeFill.style.background = '#0D9488'; // teal
      } else if (edpi <= 1000) {
        gaugeFill.style.background = '#1D4ED8'; // blue
      } else {
        gaugeFill.style.background = '#DC2626'; // red
      }
    }

    if (resultBox) showResult(resultBox);
  }

  if (calcBtn) calcBtn.addEventListener('click', calcEdpi);
  if (dpiInput)  dpiInput.addEventListener('keydown',  function(e){ if(e.key==='Enter') calcEdpi(); });
  if (sensInput) sensInput.addEventListener('keydown', function(e){ if(e.key==='Enter') calcEdpi(); });


  /* ============================================================
     TOOL 2 — Game Sensitivity Converter
  ============================================================ */

  /**
   * Conversion matrix: all values represent the multiplier relative to CS2.
   * CS2 base = 1.0 (i.e., CS2 sens is the universal unit)
   * To convert FROM a game: divide sens by that game's factor → get CS2 sens
   * To convert TO a game:   multiply CS2 sens by that game's factor
   *
   * These are based on published yaw values and widely-used community calculators.
   */
  var SENS_FACTORS = {
    'cs2':         1.0,
    'valorant':    0.3142,    // Valorant to CS2 → ×(1/0.3142) ≈ ×3.1828
    'apex':        0.3333,    // Apex to CS2     → ×(1/0.3333) ≈ ×3.0
    'overwatch2':  0.0942,    // OW2 to CS2      → ×(1/0.0942) ≈ ×10.6157
    'r6s':         1.0,       // R6 to CS2       → ×1.0 (similar engine scaling approx)
    'fortnite':    0.3333     // Fortnite (Unreal) ≈ Apex approx
  };

  var GAME_NAMES = {
    'cs2':        'CS2',
    'valorant':   'Valorant',
    'apex':       'Apex Legends',
    'overwatch2': 'Overwatch 2',
    'r6s':        'Rainbow Six Siege',
    'fortnite':   'Fortnite'
  };

  var t2FromSelect  = $('t2-from');
  var t2ToSelect    = $('t2-to');
  var t2SensInput   = $('t2-sens');
  var t2CalcBtn     = $('t2-calc');
  var t2ResultBox   = $('t2-result');
  var t2ResultVal   = $('t2-result-value');
  var t2ResultMeta  = $('t2-result-meta');
  var t2CopyBtn     = $('t2-copy');

  function convertSens() {
    var fromGame  = t2FromSelect ? t2FromSelect.value : '';
    var toGame    = t2ToSelect   ? t2ToSelect.value   : '';
    var inputSens = parseFloat(t2SensInput ? t2SensInput.value : 0);

    if (!inputSens || inputSens <= 0) { if (t2ResultBox) hideResult(t2ResultBox); return; }
    if (fromGame === toGame)          { if (t2ResultVal) t2ResultVal.textContent = inputSens.toFixed(4); if (t2ResultBox) showResult(t2ResultBox); return; }

    if (!SENS_FACTORS[fromGame] || !SENS_FACTORS[toGame]) { if (t2ResultBox) hideResult(t2ResultBox); return; }

    // Step 1: convert input to CS2-equivalent sensitivity
    var cs2Sens = inputSens / SENS_FACTORS[fromGame];
    // Step 2: convert CS2-equivalent to target game sensitivity
    var convertedSens = cs2Sens * SENS_FACTORS[toGame];

    if (t2ResultVal) t2ResultVal.textContent = convertedSens.toFixed(4);

    var ratio = (convertedSens / inputSens).toFixed(3);
    if (t2ResultMeta)
      t2ResultMeta.textContent =
        GAME_NAMES[fromGame] + ' ' + inputSens + ' → ' + GAME_NAMES[toGame] + ' ' + convertedSens.toFixed(4) +
        ' (ratio: ' + ratio + ')';

    if (t2ResultBox) showResult(t2ResultBox);
  }

  if (t2CalcBtn) t2CalcBtn.addEventListener('click', convertSens);
  if (t2SensInput) t2SensInput.addEventListener('keydown', function(e){ if(e.key==='Enter') convertSens(); });

  if (t2CopyBtn) {
    t2CopyBtn.addEventListener('click', function () {
      var val = t2ResultVal ? t2ResultVal.textContent : '';
      if (!val) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(function () { flashCopy(t2CopyBtn); });
      } else {
        // Fallback for older browsers
        var ta = document.createElement('textarea');
        ta.value = val;
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); flashCopy(t2CopyBtn); } catch(e){}
        document.body.removeChild(ta);
      }
    });
  }

  function flashCopy(btn) {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copy-success');
    setTimeout(function () {
      btn.textContent = 'Copy to Clipboard';
      btn.classList.remove('copy-success');
    }, 2000);
  }


  /* ============================================================
     TOOL 3 — 360° Distance (CM/360) Calculator
  ============================================================ */

  /**
   * Engine Yaw Values (degrees per pixel at 1 sens / 1 DPI = base)
   * Formula:
   *   degrees_per_count = yaw * sensitivity
   *   counts_per_360    = 360 / degrees_per_count
   *   inches_per_360    = counts_per_360 / DPI
   *   cm_per_360        = inches_per_360 * 2.54
   */
  var ENGINE_YAW = {
    'source':       0.022,    // Source engine (CS2, TF2, L4D2)
    'unreal':       0.07,     // Unreal Engine 4/5 (Valorant, Fortnite)
    'apex':         0.022,    // Apex Legends (modified Source)
    'overwatch2':   0.0066,   // Overwatch 2 (proprietary Blizzard engine)
    'r6s':          0.00572957,// Rainbow Six Siege (AnvilNext)
    'quake':        0.022,    // Quake engine (id Tech)
    'battlebit':    0.07      // BattleBit Remastered (Unreal)
  };

  var t3EngineSelect = $('t3-engine');
  var t3DpiInput     = $('t3-dpi');
  var t3SensInput    = $('t3-sens');
  var t3CalcBtn      = $('t3-calc');
  var t3ResultBox    = $('t3-result');
  var t3ResultCm     = $('t3-result-cm');
  var t3ResultIn     = $('t3-result-in');
  var t3ResultMeta   = $('t3-result-meta');

  function calc360() {
    var engine = t3EngineSelect ? t3EngineSelect.value : 'source';
    var dpi    = parseFloat(t3DpiInput  ? t3DpiInput.value  : 0);
    var sens   = parseFloat(t3SensInput ? t3SensInput.value : 0);

    if (!dpi || !sens || dpi <= 0 || sens <= 0) { if (t3ResultBox) hideResult(t3ResultBox); return; }

    var yaw            = ENGINE_YAW[engine] || 0.022;
    var degPerCount    = yaw * sens;          // degrees per mouse count
    var countsFor360   = 360 / degPerCount;  // mouse counts for full 360°
    var inchesFor360   = countsFor360 / dpi; // physical inches
    var cmFor360       = inchesFor360 * 2.54; // physical centimetres

    if (t3ResultCm)   t3ResultCm.textContent   = cmFor360.toFixed(2) + ' cm';
    if (t3ResultIn)   t3ResultIn.textContent   = inchesFor360.toFixed(2) + ' in';

    // Interpretation
    var pad;
    if (cmFor360 < 20) pad = 'Small mousepad friendly. Fast, wrist-heavy playstyle.';
    else if (cmFor360 < 40) pad = 'Standard mousepad size (35–40 cm) will work.';
    else if (cmFor360 < 60) pad = 'Medium-large pad recommended (45–60 cm).';
    else pad = 'XL mousepad required (60 cm+). Arm-dominant playstyle.';

    if (t3ResultMeta) t3ResultMeta.textContent = pad;
    if (t3ResultBox)  showResult(t3ResultBox);
  }

  if (t3CalcBtn) t3CalcBtn.addEventListener('click', calc360);
  if (t3DpiInput)  t3DpiInput.addEventListener('keydown',  function(e){ if(e.key==='Enter') calc360(); });
  if (t3SensInput) t3SensInput.addEventListener('keydown', function(e){ if(e.key==='Enter') calc360(); });


  /* ============================================================
     TOOL 4 — Monitor Refresh Rate & Frame Time Calculator
  ============================================================ */
  var t4HzInput     = $('t4-hz');
  var t4FpsInput    = $('t4-fps');
  var t4CalcBtn     = $('t4-calc');
  var t4ResultBox   = $('t4-result');
  var t4FrameTime   = $('t4-frametime');
  var t4StatusChip  = $('t4-status-chip');
  var t4StatusText  = $('t4-status-text');
  var t4Rec         = $('t4-recommendation');

  function calcFrameTime() {
    var hz  = parseFloat(t4HzInput  ? t4HzInput.value  : 0);
    var fps = parseFloat(t4FpsInput ? t4FpsInput.value : 0);

    if (!hz || !fps || hz <= 0 || fps <= 0) { if (t4ResultBox) hideResult(t4ResultBox); return; }

    var frameTime = (1000 / fps).toFixed(2);
    if (t4FrameTime) t4FrameTime.textContent = frameTime + ' ms';

    var statusText, statusClass, recommendation;

    if (fps > hz * 1.5) {
      // High FPS overkill — display bottleneck
      statusText   = 'Display Bottleneck Detected';
      statusClass  = 'status-warn';
      var capFps   = Math.round(hz * 1.1);
      recommendation =
        'Your GPU is rendering ' + Math.round(fps) + ' FPS but your ' + Math.round(hz) +
        'Hz monitor can only display ' + Math.round(hz) + ' frames per second. ' +
        'The extra frames are wasted and can cause screen tearing. ' +
        'Recommendation: Cap your FPS at ' + capFps + ' FPS (10% above monitor Hz) using your in-game FPS limiter or NVIDIA/AMD control panel for perfectly stable frame pacing.';
    } else if (fps >= hz * 0.9) {
      // FPS matches monitor Hz — ideal
      statusText   = 'Optimal — Display Synced';
      statusClass  = 'status-ok';
      recommendation =
        'Your GPU is rendering ' + Math.round(fps) + ' FPS and your monitor refreshes at ' + Math.round(hz) +
        'Hz. This is an excellent match. Every rendered frame is displayed, giving you smooth, low-latency gameplay. ' +
        'Consider enabling G-Sync or FreeSync for tear-free visuals at lower FPS moments.';
    } else if (fps >= hz * 0.5) {
      // FPS below Hz but still playable
      statusText   = 'GPU Bottleneck — Below Refresh Rate';
      statusClass  = 'status-medium';
      recommendation =
        'Your GPU can only produce ' + Math.round(fps) + ' FPS but your monitor can display ' + Math.round(hz) +
        ' FPS. You\'re leaving monitor performance on the table. ' +
        'Try lowering in-game settings (shadows, draw distance, AA) or upgrade your GPU to fully utilise your ' +
        Math.round(hz) + 'Hz monitor.';
    } else {
      // Severe bottleneck
      statusText   = 'Severe GPU Bottleneck';
      statusClass  = 'status-high';
      recommendation =
        'Critical performance gap: ' + Math.round(fps) + ' FPS on a ' + Math.round(hz) +
        'Hz monitor. Your gameplay will feel inconsistent and laggy. ' +
        'Immediately lower your in-game resolution, disable anti-aliasing, and reduce texture quality to boost FPS significantly.';
    }

    if (t4StatusChip) { t4StatusChip.textContent = statusText; t4StatusChip.className = 'status-chip ' + statusClass; }
    if (t4StatusText) t4StatusText.textContent = statusText;
    if (t4Rec)        t4Rec.textContent = recommendation;
    if (t4ResultBox)  showResult(t4ResultBox);
  }

  if (t4CalcBtn) t4CalcBtn.addEventListener('click', calcFrameTime);
  if (t4HzInput)  t4HzInput.addEventListener('keydown',  function(e){ if(e.key==='Enter') calcFrameTime(); });
  if (t4FpsInput) t4FpsInput.addEventListener('keydown', function(e){ if(e.key==='Enter') calcFrameTime(); });


  /* ============================================================
     NAVIGATION — Hamburger Menu
  ============================================================ */
  var hamburger  = document.querySelector('.hamburger');
  var mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ============================================================
     CONTACT FORM — Static "Thank You" simulation
  ============================================================ */
  var contactForm    = $('contact-form');
  var contactSuccess = $('contact-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactForm.style.display = 'none';
      if (contactSuccess) contactSuccess.style.display = 'block';
    });
  }

});
