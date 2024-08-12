// Define the function directly in the test file
function calculateSelectedOption(rotationDegree, optionsLength) {
  const totalSlots = optionsLength === 2 ? 4 : optionsLength;
  const degreePerSlot = 360 / totalSlots;
  const selectedIndex =
    Math.abs(Math.round(rotationDegree / degreePerSlot)) % totalSlots;

  return selectedIndex % optionsLength;
}

describe('DecisionWheel Randomness Core Logic', () => {
  const spins = 1000;
  const tolerance = 0.5; // Adjust as needed

  const testRandomnessForOptions = (options) => {
    const outcomes = {};
    options.forEach((option) => {
      outcomes[option] = 0;
    });

    for (let i = 0; i < spins; i++) {
      const rotationDegree = Math.random() * 360;
      const selectedIndex = calculateSelectedOption(
        rotationDegree,
        options.length,
      );
      outcomes[options[selectedIndex]]++;
    }

    const expectedCount = spins / options.length;
    Object.values(outcomes).forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(
        expectedCount - expectedCount * tolerance,
      );
      expect(count).toBeLessThanOrEqual(
        expectedCount + expectedCount * tolerance,
      );
    });
  };

  it('should ensure true randomness for 2 options', () => {
    testRandomnessForOptions(['Option 1', 'Option 2']);
  });

  it('should ensure true randomness for 3 options', () => {
    testRandomnessForOptions(['Option 1', 'Option 2', 'Option 3']);
  });

  it('should ensure true randomness for 4 options', () => {
    testRandomnessForOptions(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  });

  it('should ensure true randomness for 5 options', () => {
    testRandomnessForOptions([
      'Option 1',
      'Option 2',
      'Option 3',
      'Option 4',
      'Option 5',
    ]);
  });

  it('should ensure true randomness for 6 options', () => {
    testRandomnessForOptions([
      'Option 1',
      'Option 2',
      'Option 3',
      'Option 4',
      'Option 5',
      'Option 6',
    ]);
  });
});
