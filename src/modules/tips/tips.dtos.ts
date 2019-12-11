import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PublishTipDto {
  @ApiModelProperty({ example: 'PREMLEA-JUVMIL-01032019' })
  @IsNotEmpty()
  readonly tipCode: string;

  @ApiModelProperty({
    example:
      '0x1ea2f89d934cb4a2af0b486736609cf9cb4bdafdc6e946e79aecb02b9d9dceb4',
  })
  @IsNotEmpty()
  readonly tipMetaHash: string;

  @ApiModelProperty({
    enum: ['Basic', 'Premium', 'VIP'],
    type: [String],
    example: ['Basic', 'Premium'],
  })
  readonly recipients: Array<'Basic' | 'Premium' | 'VIP'>;
}
