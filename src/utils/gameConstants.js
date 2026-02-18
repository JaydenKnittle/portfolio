export const projects = [
  {
    id: 1,
    title: 'TRADEX',
    subtitle: 'Stock Trading Simulator',
    description: 'Real-time paper trading platform with live WebSocket market data from Finnhub API.',
    icon: '📈',
    tags: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
    github: 'https://github.com/JaydenKnittle/stock-trading-simulator',
    features: [
      'Live stock prices via WebSocket',
      'Real-time portfolio tracking',
      'Global leaderboard system',
      '$10,000 starting balance'
    ]
  },
  {
    id: 2,
    title: 'NEXBANK',
    subtitle: 'Digital Banking Platform',
    description: 'Full-stack banking system with virtual cards, QR payments, and automated transactions.',
    icon: '🏦',
    tags: ['React', 'Node.js', 'PostgreSQL', 'JWT'],
    github: 'https://github.com/JaydenKnittle/digital-banking-platform',
    features: [
      'Virtual card payments with QR',
      'Automated standing orders',
      'Role-based access control',
      'Real-time transactions'
    ]
  },
  {
    id: 3,
    title: 'COLLABBOARD',
    subtitle: 'Real-Time Whiteboard',
    description: 'Collaborative whiteboard with live drawing, cursor tracking, and multi-user sync.',
    icon: '🎨',
    tags: ['React', 'Socket.io', 'Canvas API', 'Node.js'],
    github: 'https://github.com/JaydenKnittle/collab-whiteboard',
    features: [
      'Real-time collaborative drawing',
      'Live cursor tracking',
      'Sticky notes system',
      'Room-based collaboration'
    ]
  },
  {
    id: 4,
    title: 'NEXUS',
    subtitle: 'Gaming Tournament Platform',
    description: 'Tournament management for Namibia\'s gaming community with real-time scoring.',
    icon: '🎮',
    tags: ['Kotlin', 'Firebase', 'Jetpack Compose'],
    github: 'https://github.com/JaydenKnittle/Nexus',
    features: [
      'Multiple tournament formats',
      'Real-time scoring system',
      'Player statistics tracking',
      'Firebase integration'
    ]
  }
];

export const skills = {
  languages: [
    { name: 'JavaScript', level: 90, icon: '⚡' },
    { name: 'TypeScript', level: 80, icon: '📘' },
    { name: 'Python', level: 75, icon: '🐍' },
    { name: 'Java', level: 70, icon: '☕' },
    { name: 'C#', level: 65, icon: '🎯' },
    { name: 'Kotlin', level: 85, icon: '🔷' }
  ],
  frontend: [
    { name: 'React', level: 90, icon: '⚛️' },
    { name: 'Tailwind CSS', level: 95, icon: '🎨' },
    { name: 'Jetpack Compose', level: 80, icon: '📱' },
    { name: 'Framer Motion', level: 85, icon: '✨' }
  ],
  backend: [
    { name: 'Node.js', level: 90, icon: '🟢' },
    { name: 'Express', level: 85, icon: '🚂' },
    { name: 'PostgreSQL', level: 85, icon: '🐘' },
    { name: 'Firebase', level: 80, icon: '🔥' }
  ],
  realtime: [
    { name: 'WebSocket', level: 90, icon: '🔌' },
    { name: 'Socket.io', level: 90, icon: '⚡' },
    { name: 'Real-time Sync', level: 85, icon: '🔄' }
  ],
  tools: [
    { name: 'Git', level: 90, icon: '📦' },
    { name: 'GitHub', level: 90, icon: '🐙' },
    { name: 'VS Code', level: 95, icon: '💻' },
    { name: 'Figma', level: 70, icon: '🎨' }
  ]
};

export const games = [
  {
    id: 'marble-run',
    title: 'MARBLE RUN',
    description: 'Tilt and roll through neon platforms',
    icon: '🔮',
    color: 'from-blue-500 to-cyan-600',
    difficulty: 'EASY',
  },
  {
    id: 'asteroid-dodge',
    title: 'ASTEROID DODGE',
    description: 'Survive the asteroid field',
    icon: '🚀',
    color: 'from-red-500 to-orange-600',
    difficulty: 'MEDIUM',
  },
  {
    id: 'memory-3d',
    title: 'MEMORY 3D',
    description: 'Match pairs in 3D space',
    icon: '🧠',
    color: 'from-purple-500 to-pink-600',
    difficulty: 'EASY',
  },
  {
    id: 'orbit-catch',
    title: 'ORBIT CATCH',
    description: 'Catch orbiting objects',
    icon: '🌀',
    color: 'from-yellow-500 to-amber-600',
    difficulty: 'HARD',
  },
];