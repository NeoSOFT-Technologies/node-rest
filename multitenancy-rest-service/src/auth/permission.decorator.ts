import { SetMetadata } from '@nestjs/common';

export const Permission = (permissions: string[]) => SetMetadata('permissions', permissions);
