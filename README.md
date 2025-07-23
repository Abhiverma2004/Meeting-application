# 📹 Video Conference App

A real-time video conferencing web app built with **React**, **WebRTC**, **Socket.io**, and **Node.js (Express)**. Features include:
- One-on-one and multi-user video calls
- Real-time chat
- Screen sharing
- Room-based join system
- Responsive UI

---

## 🛠️ Tech Stack

| Frontend       | Backend        | Real-Time Communication |
|----------------|----------------|--------------------------|
| React, Tailwind CSS | Node.js, Express | WebRTC, Socket.io        |

---

## 🗂️ Project Structure

video-conference-app/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/ # UI components
│ ├── App.js
│ └── index.js
│
├── server/ # Express backend
│ ├── index.js # Main server file
│ └── package.json
│
├── README.md
└── package.json # Root (optional)

yaml
Copy
Edit

---

## 🧑‍💻 Features

- 🔐 Join by Room ID
- 🎥 Peer-to-peer video using WebRTC
- 💬 Text chat via Socket.io
- 🖥️ Screen sharing support
- 📱 Fully responsive interface

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Abhiverma2004/Meeting-application
cd Meeting-application
2. Setup Server
bash
Copy
Edit
cd server
npm install
node index.js
Server runs on http://localhost:5000

3. Setup Client
bash
Copy
Edit
cd ../client
npm install
npm start
Client runs on http://localhost:3000

🧪 Environment Variables (Optional)
If you're using .env files:

server/.env

env
Copy
Edit
PORT=5000
client/.env

env
Copy
Edit
REACT_APP_SERVER_URL=http://localhost:5000
🙋‍♂️ Contributing
Pull requests are welcome! For major changes, open an issue first.

🪪 License
MIT 
