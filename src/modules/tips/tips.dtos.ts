import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsHexadecimal } from 'class-validator';

export class PublishTipDto {
  @ApiModelProperty({ example: 'PREMLEA-JUVMIL-01032019' })
  @IsNotEmpty()
  readonly tipCode: string;

  @ApiModelProperty({
    example: '0aa4cc8991da052f691459813dc790ba13a9b9d1d2dcb39e209d444997489dae',
  })
  @IsNotEmpty()
  @IsHexadecimal()
  readonly tipMetaHash: string;

  @ApiModelProperty({
    enum: ['Basic', 'Premium', 'VIP'],
    type: [String],
    example: ['Basic', 'Premium'],
  })
  readonly recipients: Array<'Basic' | 'Premium' | 'VIP'>;
}
