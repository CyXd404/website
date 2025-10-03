export interface BrowserFingerprint {
  fingerprint: string;
  components: {
    screen: string;
    timezone: string;
    language: string;
    platform: string;
    userAgent: string;
    canvas: string;
    webgl: string;
    fonts: string;
    audio: string;
    hardwareConcurrency: string;
    deviceMemory: string;
    colorDepth: string;
  };
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    canvas.width = 200;
    canvas.height = 50;

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Browser Fingerprint', 4, 17);

    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return `${vendor}~${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

function getFontFingerprint(): string {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
    'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
    'Impact', 'Lucida Console'
  ];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'no-fonts';

  const testString = 'mmmmmmmmmmlli';
  const textSize = '72px';
  const baseWidths: { [key: string]: number } = {};
  const availableFonts: string[] = [];

  baseFonts.forEach(baseFont => {
    ctx.font = `${textSize} ${baseFont}`;
    baseWidths[baseFont] = ctx.measureText(testString).width;
  });

  testFonts.forEach(font => {
    baseFonts.forEach(baseFont => {
      ctx.font = `${textSize} ${font}, ${baseFont}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseWidths[baseFont]) {
        if (!availableFonts.includes(font)) {
          availableFonts.push(font);
        }
      }
    });
  });

  return availableFonts.sort().join(',');
}

function getAudioFingerprint(): string {
  try {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 'no-audio';

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0;
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(0);

    const audioData = analyser.frequencyBinCount.toString();

    oscillator.stop();
    context.close();

    return audioData;
  } catch {
    return 'audio-error';
  }
}

export async function generateBrowserFingerprint(): Promise<BrowserFingerprint> {
  const components = {
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language || 'unknown',
    platform: navigator.platform || 'unknown',
    userAgent: navigator.userAgent,
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    fonts: getFontFingerprint(),
    audio: getAudioFingerprint(),
    hardwareConcurrency: (navigator.hardwareConcurrency || 0).toString(),
    deviceMemory: ((navigator as any).deviceMemory || 0).toString(),
    colorDepth: screen.colorDepth.toString()
  };

  const fingerprintString = Object.values(components).join('|');
  const fingerprint = await hashString(fingerprintString);

  return {
    fingerprint,
    components
  };
}

export interface VisitorIdentifier {
  sessionId: string;
  fingerprint: string;
  lastActive: number;
  firstVisit: number;
  visitCount: number;
}

export function getVisitorIdentifier(): VisitorIdentifier | null {
  const stored = localStorage.getItem('visitor_identifier');
  if (!stored) return null;

  try {
    return JSON.parse(stored) as VisitorIdentifier;
  } catch {
    return null;
  }
}

export function setVisitorIdentifier(identifier: VisitorIdentifier): void {
  localStorage.setItem('visitor_identifier', JSON.stringify(identifier));
}

export async function getOrCreateVisitorIdentifier(): Promise<VisitorIdentifier> {
  let identifier = getVisitorIdentifier();
  const now = Date.now();
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  const fp = await generateBrowserFingerprint();

  if (!identifier || (now - identifier.lastActive) > SESSION_TIMEOUT) {
    identifier = {
      sessionId: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      fingerprint: fp.fingerprint,
      lastActive: now,
      firstVisit: identifier?.firstVisit || now,
      visitCount: (identifier?.visitCount || 0) + 1
    };
  } else if (identifier.fingerprint !== fp.fingerprint) {
    identifier = {
      ...identifier,
      fingerprint: fp.fingerprint,
      lastActive: now,
      visitCount: identifier.visitCount + 1
    };
  } else {
    identifier = {
      ...identifier,
      lastActive: now
    };
  }

  setVisitorIdentifier(identifier);
  return identifier;
}

export function isNewVisitor(): boolean {
  const identifier = getVisitorIdentifier();
  if (!identifier) return true;

  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const now = Date.now();

  return (now - identifier.lastActive) > SESSION_TIMEOUT;
}
