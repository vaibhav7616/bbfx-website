export const FEATURES = [
  {
    id: 1,
    title: 'Multi-Timeframe AI Engine',
    description: 'Automatically aligns higher timeframe trends with your execution chart for institutional-grade confluence.',
    icon: 'Layers',
    accent: 'gold' as const,
  },
  {
    id: 2,
    title: 'Confidence Scoring System',
    description: 'Generates trade quality scores from 1–10 so you only take setups that meet your edge threshold.',
    icon: 'Gauge',
    accent: 'neon' as const,
  },
  {
    id: 3,
    title: 'Andean Oscillator Intelligence',
    description: 'Advanced momentum and trend confirmation engine tuned for precision entries across market regimes.',
    icon: 'Activity',
    accent: 'signal' as const,
  },
  {
    id: 4,
    title: 'Currency Strength Matrix',
    description: 'Real-time institutional strength analysis across major pairs to filter weak directional bias.',
    icon: 'Grid3x3',
    accent: 'gold' as const,
  },
  {
    id: 5,
    title: 'BB + RSI Reversal Engine',
    description: 'Detects high-probability reversals using Bollinger Band exhaustion combined with RSI divergence logic.',
    icon: 'RefreshCcw',
    accent: 'neon' as const,
  },
  {
    id: 6,
    title: 'Automatic Risk Management',
    description: 'Dynamic Stop Loss and multi-tier Take Profit levels (TP1, TP2, TP3) calculated for every signal.',
    icon: 'Shield',
    accent: 'signal' as const,
  },
  {
    id: 7,
    title: 'Market Regime Detection',
    description: 'Identifies trending, ranging, reversal, and high-volatility markets before you commit capital.',
    icon: 'Radar',
    accent: 'gold' as const,
  },
  {
    id: 8,
    title: 'Elite BlackBox Dashboard',
    description: 'Premium trading terminal directly on your chart — signals, scores, strength meters, and levels in one view.',
    icon: 'MonitorSmartphone',
    accent: 'neon' as const,
  },
];

export const METRICS = [
  { label: 'Multi-Timeframe Analysis', value: 'MTF+', color: 'gold' },
  { label: 'AI Confidence Score', value: '1–10', color: 'neon' },
  { label: 'Smart Entry & Exit Levels', value: 'AUTO', color: 'signal' },
  { label: 'Institutional Trend Detection', value: 'LIVE', color: 'gold' },
];

export const STEPS = [
  {
    step: '01',
    title: 'Market Analysis',
    description: 'BlackBoxFX scans multi-timeframe structure, volatility, and institutional flow to classify the current market regime.',
  },
  {
    step: '02',
    title: 'AI Confirmation Engine',
    description: 'Multiple confirmation layers converge — confidence score, oscillator intelligence, and strength matrix validate the setup.',
  },
  {
    step: '03',
    title: 'Trade Execution',
    description: 'Receive precise Entry, Stop Loss, and TP1–TP3 levels mapped on-chart so you execute with institutional discipline.',
  },
];

export const PERFORMANCE = [
  { label: 'Institutional Grade Analysis', value: '100%', sub: 'Multi-layer confluence' },
  { label: 'AI Confidence Engine', value: '1–10', sub: 'Trade quality scoring' },
  { label: 'Real-Time Alerts', value: '<1s', sub: 'Signal latency' },
  { label: 'Multi Asset Support', value: '5+', sub: 'Market classes' },
  { label: 'Advanced Risk Control', value: 'TP×3', sub: 'Dynamic SL & targets' },
  { label: 'Premium Dashboard', value: 'HUD', sub: 'On-chart terminal' },
];

export const MARKETS = [
  { name: 'Forex', desc: 'Majors, minors & crosses', icon: 'DollarSign' },
  { name: 'Gold', desc: 'XAUUSD precision setups', icon: 'Coins' },
  { name: 'Crypto', desc: 'BTC, ETH & alts', icon: 'Bitcoin' },
  { name: 'Stocks', desc: 'Equities & mega-caps', icon: 'TrendingUp' },
  { name: 'Indices', desc: 'US30, NAS100, SPX', icon: 'BarChart3' },
];

export const TESTIMONIALS = [
  {
    quote: 'BlackBoxFX completely changed my trading approach. The confidence score keeps me out of low-quality noise.',
    name: 'Arjun Mehta',
    role: 'Intraday Trader · Mumbai',
    rating: 5,
  },
  {
    quote: 'Best institutional-style indicator I\'ve used. The multi-timeframe engine feels like having a research team on chart.',
    name: 'Priya Sharma',
    role: 'FX & Gold Trader · Delhi',
    rating: 5,
  },
  {
    quote: 'The confidence score alone is worth the investment. Clear entries, structured risk, zero guesswork.',
    name: 'Rahul Iyer',
    role: 'Crypto Trader · Bengaluru',
    rating: 5,
  },
];

export const FAQS = [
  {
    q: 'Does it repaint?',
    a: 'No. BlackBoxFX v3.0 is engineered as a non-repainting system. Signals and levels lock once confirmed so historical analysis remains trustworthy.',
  },
  {
    q: 'Which markets are supported?',
    a: 'Forex, Gold (XAUUSD), Crypto, Stocks, and Indices. The multi-confirmation engine adapts across liquid instruments on TradingView.',
  },
  {
    q: 'Which timeframes work best?',
    a: 'Optimized for M15–H4 execution with higher-timeframe bias from H4–D1. Scalpers and swing traders both benefit from the MTF AI engine.',
  },
  {
    q: 'Is TradingView required?',
    a: 'Yes. BlackBoxFX v3.0 is a premium TradingView indicator. A TradingView account (free or paid) is required to run the script on your charts.',
  },
  {
    q: 'How are updates delivered?',
    a: 'Active subscribers receive free updates during their plan. Improvements are pushed to your TradingView invite-only script automatically while your subscription is active.',
  },
  {
    q: 'What are the pricing plans?',
    a: 'Monthly access is ₹99/month. Yearly access is ₹999/year — best value if you trade consistently. Both plans include the full BlackBoxFX v3.0 Professional indicator.',
  },
];

export const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    badge: 'Flexible',
    price: '99',
    period: 'month',
    note: '',
    description: 'Full BlackBoxFX v3.0 access billed every month. Perfect to start and test on your desk.',
    cta: 'Start Monthly — ₹99',
    featured: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    badge: 'Recommended',
    price: '999',
    period: 'year',
    note: 'Save vs paying monthly all year',
    description: 'Best value for serious traders. Full year of BlackBoxFX v3.0 with priority updates.',
    cta: 'Go Yearly — ₹999',
    featured: true,
  },
];

export const PRICING_FEATURES = [
  'Full BlackBoxFX v3.0 access',
  'Free updates during plan',
  'Installation guide',
  'TradingView support',
  'Premium community access',
  'Multi-asset compatibility',
  'On-chart Elite Dashboard',
  'Smart alerts & risk levels',
];
