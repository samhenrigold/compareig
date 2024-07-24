export class InstagramDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstagramDataError';
  }
}  