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

function saveScore(name, level, coins, maxHp, inventory) {
  const scores = getScores();
  const idx = scores.findIndex(s => s.name === name);
  const entry = {
    name,
    level,
    coins,
    maxHp: maxHp || CONFIG.PLAYER_HP,
    inventory: inventory || { hints: 0, extraHp: 0 },
  };

  if (idx >= 0) {
    scores[idx] = entry;
  } else {
    scores.push(entry);
  }

  scores.sort((a, b) => b.level - a.level || b.coins - a.coins);
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores.slice(0, CONFIG.LEADERBOARD_MAX)));
}
