import { FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon } from "react-icons/fa";

const ALL_SHAPES = [FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon];
const ALL_COLORS = ["#FF4D4D", "#FFC93C", "#6BCB77", "#4D96FF", "#A020F0", "#FF9A76", "#00E0FF", "#F9F871"];

export const getSymbolCount = (nBack) => Math.min(nBack + 3, ALL_SHAPES.length);

const shuffle = (items) => {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]];
  }

  return nextItems;
};

const createsTripleMatch = (index, matchIndices) =>
  (matchIndices.has(index - 1) && matchIndices.has(index - 2)) ||
  (matchIndices.has(index - 1) && matchIndices.has(index + 1)) ||
  (matchIndices.has(index + 1) && matchIndices.has(index + 2));

export const generateSequence = ({ totalSteps, nBack, symbolCount = getSymbolCount(nBack) }) => {
  const sequence = [];
  const targetMatchCount = Math.floor((totalSteps - nBack) * 0.3);
  const matchIndices = new Set();
  const candidateIndices = shuffle(Array.from({ length: totalSteps - nBack }, (_, index) => index + nBack));

  for (const candidateIndex of candidateIndices) {
    if (matchIndices.size >= targetMatchCount) {
      break;
    }

    if (createsTripleMatch(candidateIndex, matchIndices)) {
      continue;
    }

    matchIndices.add(candidateIndex);
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
