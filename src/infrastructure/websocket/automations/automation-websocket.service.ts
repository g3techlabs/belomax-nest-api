import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket.gateway';
import { WsAutomationNewInput } from './inputs/automation-new.input';
import { WsAutomationStatusChangeInput } from './inputs/automation-status-change.input';
import { WsAutomationDocumentAddedInput } from './inputs/automation-document-added.input';

@Injectable()
export class WsAutomationsService {
  constructor(private readonly ws: WebsocketGateway) {}

  notifyNewAutomation(userId: string, data: WsAutomationNewInput) {
    this.ws.getServer().to(userId).emit('automation:new', data);
  }

  notifyStatusChange(
    userId: string,
    automationId: string,
    data: WsAutomationStatusChangeInput,
  ) {
    this.ws
      .getServer()
      .to(userId)
      .emit('automation:status-update', { automationId, ...data });
  }

  notifyDocumentAdded(
    userId: string,
    automationId: string,
    data: WsAutomationDocumentAddedInput,
  ) {
    this.ws
      .getServer()
      .to(userId)
      .emit('automation:document-added', {
        automationId,
        ...data,
      });
  }
}
