import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { CreateCustomerService } from '../services/create-customer.service';
import { FindByIdCustomerService } from '../services/find-by-id-customer.service';
import { FindManyCustomerService } from '../services/find-many-customer.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateCustomerService } from '../services/update-customer.service';
import { FindManyCustomerDto } from '../dto/find-many-customer.dto';
import { Customer } from '@prisma/client';
import { UpdateCustomerInput } from '../inputs/update-customer.input';

@Controller('api/customers')
export class CustomerController {
  constructor(
    private readonly findManyCustomerService: FindManyCustomerService,
    private readonly findByIdCustomerService: FindByIdCustomerService,
    private readonly createCustomerService: CreateCustomerService,
    private readonly updateCustomerService: UpdateCustomerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(
    @Query() data: FindManyCustomerInput,
  ): Promise<FindManyCustomerDto> {
    return await this.findManyCustomerService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Customer> {
    return await this.findByIdCustomerService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateCustomerInput): Promise<Customer> {
    console.log('data', data);

    return await this.createCustomerService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCustomerInput,
  ): Promise<Customer> {
    return await this.updateCustomerService.execute(id, data);
  }
}
