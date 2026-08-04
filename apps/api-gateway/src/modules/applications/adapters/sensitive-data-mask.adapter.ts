import { Injectable } from '@nestjs/common';

@Injectable()
export class SensitiveDataMaskAdapter {
  /**
   * Enmascara un número de documento dejando visibles solo los últimos 4 dígitos.
   * Ejemplo: "111111111" → "*****1111"
   */
  maskDocument(document: string): string {
    if (!document || document.length <= 4) return document;
    const visible = document.slice(-4);
    const masked = '*'.repeat(document.length - 4);
    return `${masked}${visible}`;
  }

  /**
   * Devuelve solo los campos seguros del cliente para exponer al frontend en listados:
   * nombre completo y documento enmascarado.
   */
  sanitizeCustomerForList(customer: {
    name: string;
    lastName: string;
    document: string;
    [key: string]: unknown;
  }): { name: string; lastName: string; document: string } {
    return {
      name: customer.name,
      lastName: customer.lastName,
      document: this.maskDocument(customer.document),
    };
  }
}
