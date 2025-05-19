import { Customer, Document, PensionerPaycheckTerm } from "@prisma/client";
import { User } from "src/core/user/entities/user.entity";

export class PensionerPaycheck {
  id: string;
  registration: string;
  bond: string;
  cpf: string;
  pensionerNumber: string;
  month: number;
  year: number;
  consignableMargin: number;
  totalBenefits: number;
  netToReceive: number;
  automationId: string;
  createdAt: Date;
  updatedAt: Date;
  terms: PensionerPaycheckTerm[]
  automation: {
    id: string;
    customerId: string | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer | null
    user: User | null
    documents: Document[];
  };
}