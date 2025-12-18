# 🪐 Solar Hand Control

An immersive, gesture-controlled 3D Solar System simulator built with **React**, **Three.js (React Three Fiber)**, and **MediaPipe**. Experience the cosmos through a futuristic interface where your hands act as the controller.

## ✨ Features

- **Gesture-Based Navigation**: Use your webcam to navigate the stars. No mouse or keyboard required for zooming.
- **Realistic 3D Simulation**: Accurate planetary orbits, axial tilts, and rotation speeds.
- **Interactive Planet Data**: Click on any planet to reveal scientific data, including mass, diameter, and unique characteristics.
- **Responsive HUD**: A sleek, dark-themed UI that provides real-time feedback on your detected hand gestures.
- **Stunning Visuals**: High-quality textures, point-light sun emission, and a dynamic starfield background.

## 🖐️ Gesture Guide

The application uses the **MediaPipe Hands** model to track your movements in real-time.

| Gesture | Action |
| :--- | :--- |
| **Open Palm** ✋ | **Zoom In**: Move closer to the celestial bodies. |
| **Closed Fist** ✊ | **Zoom Out**: Pull back to see the entire orbital plane. |
| **Show Hand** | **Activate Tracking**: Tracking starts automatically when a hand is visible. |

## 🛠️ Technical Stack

- **Frontend**: React 19
- **3D Engine**: Three.js via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- **Computer Vision**: [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- **Styling**: Tailwind CSS
- **Components**: [React Three Drei](https://github.com/pmndrs/drei) for helpers (Stars, OrbitControls, Html)

## 🚀 Getting Started

1.  **Grant Permissions**: When prompted, allow the browser to access your camera.
2.  **Calibrate**: Ensure you are in a well-lit environment and hold your hand up to the camera.
3.  **Explore**: Use an open palm to dive deep into the rings of Saturn, or a fist to return to the sun's warm glow.
4.  **Learn**: Click on any planet mesh to open its information card.

## 📁 Project Structure

- `App.tsx`: Main layout and UI overlay logic.
- `components/SolarSystemScene.tsx`: The 3D world, lighting, and planetary hierarchy.
- `components/GestureController.tsx`: Webcam integration and the gesture recognition engine.
- `constants.ts`: Scientific data and texture mappings for the solar system.
- `types.ts`: TypeScript definitions for gestures and planet data.

## ⚠️ Requirements

- A modern browser with **Webcam access**.
- A stable internet connection to load MediaPipe models and planetary textures via CDN.
- **HTTPS** is required for camera access in most browsers.

*You may test this app via [Google AI Studio:](https://ai.studio/apps/drive/1jZMdWivQxkfKvqPBrX8B8KK7Yc0yvkOb)*
