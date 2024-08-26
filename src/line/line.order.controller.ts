import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

import { PreOrderStates } from 'src/base/utilities/enums/pre-order-states.enum';
import { Line } from './entities/order-line.entity';
import { PreOrder } from 'src/pre/entities/pre-order.entity';


@Controller()
export class LineController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}
    
    @MessagePattern({ cmd: 'find_line_order' })
    async find_line_order(@Payload() data: any, @Ctx() context: any) {
      try {

        
        const input = this.decompressionService.decompressData(data.data);
      
        let lines = await Line.find({
          where: {
            pre_order_id : input.id,
          }
        });
       
        return this.compressionService.compressData(lines)
      } catch (e) {
        console.error('Failed to create order:', e);
      }
    }
    @MessagePattern({ cmd: 'create_line_order' })
    async create_line_order(@Payload() data: any, @Ctx() context: any) {
      try {

        
        const input = this.decompressionService.decompressData(data.data);
      
        let order = await PreOrder.findOneBy({
          id : input.createLineInput.pre_order_id,
        });
       
        order.status = PreOrderStates.ADDEDLINE 
        const newOrder = Line.create(input.createLineInput);
        newOrder.userId = input.userId
        newOrder.created_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})
        await newOrder.save();
        await order.save();
        return this.compressionService.compressData(newOrder)
      } catch (e) {
        console.error('Failed to create order:', e);
      }
    }
  
    // @MessagePattern({ cmd: 'get_all_orders' })
    // async getAllOrders(@Payload() data: any, @Ctx() context: any): Promise<PreOrder[]> {
    //   try {
    //     // No need for input data, just return all orders
    //     return await PreOrder.find();
    //   } catch (e) {
    //     console.error('Failed to get all orders:', e);
    //   }
    // }
  
    // @MessagePattern({ cmd: 'get_order_by_id' })
    // async getOrderById(@Payload() data: any, @Ctx() context: any): Promise<PreOrder> {
    //   try {
    //     const input = this.decompressionService.decompressData(data.data);
    //     const { id } = input;
    //     const order = await PreOrder.findOne(id);
    //     if (!order) {
    //       throw new NotFoundException('Order not found');
    //     }
    //     return order;
    //   } catch (e) {
    //     console.error('Failed to get order by ID:', e);
    //   }
    // }
  
    // @MessagePattern({ cmd: 'update_order' })
    // async updateOrder(@Payload() data: any, @Ctx() context: any): Promise<PreOrder> {
    //   try {
    //     const input = this.decompressionService.decompressData(data.data);
    //     const { id, newData } = input;
    //     let order = await PreOrder.findOne(id);
    //     if (!order) {
    //       throw new NotFoundException('Order not found');
    //     }
    //     order = Object.assign(order, newData);
    //     return await order.save();
    //   } catch (e) {
    //     console.error('Failed to update order:', e);
    //   }
    // }
  
    // @MessagePattern({ cmd: 'delete_order' })
    // async deleteOrder(@Payload() data: any, @Ctx() context: any): Promise<void> {
    //   try {
    //     const input = this.decompressionService.decompressData(data.data);
    //     const { id } = input;
    //     const result = await PreOrder.delete(id);
    //     if (result.affected === 0) {
    //       throw new NotFoundException('Order not found');
    //     }
    //   } catch (e) {
    //     console.error('Failed to delete order:', e);
    //   }
    // }
}
