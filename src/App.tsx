import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Palette, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GRADIENTS, GradientType } from './types';

export default function App() {
  const [text, setText] = useState('Hello World!');
  const [selectedGradient, setSelectedGradient] = useState<GradientType>('rainbow');
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1).toUpperCase();
  };

  const interpolateColors = (colors: string[], factor: number) => {
    if (factor <= 0) return colors[0];
    if (factor >= 1) return colors[colors.length - 1];

    const segmentCount = colors.length - 1;
    const scaledFactor = factor * segmentCount;
    const index = Math.floor(scaledFactor);
    const innerFactor = scaledFactor - index;

    const c1 = hexToRgb(colors[index]);
    const c2 = hexToRgb(colors[index + 1]);

    const r = c1.r + (c2.r - c1.r) * innerFactor;
    const g = c1.g + (c2.g - c1.g) * innerFactor;
    const b = c1.b + (c2.b - c1.b) * innerFactor;

    return rgbToHex(r, g, b);
  };

  const getCharColor = useCallback((index: number, total: number, type: GradientType) => {
    if (total <= 1) return '#FFFFFF';
    const factor = index / (total - 1);

    if (type === 'rainbow') {
      const hue = (index / total) * 360;
      return `hsl(${hue}, 100%, 50%)`;
    }

    const gradient = GRADIENTS.find(g => g.id === type);
    if (!gradient) return '#FFFFFF';

    return interpolateColors(gradient.colors, factor);
  }, []);

  // For the game code, we need the exact hex
  const getCharHex = useCallback((index: number, total: number, type: GradientType) => {
    if (total <= 1) return '#FFFFFF';
    const factor = index / (total - 1);

    if (type === 'rainbow') {
      const hue = (index / total) * 360;
      // Convert HSL to RGB Hex
      const h = hue / 360;
      const s = 1;
      const l = 0.5;
      let r, g, b;
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      r = hue2rgb(h + 1/3);
      g = hue2rgb(h);
      b = hue2rgb(h - 1/3);
      return rgbToHex(r * 255, g * 255, b * 255);
    }

    const gradient = GRADIENTS.find(g => g.id === type);
    if (!gradient) return '#FFFFFF';

    return interpolateColors(gradient.colors, factor);
  }, []);

  const coloredChars = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      color: getCharColor(i, text.length, selectedGradient),
      hex: getCharHex(i, text.length, selectedGradient)
    }));
  }, [text, selectedGradient, getCharColor, getCharHex]);

  const outputCode = useMemo(() => {
    return coloredChars.map(item => `<${item.hex}>${item.char}`).join('');
  }, [coloredChars]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4"
          >
            <Palette size={14} />
            Game Text Tools
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Last Asylum Gradient Generator
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            by hazelora<br/><br/>Create colorful chat messages in your favorite dopamin game. Leave my character a like if you enjoy it. 
          </p>
        </header>

        <main className="space-y-8">
          {/* Input Section */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-neutral-300 font-medium">
              <Type size={18} className="text-indigo-400" />
              <h2>Chat Message</h2>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={160}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <div className="absolute right-3 bottom-3 text-xs text-neutral-500 font-mono">
                {text.length}/160
              </div>
            </div>
          </section>

          {/* Gradient Selection */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 ml-1">
              Select Gradient Style
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.id}
                  onClick={() => setSelectedGradient(gradient.id)}
                  className={`group relative p-3 rounded-xl border transition-all text-left ${
                    selectedGradient === gradient.id
                      ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/50'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-2 w-full rounded-full overflow-hidden flex">
                      {gradient.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="h-full flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${selectedGradient === gradient.id ? 'text-indigo-300' : 'text-neutral-400'}`}>
                      {gradient.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Preview Section */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-hidden">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              Live Preview
            </h2>
            <div className="min-h-[80px] flex items-center justify-center bg-neutral-950 rounded-xl p-8 border border-neutral-800/50">
              <div className="text-2xl md:text-3xl font-bold break-all text-center leading-relaxed">
                {coloredChars.map((item, i) => (
                  <span key={i} style={{ color: item.color }}>
                    {item.char}
                  </span>
                ))}
                {text.length === 0 && <span className="text-neutral-700 italic font-normal text-lg">Preview will appear here...</span>}
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                Generated Code
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Check size={14} /> Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Copy size={14} /> Copy Code
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <textarea
              readOnly
              value={outputCode}
              className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-mono text-sm text-neutral-400 focus:outline-none resize-none"
            />
          </section>
        </main>

        <footer className="mt-20 pt-8 border-t border-neutral-900 text-center text-neutral-600 text-sm">
          <p>Copy the code above and paste it into your game's chat box.</p>
        </footer>
      </div>
    </div>
  );
}
