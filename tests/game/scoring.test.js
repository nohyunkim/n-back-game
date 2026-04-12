import test from "node:test";
import assert from "node:assert/strict";
import {
  applyCorrectInput,
  applyMissPenalty,
  applyWrongInput,
  calculateBaseScore,
  createInitialStats,
} from "../../src/game/scoring.js";

test("calculateBaseScore rewards higher n-back and faster speed", () => {
  assert.equal(calculateBaseScore({ nBack: 2, blockDuration: 2000 }), 40);
  assert.equal(calculateBaseScore({ nBack: 3, blockDuration: 1000 }), 120);
});

test("createInitialStats returns a clean score summary", () => {
  assert.deepEqual(createInitialStats(), {
    correct: 0,
    wrong: 0,
    miss: 0,
    totalReactionTime: 0,
    maxCombo: 0,
  });
});

test("applyCorrectInput increases score, combo, and tracking stats", () => {
  const result = applyCorrectInput({
    score: 100,
    combo: 2,
    stats: createInitialStats(),
    baseScore: 40,
    reactionTime: 650,
  });

  assert.equal(result.score, 144);
  assert.equal(result.combo, 3);
  assert.deepEqual(result.stats, {
    correct: 1,
    wrong: 0,
    miss: 0,
    totalReactionTime: 650,
    maxCombo: 3,
  });
});

test("applyCorrectInput adds the larger combo bonus after five streaks", () => {
  const result = applyCorrectInput({
    score: 200,
    combo: 4,
    stats: {
      correct: 4,
      wrong: 1,
      miss: 1,
      totalReactionTime: 1800,
      maxCombo: 4,
    },
    baseScore: 40,
    reactionTime: 400,
  });

  assert.equal(result.score, 250);
  assert.equal(result.combo, 5);
  assert.equal(result.stats.correct, 5);
  assert.equal(result.stats.totalReactionTime, 2200);
  assert.equal(result.stats.maxCombo, 5);
});

test("applyWrongInput resets combo and applies a half-score penalty", () => {
  const result = applyWrongInput({
    score: 100,
    stats: createInitialStats(),
    baseScore: 40,
  });

  assert.equal(result.score, 80);
  assert.equal(result.combo, 0);
  assert.equal(result.stats.wrong, 1);
});

test("applyMissPenalty resets combo and tracks misses", () => {
  const result = applyMissPenalty({
    score: 100,
    stats: createInitialStats(),
    baseScore: 40,
  });

  assert.equal(result.score, 80);
  assert.equal(result.combo, 0);
  assert.equal(result.stats.miss, 1);
});
