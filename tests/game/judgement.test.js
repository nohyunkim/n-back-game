import test from "node:test";
import assert from "node:assert/strict";
import { didMissMatch, isEarlyStep, isMatchingStep } from "../../src/game/judgement.js";

test("isEarlyStep returns true until the player has enough history", () => {
  assert.equal(isEarlyStep({ currentStep: 1, nBack: 2 }), true);
  assert.equal(isEarlyStep({ currentStep: 2, nBack: 2 }), true);
  assert.equal(isEarlyStep({ currentStep: 3, nBack: 2 }), false);
});

test("didMissMatch only flags unanswered matching steps", () => {
  const matchIndices = new Set([2, 5]);

  assert.equal(didMissMatch({ stepIndex: 3, matchIndices, hasAnswered: false }), true);
  assert.equal(didMissMatch({ stepIndex: 3, matchIndices, hasAnswered: true }), false);
  assert.equal(didMissMatch({ stepIndex: 4, matchIndices, hasAnswered: false }), false);
  assert.equal(didMissMatch({ stepIndex: 0, matchIndices, hasAnswered: false }), false);
});

test("isMatchingStep maps the displayed step number to the zero-based match index", () => {
  const matchIndices = new Set([1, 4]);

  assert.equal(isMatchingStep({ currentStep: 2, matchIndices }), true);
  assert.equal(isMatchingStep({ currentStep: 5, matchIndices }), true);
  assert.equal(isMatchingStep({ currentStep: 3, matchIndices }), false);
});
