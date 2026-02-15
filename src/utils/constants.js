export const projects = [
  {
    id: 1,
    title: 'TradeX - Stock Trading Simulator',
    description: 'Real-time paper trading platform with live WebSocket data from Finnhub API, portfolio tracking, and global leaderboard.',
    image: '/projects/tradex.png',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Socket.io'],
    github: 'https://github.com/JaydenKnittle/stock-trading-simulator',
    demo: null,
    highlights: [
      'Live stock prices via WebSocket',
      'Real-time portfolio tracking',
      'Global leaderboard system',
      '$10,000 starting balance',
    ],
  },
  {
    id: 2,
    title: 'NexBank - Digital Banking Platform',
    description: 'Full-stack banking system with virtual cards, QR payments, standing orders, and comprehensive admin dashboard.',
    image: '/projects/nexbank.png',
    tags: ['React', 'Node.js', 'PostgreSQL', 'JWT', 'Cron Jobs'],
    github: 'https://github.com/JaydenKnittle/digital-banking-platform',
    demo: null,
    highlights: [
      'Virtual card payments with QR codes',
      'Automated standing orders',
      'Role-based access control',
      'Real-time transactions',
    ],
  },
  {
    id: 3,
    title: 'CollabBoard - Real-Time Whiteboard',
    description: 'Collaborative whiteboard with live drawing, cursor tracking, sticky notes, and multi-user synchronization.',
    image: '/projects/collabboard.png',
    tags: ['React', 'Node.js', 'Socket.io', 'Canvas API', 'WebSocket'],
    github: 'https://github.com/JaydenKnittle/collab-whiteboard',
    demo: null,
    highlights: [
      'Real-time collaborative drawing',
      'Live cursor tracking',
      'Sticky notes system',
      'Room-based collaboration',
    ],
  },
  {
    id: 4,
    title: 'Nexus - Gaming Tournament Platform',
    description: 'Tournament management platform for Namibia\'s gaming community with real-time scoring and leaderboards.',
    image: '/projects/nexus.png',
    tags: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Android'],
    github: 'https://github.com/JaydenKnittle/Nexus',
    demo: null,
    highlights: [
      'Multiple tournament formats',
      'Real-time scoring system',
      'Player statistics tracking',
      'Firebase real-time database',
    ],
  },
];

export const skills = {
  languages: ['JavaScript', 'TypeScript', 'Kotlin', 'Python', 'Java', 'C++'],
  frontend: ['React', 'Tailwind CSS', 'Jetpack Compose', 'HTML/CSS', 'Framer Motion'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'Firebase', 'RESTful APIs'],
  tools: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Postman', 'Figma'],
  realtime: ['WebSocket', 'Socket.io', 'Real-time Sync', 'Live Updates'],
  other: ['JWT Auth', 'Cron Jobs', 'API Integration', 'Database Design'],
};

export const games = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with modern twist',
    icon: '🐍',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: '2048',
    title: '2048',
    description: 'Addictive number puzzle game',
    icon: '🎯',
    color: 'from-yellow-400 to-orange-600',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory skills',
    icon: '🧠',
    color: 'from-purple-400 to-pink-600',
  },
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    description: 'Play against unbeatable AI',
    icon: '⭕',
    color: 'from-blue-400 to-cyan-600',
  },
];