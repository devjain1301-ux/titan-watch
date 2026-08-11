# ⏱️ Titan Sovereign Emerald — Luxury Horology Experience

A state-of-the-art interactive scrollytelling web experience built for the Titan Sovereign timepiece, powered by a 210-frame high-resolution canvas sequence and Web Audio procedural sound design.

---

## 🌟 Key Features

1. **Atomic Frame Scrollytelling**:
   - Scroll down to scrub seamlessly through the starlight condensation and watch assembly.
   - Smooth 60fps physics interpolation (lerp) for fluid motion.
   - 4 synchronized narrative chapters.

2. **Interactive Controls**:
   - **Cinematic Auto-Play / Pause**: Automatically animates through the sequence.
   - **Scrubbing Slider**: Jump directly to any frame (1 to 210).
   - **Direct Canvas Drag / Touch**: Drag on the canvas to rotate and control the transformation.
   - **Procedural Sound FX**: Synthesized mechanical ratchets, swooshes, and celestial chimes via Web Audio API.

3. **Interactive Hotspots**:
   - Dissect the completed watch with pinpoint tooltips on the Emerald Sunburst Dial, Fluted 18K Bezel, Triplock Crown, and Solid Gold Bracelet.

4. **Bespoke Atelier Studio & Customizer**:
   - Switch strap finishes (Solid Gold, Tuscan Cognac Alligator, Emerald Rubber).
   - Daylight vs Super-LumiNova Night Glow mode toggle.
   - Live custom monogram caseback engraving preview.
   - Dynamic real-time price valuation.

5. **VIP Concierge Modal**:
   - Reserve an allocation and generate an authenticated Certificate of Horological Provenance with a unique serial number.

---

## 🚀 How to Run Locally

1. **Start the local server**:
   ```bash
   node server.js
   ```
   *Or with npm:*
   ```bash
   npm start
   ```

2. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📁 Project Structure

```
f:\titan watch\
├── frames/                       # 210 extracted high-res animation frames
├── index.html                    # Semantic HTML5 layout & components
├── styles.css                    # Luxury dark-gold design system & glassmorphism
├── app.js                        # Canvas scrubbing engine & Web Audio synthesizer
├── server.js                     # High-performance zero-dependency local static server
├── package.json                  # Node metadata & scripts
└── README.md                     # Documentation
```
