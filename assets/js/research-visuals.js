/* Original, conceptual research diagrams. No external assets or dependencies. */
(() => {
  'use strict';

  const selector = '[data-research-visual]';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = new Map();
  let sequence = 0;
  let pendingSync = false;

  // Every diagram has a meaningful static state. The moving dashed overlays
  // illustrate information/action flow, rather than measured performance.
  const diagrams = {
    vision: {
      title: 'A theory-guided decision loop',
      description: 'Observe relevant information, certify admissible actions, make coordinated decisions, and adapt when change is worthwhile. Learning and optimization connect the loop; mathematical assumptions determine the guarantees.',
      caption: 'Learning and optimization connect information, certified decisions, and purposeful adaptation.',
      height: 300,
      draw: ({ edge }) => `
        <text class="rv-heading" x="240" y="28" text-anchor="middle">Theory-guided intelligence</text>
        ${edge('M154 103 H180')}
        ${edge('M300 103 H326')}
        ${edge('M392 145 V212 Q392 228 376 228 H310')}
        ${edge('M170 228 H104 Q88 228 88 212 V145')}
        <rect class="rv-node" x="24" y="64" width="130" height="81" rx="13"/>
        <g class="rv-vision-observe">
          <path class="rv-symbol" d="M69 85 Q88 65 107 85 Q88 105 69 85Z"/>
          <circle class="rv-symbol-fill" cx="88" cy="85" r="5"/>
        </g>
        <text class="rv-label" x="89" y="117" text-anchor="middle">Observe</text>
        <text class="rv-small" x="89" y="135" text-anchor="middle">Information</text>
        <rect class="rv-node rv-certification" x="180" y="64" width="120" height="81" rx="13"/>
        <path class="rv-symbol" d="M240 72 L253 78 V88 Q253 99 240 105 Q227 99 227 88 V78Z"/>
        <path class="rv-symbol" d="M234 87 L239 92 L248 81"/>
        <text class="rv-label" x="240" y="117" text-anchor="middle">Certify</text>
        <text class="rv-small" x="240" y="135" text-anchor="middle">Safe action set</text>
        <rect class="rv-node" x="326" y="64" width="130" height="81" rx="13"/>
        <path class="rv-symbol" d="M379 78 H403 M391 78 V97 M375 97 H407"/>
        <circle class="rv-symbol-fill" cx="375" cy="98" r="4"/>
        <circle class="rv-symbol-fill" cx="407" cy="98" r="4"/>
        <text class="rv-label" x="391" y="117" text-anchor="middle">Decide</text>
        <text class="rv-small" x="391" y="135" text-anchor="middle">Joint action</text>
        <rect class="rv-node" x="170" y="195" width="140" height="67" rx="13"/>
        <text class="rv-label" x="240" y="222" text-anchor="middle">Adapt</text>
        <text class="rv-small" x="240" y="244" text-anchor="middle">Value of change</text>
        <text class="rv-center-note" x="240" y="177" text-anchor="middle">Learn + optimize</text>
        <text class="rv-small" x="240" y="287" text-anchor="middle">Information · safety · coordination · cost</text>`
    },
    safety: {
      title: 'Certifying a joint action before execution',
      description: 'Three interacting agents propose a joint action. A safety certificate checks coupled constraints. A certified action proceeds to execution; an uncertified candidate does not. This is a conceptual illustration, with guarantees conditional on each model’s assumptions.',
      caption: 'Coupled constraints require checking the joint action before it is executed.',
      height: 280,
      draw: ({ edge }) => `
        <text class="rv-heading" x="240" y="28" text-anchor="middle">Check first. Then act.</text>
        <path class="rv-coupling" d="M69 88 Q107 116 69 144 Q107 172 69 200"/>
        ${edge('M86 88 H128 Q142 88 142 102 V132 H176')}
        ${edge('M86 144 H176')}
        ${edge('M86 200 H128 Q142 200 142 186 V156 H176')}
        ${edge('M286 132 H318 Q330 132 330 120 V103 H357')}
        <path class="rv-uncertified" d="M286 156 H318 Q330 156 330 172 V197 H357"/>
        <circle class="rv-agent" cx="66" cy="88" r="20"/>
        <circle class="rv-agent" cx="66" cy="144" r="20"/>
        <circle class="rv-agent" cx="66" cy="200" r="20"/>
        <text class="rv-label" x="66" y="94" text-anchor="middle">A</text>
        <text class="rv-label" x="66" y="150" text-anchor="middle">B</text>
        <text class="rv-label" x="66" y="206" text-anchor="middle">C</text>
        <text class="rv-small" x="66" y="245" text-anchor="middle">Local agents</text>
        <text class="rv-small" x="139" y="65" text-anchor="middle">Joint action</text>
        <rect class="rv-node rv-certification" x="176" y="101" width="110" height="86" rx="14"/>
        <path class="rv-symbol" d="M231 113 L246 120 V132 Q246 145 231 152 Q216 145 216 132 V120Z"/>
        <path class="rv-symbol" d="M224 131 L230 137 L240 124"/>
        <text class="rv-label" x="231" y="173" text-anchor="middle">Certify</text>
        <rect class="rv-node rv-approved" x="357" y="72" width="103" height="64" rx="12"/>
        <text class="rv-label" x="409" y="98" text-anchor="middle">Execute</text>
        <text class="rv-small" x="409" y="119" text-anchor="middle">Certified</text>
        <rect class="rv-muted-node" x="357" y="166" width="103" height="64" rx="12"/>
        <path class="rv-stop" d="M399 178 L418 197 M418 178 L399 197"/>
        <text class="rv-small" x="409" y="218" text-anchor="middle">Not certified</text>
        <text class="rv-small" x="251" y="260" text-anchor="middle">Constraints can couple the agents</text>`
    },
    adaptation: {
      title: 'Balancing improvement against adaptation cost',
      description: 'A current plan and an alternative are compared. On a conceptual scale, potential gain is weighed against the cost of changing. The moving indicator is illustrative and does not represent data, an empirical result, or a universal switching policy.',
      caption: 'Changing a route, workload, or model has a cost. Better decisions must justify that change.',
      height: 280,
      draw: ({ id }) => `
        <defs><clipPath id="${id}-gain"><rect x="48" y="186" width="384" height="12" rx="6"/></clipPath></defs>
        <text class="rv-heading" x="240" y="28" text-anchor="middle">When is a change worthwhile?</text>
        <rect class="rv-node rv-current-plan" x="30" y="62" width="154" height="76" rx="13"/>
        <path class="rv-symbol" d="M87 78 H127 M87 87 H117"/>
        <text class="rv-label" x="107" y="116" text-anchor="middle">Current plan</text>
        <path class="rv-connection" d="M194 100 H286"/>
        <path class="rv-symbol" d="M278 94 L286 100 L278 106"/>
        <text class="rv-small" x="240" y="82" text-anchor="middle">Change?</text>
        <rect class="rv-node rv-alternative-plan" x="296" y="62" width="154" height="76" rx="13"/>
        <path class="rv-symbol" d="M353 78 H393 M353 87 H383"/>
        <text class="rv-label" x="373" y="116" text-anchor="middle">Alternative</text>
        <text class="rv-small" x="48" y="169">Potential gain</text>
        <rect class="rv-scale" x="48" y="186" width="384" height="12" rx="6"/>
        <g clip-path="url(#${id}-gain)"><rect class="rv-gain" x="48" y="186" width="384" height="12" rx="6"/></g>
        <path class="rv-cost-marker" d="M262 169 V215"/>
        <text class="rv-small rv-cost-label" x="272" y="170">Cost of change</text>
        <circle class="rv-gain-marker" cx="174" cy="192" r="8"/>
        <text class="rv-small" x="48" y="235">Keep the plan</text>
        <text class="rv-small" x="432" y="235" text-anchor="end">Consider changing</text>
        <text class="rv-disclaimer" x="240" y="266" text-anchor="middle">Conceptual tradeoff · no measured values</text>`
    },
    information: {
      title: 'Learning from selective information',
      description: 'Only part of the available information is queried or revealed. A selected signal reaches the learner, while other components remain unknown. An additional observation, probe, or preference query can inform the decision without assuming complete state information.',
      caption: 'A well-chosen observation or query can inform a decision without revealing the full state.',
      height: 280,
      draw: ({ edge }) => `
        <text class="rv-heading" x="240" y="28" text-anchor="middle">Choose what to reveal</text>
        <path class="rv-uncertified" d="M99 84 H143 Q158 84 158 101 V125 H192"/>
        ${edge('M99 144 H192')}
        <path class="rv-uncertified" d="M99 204 H143 Q158 204 158 187 V163 H192"/>
        ${edge('M288 144 H352')}
        <path class="rv-feedback" d="M398 185 V222 H240 V186"/>
        <path class="rv-symbol" d="M234 194 L240 186 L246 194"/>
        <rect class="rv-muted-node" x="29" y="59" width="70" height="50" rx="12"/>
        <rect class="rv-node" x="29" y="119" width="70" height="50" rx="12"/>
        <rect class="rv-muted-node" x="29" y="179" width="70" height="50" rx="12"/>
        <text class="rv-question" x="64" y="93" text-anchor="middle">?</text>
        <path class="rv-symbol" d="M45 144 Q64 125 83 144 Q64 163 45 144Z"/>
        <circle class="rv-symbol-fill" cx="64" cy="144" r="5"/>
        <text class="rv-question" x="64" y="213" text-anchor="middle">?</text>
        <rect class="rv-query-highlight" x="23" y="113" width="82" height="62" rx="17"/>
        <rect class="rv-node" x="192" y="103" width="96" height="82" rx="13"/>
        <path class="rv-symbol" d="M227 123 H253 M227 132 H247 M227 141 H253"/>
        <text class="rv-label" x="240" y="169" text-anchor="middle">Select</text>
        <rect class="rv-node" x="352" y="103" width="102" height="82" rx="13"/>
        <path class="rv-symbol" d="M387 128 L398 117 L409 128 L398 139Z M398 139 V147"/>
        <text class="rv-label" x="403" y="169" text-anchor="middle">Learn</text>
        <text class="rv-small" x="64" y="253" text-anchor="middle">Partial view</text>
        <text class="rv-small" x="321" y="247" text-anchor="middle">Ask, probe, or query</text>`
    },
    coordination: {
      title: 'Coordinating intelligence across a network',
      description: 'A cloud node communicates with two edge nodes, which connect to four devices. Planning and selected feedback travel through the hierarchy, while local interactions link the edge nodes. The network is a conceptual research architecture, not a deployed system.',
      caption: 'Coordinate cloud, edge, and device decisions while communication and computation remain limited.',
      height: 300,
      draw: ({ edge }) => `
        <text class="rv-heading" x="240" y="28" text-anchor="middle">Local decisions. Shared intelligence.</text>
        ${edge('M226 96 V111 H142 V131')}
        ${edge('M338 131 V111 H254 V96')}
        ${edge('M129 177 V196 H86 V220')}
        ${edge('M194 220 V196 H155 V177')}
        ${edge('M325 177 V196 H286 V220')}
        ${edge('M394 220 V196 H351 V177')}
        <path class="rv-coupling" d="M181 154 H299"/>
        <text class="rv-small" x="240" y="144" text-anchor="middle">Local interaction</text>
        <rect class="rv-node" x="177" y="50" width="126" height="47" rx="17"/>
        <path class="rv-symbol" d="M194 79 H215 Q221 79 221 73 Q221 66 213 66 Q209 56 201 63 Q194 62 193 69 Q187 74 194 79Z"/>
        <text class="rv-label" x="253" y="80" text-anchor="middle">Cloud</text>
        <rect class="rv-node rv-edge-node" x="103" y="131" width="78" height="46" rx="11"/>
        <rect class="rv-node rv-edge-node rv-edge-second" x="299" y="131" width="78" height="46" rx="11"/>
        <text class="rv-label" x="142" y="160" text-anchor="middle">Edge</text>
        <text class="rv-label" x="338" y="160" text-anchor="middle">Edge</text>
        <g class="rv-device"><rect class="rv-device-case" x="72" y="220" width="28" height="39" rx="5"/><path class="rv-device-screen" d="M79 228 H93 V245 H79Z"/></g>
        <g class="rv-device"><rect class="rv-device-case" x="180" y="220" width="28" height="39" rx="5"/><path class="rv-device-screen" d="M187 228 H201 V245 H187Z"/></g>
        <g class="rv-device"><rect class="rv-device-case" x="272" y="220" width="28" height="39" rx="5"/><path class="rv-device-screen" d="M279 228 H293 V245 H279Z"/></g>
        <g class="rv-device"><rect class="rv-device-case" x="380" y="220" width="28" height="39" rx="5"/><path class="rv-device-screen" d="M387 228 H401 V245 H387Z"/></g>
        <text class="rv-small" x="240" y="286" text-anchor="middle">Planning ↔ selected feedback</text>`
    },
    robustness: {
      title: 'Refreshing a model for its decision value',
      description: 'A server model may refresh a device model. The refresh decision weighs model age, downstream decision value, and update cost. The clock continues to move while the update path activates selectively, illustrating that age alone does not determine a model’s usefulness.',
      caption: 'Model age alone is not enough: weigh decision value and update cost before refreshing.',
      height: 280,
      draw: ({ edge }) => `
        <text class="rv-heading" x="240" y="28" text-anchor="middle">Fresh enough for the decision</text>
        ${edge('M154 100 H187', 'rv-refresh-flow')}
        ${edge('M293 100 H326', 'rv-refresh-flow')}
        <path class="rv-feedback" d="M88 184 V163 H223 V133 M240 184 V133 M392 184 V163 H257 V133"/>
        <rect class="rv-node" x="24" y="68" width="130" height="65" rx="13"/>
        <text class="rv-label" x="89" y="96" text-anchor="middle">Server model</text>
        <path class="rv-symbol" d="M65 112 H113"/>
        <rect class="rv-node rv-refresh-gate" x="187" y="68" width="106" height="65" rx="13"/>
        <text class="rv-label" x="240" y="96" text-anchor="middle">Refresh?</text>
        <path class="rv-symbol" d="M228 112 H250 M244 106 L250 112 L244 118"/>
        <rect class="rv-node rv-device-model" x="326" y="68" width="130" height="65" rx="13"/>
        <text class="rv-label" x="391" y="96" text-anchor="middle">Device model</text>
        <path class="rv-symbol" d="M367 112 H415"/>
        <circle class="rv-agent" cx="88" cy="205" r="23"/>
        <circle class="rv-symbol" cx="88" cy="205" r="13"/>
        <path class="rv-clock-hand" d="M87 194 H89 V206 H87Z"/>
        <path class="rv-symbol" d="M88 205 H96"/>
        <circle class="rv-agent rv-decision-value" cx="240" cy="205" r="23"/>
        <path class="rv-symbol" d="M226 207 L235 215 L253 195"/>
        <circle class="rv-agent" cx="392" cy="205" r="23"/>
        <path class="rv-symbol" d="M380 197 H404 V213 H380Z M384 193 V197 M400 193 V197 M384 217 H400"/>
        <text class="rv-small" x="88" y="253" text-anchor="middle">Model age</text>
        <text class="rv-small" x="240" y="253" text-anchor="middle">Decision value</text>
        <text class="rv-small" x="392" y="253" text-anchor="middle">Update cost</text>`
    }
  };

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function synchronize(instance) {
    const { element, button, diagram } = instance;
    const reduced = motionPreference.matches;
    const expanded = !element.closest('details:not([open]), [hidden]');
    const running = instance.enabled && instance.visible && expanded && !document.hidden && !reduced;
    element.classList.toggle('rv-running', running);
    button.disabled = reduced;
    button.setAttribute('aria-pressed', String(instance.enabled && !reduced));
    button.setAttribute('aria-label', reduced
      ? `Animation disabled by reduced-motion preference: ${diagram.title}`
      : `${instance.enabled ? 'Pause' : 'Play'} animation: ${diagram.title}`);
    button.title = reduced ? 'Your reduced-motion preference keeps this illustration still.' : '';
    const label = button.querySelector('.rv-control-label');
    const glyph = button.querySelector('.rv-control-glyph');
    const labelText = reduced ? 'Reduced motion' : instance.enabled ? 'Pause' : 'Play';
    const glyphText = reduced ? '—' : instance.enabled ? 'Ⅱ' : '▷';
    if (label.textContent !== labelText) label.textContent = labelText;
    if (glyph.textContent !== glyphText) glyph.textContent = glyphText;
  }

  function synchronizeAll() {
    pendingSync = false;
    for (const [element, instance] of instances) {
      if (!element.isConnected) {
        if (visibilityObserver) visibilityObserver.unobserve(element);
        instances.delete(element);
      } else {
        synchronize(instance);
      }
    }
  }

  function scheduleSync() {
    if (!pendingSync) {
      pendingSync = true;
      window.requestAnimationFrame(synchronizeAll);
    }
  }

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const instance = instances.get(entry.target);
        if (instance) {
          instance.visible = entry.isIntersecting;
          synchronize(instance);
        }
      }
    }, { threshold: 0 })
    : null;

  function initialize(element) {
    if (instances.has(element)) return;
    const key = element.dataset.researchVisual;
    const diagram = diagrams[key];
    if (!diagram) return;
    const id = `research-visual-${++sequence}`;
    const edge = (path, extraClass = '') => `
      <path class="rv-connection" d="${path}" marker-end="url(#${id}-arrow)"/>
      <path class="rv-flow ${extraClass}" d="${path}"/>`;
    const content = diagram.draw({ id, edge });
    const caption = element.dataset.researchVisualCaption || diagram.caption;
    const captionTag = element.tagName === 'FIGURE' ? 'figcaption' : 'p';
    const markup = `
      <svg class="rv-diagram rv-diagram-${key}" id="${id}" viewBox="0 0 480 ${diagram.height}" role="img" aria-labelledby="${id}-title ${id}-description" focusable="false">
        <title id="${id}-title">${escapeText(diagram.title)}</title>
        <desc id="${id}-description">${escapeText(diagram.description)}</desc>
        <defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="rv-arrow" d="M0 0 L10 5 L0 10Z"/></marker></defs>
        ${content}
      </svg>
      <${captionTag} class="rv-caption">${escapeText(caption)}</${captionTag}>
      <div class="rv-controls"><span class="rv-concept-label">Conceptual illustration</span><button class="rv-control" type="button" aria-controls="${id}" aria-pressed="true"><span class="rv-control-glyph" aria-hidden="true">Ⅱ</span><span class="rv-control-label">Pause</span></button></div>`;
    // Construct the complete replacement first, preserving the HTML fallback
    // if the chosen diagram is unknown or its construction fails.
    element.innerHTML = markup;
    element.classList.add('research-visual-widget');
    const instance = { element, diagram, button: element.querySelector('.rv-control'), enabled: true, visible: !visibilityObserver };
    instances.set(element, instance);
    instance.button.addEventListener('click', () => {
      instance.enabled = !instance.enabled;
      synchronize(instance);
    });
    synchronize(instance);
    if (visibilityObserver) visibilityObserver.observe(element);
  }

  function discover(root) {
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.matches && root.matches(selector)) initialize(root);
    root.querySelectorAll(selector).forEach(initialize);
  }

  discover(document);
  // The project atlas replaces cards when filtered. Initialize only newly
  // inserted figures, and release old ones rather than retaining removed DOM.
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) discover(node);
    }
    scheduleSync();
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'hidden'] });

  document.addEventListener('toggle', scheduleSync, true);
  document.addEventListener('visibilitychange', synchronizeAll);
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', synchronizeAll);
  else motionPreference.addListener(synchronizeAll);
})();
