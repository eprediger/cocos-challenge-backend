import { BadRequestException } from "@nestjs/common";

export class InvalidStateForCancellationError extends BadRequestException {
  constructor() {
    super('Only orders in NEW state can de cancelled.');
  }
}
