import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from 'src/entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
     {
       id: 1,
       name: 'test',
       brand: 'homs',
       flavor: ['choco', 'bono']
     },
    ];

    findAll(){
        return this.coffees;
    }

    findOne(id: string){
        const coffee = this.coffees.find(item => item.id === +id);
        if(!coffee){
            throw new NotFoundException(`coffee with id = ${id} is not found`);
        }
        return coffee;
    }

    createCoffee(createCoffeeDto: any){
        this.coffees.push(createCoffeeDto);
    }

    updateCoffee(id: string, updateCoffeeDto: any){
      const existingCoffee = this.findOne(id);
    
    }
    removeCoffee(id: string){
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        this.coffees.splice(coffeeIndex,1);
    }
}
