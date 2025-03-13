import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        console.log('Connecting to MongoDB at URL:', databaseUrl); 
        return {
          uri: databaseUrl,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
