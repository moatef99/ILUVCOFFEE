import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService){

    }

    @Get()
    findAll(@Res({ passthrough: true }) response : Response){
       return this.coffeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id : string){
       return this.coffeeService.findOne(id);
    }

    @Post()
    createCoffee(@Body() createCoffeeDto: CreateCoffeeDto){
       console.log(createCoffeeDto instanceof CreateCoffeeDto)
       this.coffeeService.createCoffee(createCoffeeDto);
    }

    @Patch(':id')
    updateCoffee(@Param('id') id : string, @Body() updateCoffeeDto: UpdateCoffeeDto){
      return this.coffeeService.updateCoffee(id, updateCoffeeDto);
    }

    @Delete(':id')
    removeCoffee(@Param('id') id : string){
       return this.coffeeService.removeCoffee(id);
    }
}
