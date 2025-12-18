# Science Simulator Hub

A unified platform for interactive 3D science learning experiences. This project orchestrates three distinct simulators under a single, modern launcher interface.

## 🚀 Features

-   **Unified Dashboard**: A central "Launcher" application to easily access all simulators.
-   **Sim 1: Solar Hand Control**: Interact with the solar system using hand gestures (Webcam).
-   **Sim 2: Particle Playground**: Control particle physics with your voice (Microphone).
-   **Sim 3: React City 3D**: Explore a procedurally generated 3D city (Keyboard/Mouse).
-   **Modern Tech Stack**: Built with Vite, React, TypeScript, and Three.js.

## 🛠️ Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/kuanhoong/science-simulator.git
    cd science-simulator
    ```

2.  **Install all dependencies**:
    We have a helper script to install dependencies for the root, launcher, and all simulators at once.
    ```bash
    npm run install:all
    ```
    *If you encounter permission issues, you might need to use `sudo` or fix your npm permissions.*

## ▶️ Usage

To start the entire suite (Launcher + All Simulators):

```bash
npm run dev
```

This command uses `concurrently` to start all 4 applications in parallel.

### Access Points

| Application | Port | Description |
| :--- | :--- | :--- |
| **Launcher** | `http://localhost:3000` | **Start Here!** The main dashboard. |
| Sim 1 | `http://localhost:3001` | Solar Hand Control |
| Sim 2 | `http://localhost:3002` | Particle Playground |
| Sim 3 | `http://localhost:3003` | React City 3D |

## 📂 Project Structure

```
├── launcher/      # Main dashboard application (Port 3000)
├── sim1/          # Solar Hand Control Simulator (Port 3001)
├── sim2/          # Particle Playground Simulator (Port 3002)
├── sim3/          # React City 3D Simulator (Port 3003)
├── package.json   # Root configuration and scripts
└── README.md      # Project documentation
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE)
