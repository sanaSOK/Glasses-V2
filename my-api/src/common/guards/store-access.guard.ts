import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class StoreAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserData = request.user;

    // Public / Unauthenticated routes bypass this guard
    if (!user) {
      return true;
    }

    // SUPER_ADMIN has access to all stores
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // STORE_ADMIN and STAFF must belong to a store
    if (!user.storeId) {
      throw new ForbiddenException('User is not associated with any store');
    }

    // Enforce store isolation: Overwrite any user-provided store_id in query or body
    if (request.query) {
      request.query.store_id = user.storeId.toString();
    }

    if (request.body && typeof request.body === 'object') {
      request.body.store_id = user.storeId;
    }

    // If route contains :storeId parameter, ensure it matches user's assigned storeId
    if (request.params && request.params.storeId) {
      const targetStoreId = parseInt(request.params.storeId, 10);
      if (!isNaN(targetStoreId) && targetStoreId !== user.storeId) {
        throw new ForbiddenException('Cross-store access denied. You can only access your own store data.');
      }
    }

    return true;
  }
}
