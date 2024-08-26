import { Module } from '@nestjs/common';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { LineController } from './line.order.controller';

@Module({
  controllers: [
    LineController,

  ],
  providers: [
    CompressionService,
    DecompressionService,
  ]
})
export class LineOrderModule {}
