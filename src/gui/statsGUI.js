import Stats from 'stats.js';

export function createStatsGUI() {
  const stats = new Stats()
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '0px'
  stats.dom.style.top = '0px'
  return stats;
}