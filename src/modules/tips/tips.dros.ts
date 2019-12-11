import { ApiModelProperty } from '@nestjs/swagger';

export class TipPublishedSuccessfullyDro {
  @ApiModelProperty({ example: false })
  readonly error: boolean;

  @ApiModelProperty({ example: 87 })
  readonly tipId: number;

  @ApiModelProperty({
    example:
      '0x734b20ef96eda3aa471949421c2f2e5ea4c196cc439b6c5fca64e98b0e32de6f',
  })
  readonly txHash: string;
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
