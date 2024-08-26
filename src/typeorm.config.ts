import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { PreOrder } from "./pre/entities/pre-order.entity";
import { Line } from "./line/entities/order-line.entity";






export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: "postgres",
      host: configService.get("DB_HOST", "database"),
      port: parseInt(configService.get("DB_PORT", "5432")),
      username: configService.get("DB_USERNAME", "postgres"),
      password: configService.get("DB_PASSWORD", "vardast@1234"),
      database: configService.get("DB_NAME", "v2"),
      synchronize: configService.get("DB_SYNC", "true") === "true",
      logging: configService.get("DB_QUERY_LOG", "true") === "true",
      entities: [
       PreOrder,
       Line
      
      ],
    };
  },
};
