import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './modules/teams/teams.module';
import { BuoysModule } from './modules/buoys/buoys.module';
import { InspectorsModule } from './modules/inspectors/inspectors.module';
import { FishModule } from './modules/fish/fish.module';
import { LaunchesModule } from './modules/launches/launches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TeamsModule,
    BuoysModule,
    InspectorsModule,
    FishModule,
    LaunchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
