import { Injectable } from '@nestjs/common';
import { Cron ,CronExpression } from '@nestjs/schedule'
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class CronService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource)
     { }


    
    
}
