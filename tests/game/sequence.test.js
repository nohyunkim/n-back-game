import test from "node:test";
import assert from "node:assert/strict";
import { generateSequence, getSymbolCount } from "../../src/game/sequence.js";

test("getSymbolCount scales with n-back and respects the available symbol cap", () => {
  assert.equal(getSymbolCount(1), 4);
  assert.equal(getSymbolCount(5), 8);
  assert.equal(getSymbolCount(10), 8);
});

test("generateSequence returns the requested number of blocks and match indices", () => {
  const { sequence, matchIndices } = generateSequence({ totalSteps: 20, nBack: 2 });

  assert.equal(sequence.length, 20);
  assert.equal(matchIndices.size, Math.floor((20 - 2) * 0.3));
});

test("generateSequence copies symbols for match steps and avoids accidental non-match repeats", () => {
  const { sequence, matchIndices } = generateSequence({ totalSteps: 30, nBack: 3 });

  for (let index = 0; index < sequence.length; index += 1) {
    assert.ok(sequence[index]);

    if (index < 3) {
      continue;
    }

    if (matchIndices.has(index)) {
      assert.equal(sequence[index], sequence[index - 3]);
      continue;
    }

    assert.notEqual(sequence[index].shape, sequence[index - 3].shape);
  }
});

test("generateSequence avoids triple-match streaks", () => {
  const { matchIndices } = generateSequence({ totalSteps: 40, nBack: 2 });
  const matchList = [...matchIndices].sort((left, right) => left - right);

  for (let index = 0; index <= matchList.length - 3; index += 1) {
    const first = matchList[index];
    const second = matchList[index + 1];
    const third = matchList[index + 2];
    const isTripleStreak = second === first + 1 && third === second + 1;

    assert.equal(isTripleStreak, false);
  }
});
