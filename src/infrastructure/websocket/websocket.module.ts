import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WsAutomationsService } from './automations/automation-websocket.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WebsocketGateway, WsAutomationsService],
  exports: [WsAutomationsService, WebsocketGateway],
})
export class WebsocketModule {}
