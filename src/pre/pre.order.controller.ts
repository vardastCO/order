import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { PreOrder } from './entities/pre-order.entity';
import { PreOrderStates } from 'src/base/utilities/enums/pre-order-states.enum';


@Controller()
export class TempOrderController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}

    @MessagePattern({ cmd: 'create_pre_order' })
    async createOrder(@Payload() data: any, @Ctx() context: any) {
      try {

        
        const input = this.decompressionService.decompressData(data.data);
        let order = await PreOrder.findOneBy({
          userId : input.userId,
          status : PreOrderStates.CREATED
        });
        if (order) {
          return this.compressionService.compressData(order)
        }
        const newOrder = PreOrder.create(input.createPreOrderInput);
        newOrder.userId = input.userId
      

        await newOrder.save();
        return this.compressionService.compressData(newOrder)
      } catch (e) {
        console.error('Failed to create order:', e);
      }
    }
  
    @MessagePattern({ cmd: 'get_all_orders' })
    async getAllOrders(@Payload() data: any, @Ctx() context: any): Promise<PreOrder[]> {
      try {
        // No need for input data, just return all orders
        return await PreOrder.find();
      } catch (e) {
        console.error('Failed to get all orders:', e);
      }
    }
  
    @MessagePattern({ cmd: 'find_pre_order' })
    async getOrderById(@Payload() data: any, @Ctx() context: any) {
      try {
        const input = this.decompressionService.decompressData(data.data);
        const  id  = input.id;
        const order = await PreOrder.findOne({
          where: {
            id,
          },
        })
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        console.log('order',order)
        return this.compressionService.compressData(order)
      } catch (e) {
        console.error('Failed to get order by ID:', e);
      }
    }
  
    @MessagePattern({ cmd: 'update_order' })
    async updateOrder(@Payload() data: any, @Ctx() context: any): Promise<PreOrder> {
      try {
        const input = this.decompressionService.decompressData(data.data);
        const { id, newData } = input;
        let order = await PreOrder.findOne(id);
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        order = Object.assign(order, newData);
        return await order.save();
      } catch (e) {
        console.error('Failed to update order:', e);
      }
    }
  
    @MessagePattern({ cmd: 'delete_order' })
    async deleteOrder(@Payload() data: any, @Ctx() context: any): Promise<void> {
      try {
        const input = this.decompressionService.decompressData(data.data);
        const { id } = input;
        const result = await PreOrder.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException('Order not found');
        }
      } catch (e) {
        console.error('Failed to delete order:', e);
      }
    }
}
