# Lucence
Your AI Interview Coach

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Media Handling**: 
  - React Webcam for video capture
  - Web Audio API for audio visualization
  - WebRTC for media streaming

### Backend
- **Server**: Flask (Python)
- **Real-time Communication**: WebSocket
- **File Processing**: 
  - PyPDF2 for PDF parsing
  - python-docx for DOCX handling

### AI/ML Integration
- **Conversation AI**: OpenAI GPT-3.5
- **Text-to-Speech**: ElevenLabs
- **Speech-to-Text**: AssemblyAI

## Getting Started

### Prerequisites
- Node.js 18+ for frontend
- Python 3.8+ for backend
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aryanguls/lucence.git
cd lucence
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Environment Setup

1. Create a `.env` file in the backend directory using `.env.example` as a template:
```bash
cp .env.example .env
```

2. Add your API keys to the `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python3 app.py
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Real-time AI interviewer interactions
- Audio and video streaming
- Resume parsing and analysis
- Dynamic interview customization based on job role
- Audio visualization for voice input
- Professional interview feedback and scoring
