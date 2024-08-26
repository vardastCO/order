// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { typeOrmAsyncConfig } from './typeorm.config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RabbitMQController } from './rabbitmq.controller';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PreOrderModule } from './pre/pre.order.module';
import { LineOrderModule } from './line/line.order.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    PreOrderModule,
    CronModule,
    LineOrderModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RabbitMQController],
})
export class RabbitMQModules {}
