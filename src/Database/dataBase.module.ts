import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb+srv://aurabilanox:04QmfgyrOMojJNcz@cluster0.1yf5r.mongodb.net/moride?retryWrites=true&w=majority&appName=Cluster0',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
