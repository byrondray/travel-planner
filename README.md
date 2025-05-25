# AI Travel Planner

An intelligent travel planning application built with SvelteKit that generates personalized travel itineraries using OpenAI's GPT models. Create detailed day-by-day travel plans based on your destination, budget, interests, and travel style.

## ✨ Features

- **AI-Powered Itineraries**: Generate detailed travel plans using OpenAI's GPT-4 Turbo
- **Personalized Planning**: Customize plans based on:
  - Destination
  - Trip duration (1-30 days)
  - Budget level (Budget, Medium, Luxury)
  - Travel style (Relaxed, Balanced, Action-packed)
  - Personal interests (Food, Museums, History, Nature, etc.)
- **Plan Management**: Save and view multiple travel plans locally
- **Beautiful UI**: Clean, responsive design with Tailwind CSS
- **TypeScript Support**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, pnpm, or yarn
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or start and open in browser
   npm run dev -- --open
   ```

The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) 2.16.0
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0.0
- **AI Integration**: [OpenAI API](https://openai.com/api/) 4.87.3
- **Build Tool**: [Vite](https://vitejs.dev/) 6.0.0
- **Code Quality**: Prettier with Svelte plugin

## 📁 Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # App layout
│   ├── +page.svelte            # Main form page
│   ├── +page.server.ts         # Server actions for form handling
│   ├── api/
│   │   └── generate-plan/
│   │       └── +server.ts      # API endpoint for plan generation
│   ├── plans/
│   │   └── +page.svelte        # Saved plans listing
│   └── results/
│       ├── +page.svelte        # Generated plan display
│       └── +page.server.ts     # Results page server logic
├── lib/
│   └── index.ts                # Shared utilities
├── app.css                     # Global styles
├── app.html                    # HTML template
└── app.d.ts                    # TypeScript declarations
```

## 🎯 Usage

1. **Create a New Plan**

   - Navigate to the home page
   - Fill out the travel planning form:
     - Enter your destination
     - Select trip duration
     - Choose budget level
     - Pick your travel style
     - Select interests that match your preferences
   - Click "Generate Travel Plan"

2. **View Your Plan**

   - After generation, you'll be redirected to the results page
   - Your plan includes day-by-day breakdowns, restaurant recommendations, and practical tips
   - Plans are automatically saved to local storage

3. **Manage Saved Plans**
   - Click "View Saved Plans" to see all your previous itineraries
   - Delete plans you no longer need
   - Revisit any saved plan by clicking on it

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run format` - Format code with Prettier
- `npm run lint` - Check code formatting

## 🌟 Key Features Explained

### AI Integration

The app uses OpenAI's GPT-4 Turbo model to generate comprehensive travel itineraries. The AI considers your specific preferences and creates detailed plans including:

- Daily activity schedules
- Restaurant recommendations
- Tourist attractions
- Local tips and insights

### Local Storage

Travel plans are saved in your browser's local storage, allowing you to:

- Access plans offline
- Maintain privacy (no server-side data storage)
- Keep plans indefinitely until manually deleted

### Responsive Design

Built with Tailwind CSS for a mobile-first, responsive experience that works on all device sizes.

## 🔒 Environment Variables

| Variable         | Description                                     | Required |
| ---------------- | ----------------------------------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key for generating travel plans | Yes      |

## 🚀 Deployment

This project uses `@sveltejs/adapter-auto` which automatically selects the appropriate adapter for your deployment platform.

For specific platforms:

- **Vercel**: Works out of the box
- **Netlify**: Works out of the box
- **Node.js**: May need to switch to `@sveltejs/adapter-node`

Build for production:

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the excellent framework
- [OpenAI](https://openai.com/) for the powerful AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling approach
