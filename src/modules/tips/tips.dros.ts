import { ApiModelProperty } from '@nestjs/swagger';

export class TipPublishedSuccessfullyDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly tipId: number;
}

export class AuthorizationError {
  @ApiModelProperty()
  readonly error: boolean = true;

  @ApiModelProperty()
  readonly code: number = 401;

  @ApiModelProperty()
  readonly message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export class PayloadError {
  @ApiModelProperty()
  readonly error: boolean = true;

  @ApiModelProperty()
  readonly code: number = 400;

  @ApiModelProperty()
  readonly message: string;
  constructor(message: string) {
    this.message = message;
  }
}
