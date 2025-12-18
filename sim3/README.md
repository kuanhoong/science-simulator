# 🏙️ ReactCity 3D

A modern "SimCity-lite" simulator built with **React**, **Three.js**, and **Gemini AI**. Experience a fully interactive 3D grid where you can zone land, build infrastructure, and manage a growing economy with the help of an AI-powered city advisor.

## ✨ Features

-   **3D World Construction**: Built on `react-three-fiber`, featuring a 20x20 interactive grid with dynamic lighting, shadows, and a day/night atmosphere.
-   **Zoning Simulation**: Place Residential, Commercial, Industrial, and Power zones. Watch buildings grow from empty lots to skyscrapers based on infrastructure availability.
-   **Live Economy**: Manage your city's funds, population growth, and daily tax income.
-   **AI Advisor**: Integrated Google Gemini AI that analyzes your specific city layout and provides humorous, actionable advice on how to improve your metropolis.
-   **Dynamic Growth Logic**:
    *   **Roads**: The backbone of the city. Buildings will only grow or maintain their level if connected to a road.
    *   **Commercial Synergy**: Commercial zones thrive when placed near residential areas.
    *   **Residential Growth**: Population increases as residential zones level up.

## 🛠️ Tech Stack

-   **Frontend**: React (v19)
-   **Rendering**: Three.js & React Three Fiber (R3F)
-   **Component Library**: React Three Drei
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **AI**: Google GenAI (Gemini 2.5 Flash)

## 🎮 How to Play

1.  **Start Building**: Select the **Road** tool to lay down your first streets. Infrastructure is key!
2.  **Zone the Land**: 
    *   **Residential (Green)**: Where your citizens live.
    *   **Commercial (Blue)**: Where they shop and generate high taxes.
    *   **Industrial (Yellow)**: Provides jobs and steady income.
3.  **Provide Power**: Place Power Stations to support large-scale developments.
4.  **Manage Growth**: Watch the statistics in the top-left corner. If your income is negative, you'll eventually run out of funds to build!
5.  **Consult the AI**: Click the "Consult Advisor" button to get a real-time analysis of your city from the Gemini AI.

## 🏗️ Simulation Rules

The city updates every second (1000ms). During each "tick":
-   **Residential zones** check for road access. If connected, they have a chance to level up.
-   **Commercial zones** check for both road access AND proximity to residential zones.
-   **Industrial zones** require road access to grow.
-   **Income** is calculated based on the total level of all buildings across the city.

## 🚀 Development

The project uses a standard ESM module structure with an import map in `index.html`. No heavy build step is required for local modification of ES modules.

-   `services/simulation.ts`: Contains the core logic for the city growth engine.
-   `components/GameCanvas.tsx`: Manages the 3D scene, lighting, and camera.
-   `components/AssetMesh.tsx`: Handles the 3D representation of different building types.
-   `services/geminiService.ts`: Manages the prompt engineering and connection to the AI Advisor.

---
*You may test this app via [Google AI Studio:](https://ai.studio/apps/drive/1-EyKedkwGOwMSyVzSyOVRoiLK8C0eRrx?fullscreenApplet=true)*
