import { Module } from '@nestjs/common';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { TempOrderController } from './pre.order.controller';

@Module({
  controllers: [
    TempOrderController,
  ],
  providers: [
    CompressionService,
    DecompressionService,
  ]
})
export class PreOrderModule {}
