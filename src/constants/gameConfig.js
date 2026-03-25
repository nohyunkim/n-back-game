export const GAME_LIMITS = {
  nBack: { min: 1, max: 5, step: 1 },
  totalSteps: { min: 10, max: 50, step: 10 },
  speed: { min: 1, max: 4, step: 0.5 },
};

export const DEFAULT_GAME_CONFIG = {
  nBack: 2,
  totalSteps: 20,
  speed: 2,
};

const isWithinRange = (value, { min, max }) => value >= min && value <= max;

const isStepAligned = (value, { min, step }) => {
  const distance = (value - min) / step;
  return Number.isInteger(Math.round(distance)) && Math.abs(distance - Math.round(distance)) < 1e-9;
};

export const createGameConfig = ({ nBack, totalSteps, speed }) => ({
  nBack,
  totalSteps,
  blockDuration: Math.round(speed * 1000),
});

export const isValidGameConfig = (config) => {
  if (!config || typeof config !== "object") {
    return false;
  }

  const { nBack, totalSteps, blockDuration } = config;

  return (
    Number.isInteger(nBack) &&
    isWithinRange(nBack, GAME_LIMITS.nBack) &&
    Number.isInteger(totalSteps) &&
    isWithinRange(totalSteps, GAME_LIMITS.totalSteps) &&
    isStepAligned(totalSteps, GAME_LIMITS.totalSteps) &&
    Number.isFinite(blockDuration) &&
    blockDuration >= GAME_LIMITS.speed.min * 1000 &&
    blockDuration <= GAME_LIMITS.speed.max * 1000
  );
};
