import { ApiModelProperty } from '@nestjs/swagger';

export class PublishTipHeaders {
  @ApiModelProperty({ required: false })
  readonly signature: string;

  @ApiModelProperty({ required: false })
  readonly caller: string;
}
