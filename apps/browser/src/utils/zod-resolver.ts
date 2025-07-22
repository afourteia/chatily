import { ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const getResolver = <T extends ZodType<any, any, any>>(schema: T) => {
  return zodResolver(schema, undefined, { raw: true });
};
