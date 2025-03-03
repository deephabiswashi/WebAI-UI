# AI Chat Interface with Llama 3.1

A modern, feature-rich chat interface for interacting with Llama 2 models through Ollama. Built with Next.js, TypeScript, and Tailwind CSS, featuring a beautiful glassmorphic UI design with 3D animations and real-time streaming responses.

![UI Preview](docs/preview.png)

## ✨ Features

### 🎨 Modern UI/UX
- Stunning glassmorphic design with 3D hover effects
- Smooth animations and transitions
- Dark/Light theme support
- Responsive layout for all devices
- Beautiful gradient backgrounds
- Custom scrollbars and animations
- Real-time streaming responses with typing effect

### 🤖 AI Integration
- Seamless integration with Ollama and Llama 2
- Real-time response streaming
- Customizable model settings:
  - Temperature control
  - Max tokens limit
  - Top P sampling
  - System prompt customization
- Code syntax highlighting
- Markdown support
- Conversation history

### 📁 File Management
- File upload support (up to 10MB)
- Image preview
- File type detection
- Secure file storage
- Download attachments

### 💾 Data Persistence
- Local SQLite database
- Conversation history
- Message persistence
- User settings storage
- File metadata tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- [Ollama](https://ollama.ai) installed with Llama 2 model
- SQLite

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webui
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npm run db:init
```

5. Start Ollama server:
```bash
ollama serve
```

6. Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000 to see your application.

## 🛠️ Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# API Configuration
OLLAMA_API_URL="http://localhost:11434"
DEFAULT_MODEL="llama2"

# File Upload
MAX_FILE_SIZE=10485760 # 10MB
UPLOAD_DIR="./uploads"

# WebSocket
WS_PORT=3001

# Security
JWT_SECRET="your-secret-key-here"
```

## 📦 Project Structure

```
.
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and services
│   └── styles/          # Global styles and Tailwind CSS
├── prisma/              # Database schema and migrations
├── scripts/             # Utility scripts
├── uploads/             # File upload directory
└── public/             # Static assets
```

## 🎨 UI Components

- **ChatMessages**: Displays conversation with support for markdown, code blocks, and file attachments
- **ModelSettings**: Configurable AI model parameters
- **ThemeToggle**: Dark/Light theme switcher
- **FileUpload**: File upload with drag-and-drop support
- **Sidebar**: Conversation history and navigation

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:init`: Initialize database
- `npm run db:migrate`: Run database migrations

### Docker Support

Build and run with Docker:

```bash
docker-compose up -d
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 