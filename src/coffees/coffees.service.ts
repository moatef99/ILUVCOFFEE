import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './coffeeDto/create-coffee.dto';
import { UpdateCoffeeDto } from './coffeeDto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>
  ) {}

  findAll() {
    return this.coffeeRepository.find({
      relations: ['flavors']
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors']
    });
    if (!coffee) {
      throw new NotFoundException(`coffee with id = ${id} is not found`);
    }
    return coffee;
  }

  async createCoffee(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preLoadCoffeeByName(name))
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors
    });

    return this.coffeeRepository.save(coffee);
  }

  async updateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preLoadCoffeeByName(name))
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors
    });

    if (!coffee)
      throw new NotFoundException(`coffee with id = ${id} is not found`);

    return this.coffeeRepository.save(coffee);
  }

  async removeCoffee(id: string) {
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preLoadCoffeeByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) return existingFlavor;

    return this.flavorRepository.create({ name });
  }
}
