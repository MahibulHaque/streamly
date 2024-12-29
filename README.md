# Streamly

Streamly is a powerful and intuitive SaaS application designed to revolutionize asynchronous communication through screen recording, video sharing, and collaboration. Inspired by applications like Loom, Streamly enables users to easily capture their screen, webcam, or both, and instantly share videos via a link. The application consists of three core components:

1. **Website**: A user-facing platform for video management, sharing, and account handling.
2. **Electron Application**: A desktop application for screen and webcam recording.
3. **Socket.IO Express Server**: A real-time server backend enabling for video file to saved on AWS S3 and `title`, `description`, `transcription` to generated using GROQAI SDK.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Features

- **Screen & Webcam Recording**: Capture screens, webcams, or both seamlessly.
- **Instant Sharing**: Generate shareable links immediately after recording.
- **Video Management**: Organize, delete, and update recordings.
- **Real-Time Notifications**: Receive updates on video uploads and shares.
- **Cross-Platform Support**: Works across web and desktop platforms.
- **AI-Generation: Allows for transcription, title, description to be generated using AI.

### Website Features

- User authentication and account management.
- Dashboard for video management.
- Analytics for tracking video views and engagement.
- Share videos with customizable privacy settings.

### Electron Application Features

- Record screen, webcam, or both.
- Pause and resume recordings.
  
### Socket.IO Express Server Features

- Real-time communication for notifications and updates.
- Efficient handling of video upload and processing events.
- WebSocket support for low-latency interactions.

---

## Tech Stack

### Website
- **Frontend**: Next.js, Tailwind CSS
- **State Management**: Redux Toolkit

### Electron Application
- **Framework**: Electron.js
- **UI**: React.js
- **Recording**: MediaRecorder API, Socket.IO

### Socket.IO Express Server
- **Backend**: Node.js, Express.js, AWS S3 and CloudFront
- **WebSocket**: Socket.IO
- **Database**: MongoDB
- **AI SDK: GROQ AI SDK

---

## Architecture Overview

Streamly’s architecture is divided into three main components:

1. **Frontend (Website)**
   - Interacts with the backend API and Socket.IO server.
   - Provides the user interface for managing and sharing videos.

2. **Desktop (Electron Application)**
   - Handles screen and webcam recordings.
   - Communicates with the backend server for video upload and retrieval.

3. **Backend (Socket.IO Express Server)**
   - Manages real-time communication, authentication, and video processing.
   - Acts as the central hub connecting the website and Electron application.

---

## Installation

### Prerequisites

- Node.js (>= 16.x)
- MongoDB (>= 5.x)
- Yarn or npm

### Clone the Repository
```bash
git clone https://github.com/yourusername/streamly.git
cd streamly
