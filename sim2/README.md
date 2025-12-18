# 🌊 Sound Particle Playground

An interactive, high-performance particle playground that reacts in real-time to your voice and ambient sound. Built with **React**, **Three.js**, and custom **GLSL Shaders**, this application transforms audio data into a mesmerizing dynamic wave form.

## ✨ Features

-   **Real-time Audio Analysis**: Uses the Web Audio API to detect loudness (RMS) and pitch (autocorrelation) from your microphone.
-   **Dynamic Wave Form**: Particles are distributed in a horizontal ribbon that fluctuates, flows, and swirls based on audio frequency and amplitude.
-   **High Performance**: Leverages GPU-accelerated vertex and fragment shaders to handle up to 100,000 particles smoothly.
-   **Interactive Camera**: Move your mouse to tilt and rotate the particle field. The camera "breathes" and zooms dynamically with the loudness of the sound.
-   **Customizable Visuals**:
    -   **Particle Count**: Scale from 1,000 to 100,000 particles.
    -   **Size & Shape**: Choose between Circles, Squares, Triangles, and Stars.
    -   **Color Engines**: Support for Solid colors, flowing Gradients, and Random prismatic modes.
    -   **Sensitivity Controls**: Fine-tune how much the sound impacts the movement and physics of the wave.
-   **Audio HUD**: A minimalist head-up display showing live amplitude meters and detected pitch frequency in Hz.

## 🛠️ Technical Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Rendering**: [Three.js](https://threejs.org/) (WebGL)
-   **Shaders**: GLSL (Custom Vertex/Fragment shaders for wave math)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Audio**: Web Audio API (AnalyserNode)

## 🚀 Getting Started

1.  **Launch the App**: Open the `index.html` in a modern browser.
2.  **Enable Microphone**: Click the **"Start Microphone"** button in the top-right controls panel.
3.  **Grant Permissions**: Ensure you allow microphone access when prompted by the browser.
4.  **Interact**:
    -   **Speak or Sing**: Watch the wave amplitude increase with volume and the frequency/speed change with pitch.
    -   **Move Mouse**: Tilt the scene to see the 3D depth of the wave ribbon.
    -   **Customize**: Use the sliders to change particle density or switch shapes to see different geometric SDF renders.

## 🎛️ Controls Panel

-   **Particles**: Adjusts the total number of points in the buffer. Increasing this adds density but requires more GPU power.
-   **Size**: Changes the base radius of each particle.
-   **Shape**: Switches the Signed Distance Function (SDF) used in the fragment shader to render different geometries.
-   **Color Mode**: 
    -   *Single*: One solid color.
    -   *Gradient*: Interpolates between two colors across the X-axis.
    -   *Random*: Assigns a unique, stable random color to every particle.
-   **Loudness Sensitivity**: Multiplier for how much volume displaces the particles.
-   **Pitch Influence**: Controls how much the detected frequency affects the wave's speed and turbulence.

## 📝 License

This project is designed as an experimental UI/UX and audio-visual playground. Feel free to explore the shaders in `render/Shaders.ts` to see how the wave mathematics are implemented!

*You may test this app via [Google AI Studio:](https://ai.studio/apps/drive/1jccyd2_aAYgzrtGj8J1Ast54H0neeaA_)*
