export class InvalidStateForCancellationError extends Error {
  constructor() {
    super('Only order in NEW state can de cancelled.');
  }
}
