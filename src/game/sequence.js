import { FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon } from "react-icons/fa";

const ALL_SHAPES = [FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon];
const ALL_COLORS = ["#FF4D4D", "#FFC93C", "#6BCB77", "#4D96FF", "#A020F0", "#FF9A76", "#00E0FF", "#F9F871"];

export const getSymbolCount = (nBack) => Math.min(nBack + 3, ALL_SHAPES.length);

export const generateSequence = ({ totalSteps, nBack, symbolCount = getSymbolCount(nBack) }) => {
  const sequence = [];
  const targetMatchCount = Math.floor((totalSteps - nBack) * 0.3);
  const matchIndices = new Set();

  let consecutiveMatches = 0;
  for (let i = 0; i < targetMatchCount; i += 1) {
    let attempts = 0;

    while (attempts < 100) {
      const randomIndex = Math.floor(Math.random() * (totalSteps - nBack)) + nBack;

      if (!matchIndices.has(randomIndex)) {
        const isPreviousMatch = matchIndices.has(randomIndex - 1);

        if (isPreviousMatch && consecutiveMatches >= 2) {
          attempts += 1;
          continue;
        }

        matchIndices.add(randomIndex);
        consecutiveMatches = isPreviousMatch ? consecutiveMatches + 1 : 1;
        break;
      }

      attempts += 1;
    }
  }

  const activeSymbols = Array.from({ length: symbolCount }, (_, index) => ({
    shape: ALL_SHAPES[index],
    color: ALL_COLORS[index],
  }));

  for (let i = 0; i < totalSteps; i += 1) {
    if (matchIndices.has(i)) {
      sequence.push(sequence[i - nBack]);
      continue;
    }

    let randomSymbol;
    do {
      randomSymbol = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
    } while (i >= nBack && randomSymbol.shape === sequence[i - nBack].shape);

    sequence.push(randomSymbol);
  }

  return { sequence, matchIndices };
};
