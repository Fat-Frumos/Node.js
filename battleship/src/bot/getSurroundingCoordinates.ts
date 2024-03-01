type CoordinationType = number[];

export const getSurroundingCoordinates = (shipCoordinates: CoordinationType[]) => {
  const surrounding: Set<string> = new Set();

  shipCoordinates.forEach((type) => {
    const [x, y] = type;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = x + dx;
        const newY = y + dy;

        if (dx === 0 && dy === 0) continue;

        surrounding.add(`${newX},${newY}`);
      }
    }
  });

  shipCoordinates.forEach((type) => {
    const str = type.join(',');
    surrounding.delete(str);
  });

  return Array.from(surrounding).map((str) => str.split(',').map(Number));
};
