const STORAGE_KEYS = {
  SCORES: 'canBossRpg.scores',
};

function getScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES)) || [];
  } catch (e) {
    return [];
  }
}

function saveScore(name, level, coins) {
  const scores = getScores();
  const idx = scores.findIndex(s => s.name === name);
  const isBetter = idx < 0
    || level > scores[idx].level
    || (level === scores[idx].level && coins > scores[idx].coins);

  if (isBetter) {
    const entry = { name, level, coins };
    if (idx >= 0) scores[idx] = entry;
    else scores.push(entry);
  }

  scores.sort((a, b) => b.level - a.level || b.coins - a.coins);
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores.slice(0, CONFIG.LEADERBOARD_MAX)));
}
