export class MaxNumberCheckInsError extends Error {
  constructor() {
    super('User already checked in today');
  }
}
