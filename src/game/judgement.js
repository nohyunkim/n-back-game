export const isEarlyStep = ({ currentStep, nBack }) => currentStep <= nBack;

export const didMissMatch = ({ stepIndex, matchIndices, hasAnswered }) =>
  stepIndex > 0 && matchIndices.has(stepIndex - 1) && !hasAnswered;

export const isMatchingStep = ({ currentStep, matchIndices }) => matchIndices.has(currentStep - 1);
