# ActivityWatch Multi-Host Dashboard

A professional, enterprise-grade dashboard for ActivityWatch that organizes multiple hosts into groups with comprehensive monitoring and analytics.

## Features

### 🏢 Host Group Management
- Create, edit, and delete host groups with custom names and descriptions
- Drag-and-drop interface to assign hosts to groups
- Visual group cards with summary statistics
- Color-coded group identification system
- Search and filter functionality for groups and hosts

### 📊 Time Tracking Analytics
- **Working Hours Calculation**: Daily, weekly, monthly working time per group
- **Active vs Idle Time**: Breakdown of productive and non-productive time
- **Peak Productivity Hours**: Analysis of when teams are most productive
- **Overtime Tracking**: Alerts for excessive working hours
- **Downtime Monitoring**: System downtime tracking and availability metrics

### 🖥️ Individual Host Monitoring
- **Real-time Status**: Live activity indicators for each host
- **Application Usage**: Detailed breakdowns with time spent per application
- **Website Tracking**: URL monitoring with productivity categorization
- **Activity Heatmaps**: Visual representation of activity patterns
- **AFK Analysis**: Away From Keyboard time tracking

### 📈 Professional Chart Visualizations
- **Line Charts**: Time-based activity trends and productivity over time
- **Bar Charts**: Application usage comparison and activity summaries
- **Doughnut Charts**: Time distribution by categories (work/personal/idle)
- **Heatmap Charts**: Activity intensity across hours and days
- **Gauge Charts**: Real-time productivity scores and system health
- **Stacked Area Charts**: Combined group activity visualization

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Material-UI Components**: Professional, accessible interface
- **Real-time Updates**: WebSocket connections for live data
- **Error Handling**: Comprehensive error boundaries and retry mechanisms

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Chart.js 4** with react-chartjs-2 for visualizations
- **Material-UI 5** for modern, accessible components
- **React Router 6** for navigation
- **Zustand** for state management
- **React Beautiful DnD** for drag-and-drop functionality
- **Framer Motion** for animations
- **React Query** for data fetching and caching

### Backend Integration
- **FastAPI** REST endpoints for ActivityWatch data
- **PostgreSQL** for data storage and analytics
- **WebSocket** connections for real-time updates
- **Redis** for caching and performance optimization

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- ActivityWatch server running on port 5600
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── charts/         # Chart components (Line, Bar, Doughnut, etc.)
│   │   ├── common/         # Common components (ErrorBoundary, etc.)
│   │   ├── groups/         # Host group management components
│   │   └── layout/         # Layout components (Sidebar, TopBar, etc.)
│   ├── pages/              # Page components
│   ├── services/           # API and WebSocket services
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5600
VITE_WS_URL=ws://localhost:5600
VITE_APP_TITLE=ActivityWatch Dashboard
```

### API Endpoints
The dashboard expects the following API endpoints:

- `GET /api/hosts` - Get all hosts
- `GET /api/groups` - Get all host groups
- `GET /api/hosts/{id}/metrics` - Get host metrics
- `GET /api/groups/{id}/analytics` - Get group analytics
- `WebSocket /ws` - Real-time updates

## Usage

### Creating Host Groups
1. Navigate to the Groups page
2. Click "Create Group"
3. Fill in group details (name, description, color)
4. Select hosts to include in the group
5. Configure working hours and productivity categories

### Viewing Analytics
1. Select a group from the sidebar or dashboard
2. View real-time metrics and charts
3. Use time range selectors to analyze different periods
4. Export data in various formats (CSV, Excel, PDF)

### Monitoring Individual Hosts
1. Click on any host in the sidebar or group view
2. View detailed host information and real-time status
3. Analyze application usage and website activity
4. Review activity heatmaps and productivity trends

## Customization

### Adding New Chart Types
1. Create a new component in `src/components/charts/`
2. Extend the `BaseChart` component
3. Add the new chart type to the exports in `src/components/charts/index.ts`
4. Update the `ChartConfig` type in `src/types/index.ts`

### Custom Themes
Modify the theme configuration in `src/App.tsx`:

```typescript
const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#your-color',
    },
    // ... other theme options
  },
});
```

## Performance Optimization

The dashboard includes several performance optimizations:

- **Lazy Loading**: Components are loaded on demand
- **Virtual Scrolling**: For large lists of hosts and groups
- **Data Caching**: React Query for efficient data management
- **Memoization**: React.memo and useMemo for expensive calculations
- **Code Splitting**: Automatic code splitting with Vite

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the ActivityWatch documentation
- Join the ActivityWatch community discussions

## Roadmap

- [ ] Advanced alerting system with custom rules
- [ ] Team collaboration features
- [ ] Mobile app companion
- [ ] Advanced reporting and exports
- [ ] Integration with popular project management tools
- [ ] Machine learning insights and recommendations
