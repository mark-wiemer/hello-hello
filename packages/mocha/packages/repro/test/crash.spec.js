describe('crash', () => {
  it('passes before death', () => {});
  after(() => process.exit(1));
});