export const createInitialStats = () => ({
  correct: 0,
  wrong: 0,
  miss: 0,
  totalReactionTime: 0,
  maxCombo: 0,
});

export const calculateBaseScore = ({ nBack, blockDuration }) => {
  const speedMultiplier = 4000 / blockDuration;
  return Math.round(10 * nBack * speedMultiplier);
};

export const applyMissPenalty = ({ score, stats, baseScore }) => ({
  score: score - Math.round(baseScore / 2),
  combo: 0,
  stats: {
    ...stats,
    miss: stats.miss + 1,
  },
});

export const applyWrongInput = ({ score, stats, baseScore }) => ({
  score: score - Math.round(baseScore / 2),
  combo: 0,
  stats: {
    ...stats,
    wrong: stats.wrong + 1,
  },
});

export const applyCorrectInput = ({ score, combo, stats, baseScore, reactionTime }) => {
  const nextCombo = combo + 1;
  const bonus = nextCombo >= 5 ? baseScore * 0.25 : nextCombo >= 3 ? baseScore * 0.1 : 0;

  return {
    score: score + baseScore + Math.round(bonus),
    combo: nextCombo,
    stats: {
      ...stats,
      correct: stats.correct + 1,
      totalReactionTime: stats.totalReactionTime + reactionTime,
      maxCombo: Math.max(stats.maxCombo, nextCombo),
    },
  };
};
