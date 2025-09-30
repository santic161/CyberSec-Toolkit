# AD Cheatsheet 

An Active Directory Dinamic Cheatsheet built with React, Vite, and Tailwind CSS. This page provides an intuitive interface for browsing cybersecurity commands, categories, and documentation in Markdown format.

## 🚀 Features

- **Interactive Visualization**: Browse and filter cybersecurity commands and tools
- **Markdown Documentation**: View detailed documentation with syntax highlighting
- **Dynamic Content Loading**: Automatically loads CSV and Markdown files from the documentation folder
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Content updates automatically when documentation changes
- **Search & Filter**: Find specific commands and documentation quickly

## 🏗️ Architecture

This dashboard is part of a larger system that includes:

- **Dashboard** (this repository): Frontend React application for data visualization
- **Sync Service** ([Active-Directory-Sync-Service](https://github.com/santic161/Active-Directory-Sync-Service)): Automated service that exports Notion databases to Markdown and CSV files, then synchronizes them to this repository

### Data Flow

```
Notion Database → Sync Service → GitHub Repository → Dashboard
```

The sync service continuously monitors a Notion database and exports:
- Individual pages as Markdown files
- Consolidated data as CSV files
- An index file for dynamic content loading

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx       # Navigation header
│   │   └── VariablesPanel.jsx # Data filtering panel
│   ├── main.jsx             # React application entry point
|   ├── constants.tx         # Constant variables for easy access
│   ├── web_dashboard.tsx    # Main dashboard component
│   └── index.css            # Global styles
├── public/
│   └── docs/                # CSV and Markdown files (auto-generated)
├── vite.config.js           # Vite configuration with docs index generation
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 7
- **Styling**: Tailwind CSS 3.3
- **Data Processing**: PapaParse for CSV parsing
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Icons**: Lucide React
- **Build Tool**: Vite with Terser minification
- **Development**: ESLint, PostCSS, Autoprefixer

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/santic161/Active-Directory-CheatSheet.git
   cd Active-Directory-CheatSheet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 📊 Data Configuration

The dashboard automatically loads content from the `docs/` directory:

- **CSV Files**: Command databases and tool information
- **Markdown Files**: Detailed documentation and guides

### Supported File Formats

- **CSV**: Command databases with columns for commands, descriptions, categories, etc.
- **Markdown**: Documentation files with `.md` extension
- **JSON**: Index files for dynamic content resolution

## 🔧 Configuration

### Environment Variables

The dashboard supports the following environment variables:

- `CSV_URL`: URL to fetch CSV data from (optional)
- `REFRESH_INTERVAL`: Auto-refresh interval in milliseconds (default: 300000)

### Vite Configuration

The `vite.config.js` includes:

- **Documentation Index Generator**: Automatically creates `index.json` for dynamic content loading
- **Build Optimization**: Code splitting, minification, and asset optimization
- **Development Server**: Hot reloading and file watching

## 🐳 Docker Deployment

### Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The production setup includes:
- Nginx reverse proxy
- Optimized React build
- Static file serving

## 🔄 Content Synchronization

This dashboard works in conjunction with the [Active-Directory-Sync-Service](https://github.com/santic161/Active-Directory-Sync-Service) to automatically update content:

1. **Notion Database**: Contains the source data
2. **Sync Service**: Exports Notion data to Markdown and CSV files
3. **GitHub Repository**: Stores the exported files
4. **Dashboard**: Automatically loads the latest content

### Manual Content Updates

To manually update content:

1. Place CSV files in `docs/`
2. Place Markdown files in `docs/`
3. The dashboard will automatically detect and load new content

## 🎨 Customization

### Styling

The dashboard uses Tailwind CSS for styling. Key customization points:

- **Colors**: Modify `tailwind.config.js` for theme colors
- **Components**: Update component styles in `src/components/`
- **Layout**: Modify the main layout in `src/web_dashboard.tsx`

### Content Structure

To customize the data structure:

1. Update CSV column headers
2. Modify the parsing logic in components
3. Adjust the filtering and search functionality

## 🔒 Security Considerations

- All content is served statically
- No server-side processing of user data
- Content is validated before rendering

## 🚀 Deployment

### GitHub Pages

This repository includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

- **Trigger**: Push to `main` branch
- **Build**: Automated Vite build process
- **Deploy**: Automatic deployment to GitHub Pages
- **Content Updates**: Rebuilds when documentation changes

### Other Platforms

The dashboard can be deployed to any static hosting platform:

- **Vercel**: Connect repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Azure Static Web Apps**: Connect repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all builds pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Active-Directory-Sync-Service](https://github.com/santic161/Active-Directory-Sync-Service) - Automated Notion to GitHub synchronization



## 🏆 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons by [Lucide](https://lucide.dev/)
- CSV parsing by [PapaParse](https://www.papaparse.com/)
- Markdown rendering by [React Markdown](https://github.com/remarkjs/react-markdown)