import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket.gateway';
// import { WsAutomationNewInput } from './inputs/automation-new.input';
import { WsAutomationStatusChangeInput } from './inputs/automation-status-change.input';
import { WsAutomationDocumentAddedInput } from './inputs/automation-document-added.input';
import { Automation } from '@prisma/client';

@Injectable()
export class WsAutomationsService {
  constructor(private readonly ws: WebsocketGateway) {}

  notifyNewAutomation(data: Automation, userId?: string) {
    if (!userId || userId.trim() === '') {
      this.ws.getServer().emit('automation:new', { ...data });
      return;
    }

    this.ws
      .getServer()
      .to(userId)
      .emit('automation:new', { ...data, userId });
  }

  notifyStatusChange(
    data: WsAutomationStatusChangeInput,
    automationId: string,
    userId?: string,
  ) {
    if (!userId || userId.trim() === '') {
      this.ws
        .getServer()
        .emit('automation:status-update', { automationId, userId, ...data });
      return;
    }

    this.ws
      .getServer()
      .to(userId)
      .emit('automation:status-update', { automationId, userId, ...data });
  }

  notifyDocumentAdded(
    data: WsAutomationDocumentAddedInput,
    automationId: string,
    userId?: string,
  ) {
    if (!userId || userId.trim() === '') {
      this.ws.getServer().emit('automation:document-added', {
        automationId,
        ...data,
      });
      return;
    }

    this.ws
      .getServer()
      .to(userId)
      .emit('automation:document-added', {
        automationId,
        ...data,
      });
  }
}
