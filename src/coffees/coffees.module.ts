import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Flavor } from './entities/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor]), ConfigModule],
  controllers: [CoffeesController],
  providers: [CoffeesService]
})
export class CoffeesModule {}
