import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { CreateCustomerService } from '../services/create-customer.service';
import { FindByIdCustomerService } from '../services/find-by-id-customer.service';
import { FindManyCustomerService } from '../services/find-many-customer.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateCustomerService } from '../services/update-customer.service';
import { FindManyCustomerDto } from '../dto/find-many-customer.dto';
import { Customer } from '@prisma/client';
import { UpdateCustomerInput } from '../inputs/update-customer.input';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly findManyCustomerService: FindManyCustomerService,
    private readonly findByIdCustomerService: FindByIdCustomerService,
    private readonly createCustomerService: CreateCustomerService,
    private readonly updateCustomerService: UpdateCustomerService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async findMany(
    @Body() data: FindManyCustomerInput,
  ): Promise<FindManyCustomerDto> {
    return await this.findManyCustomerService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Customer> {
    return await this.findByIdCustomerService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() data: CreateCustomerInput): Promise<Customer> {
    return await this.createCustomerService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCustomerInput,
  ): Promise<Customer> {
    return await this.updateCustomerService.execute(id, data);
  }
}
