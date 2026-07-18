setTimeout(() => {
  throw new Error('boom');
});

describe('suite', () => {
  it('should pass', () => {});
});