import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already contains custom message/wrapper, return formatted structure
        if (data && typeof data === 'object' && 'message' in data && 'data' in data && 'success' in data) {
          return data;
        }

        let message = 'Operation completed successfully';
        let payload = data;

        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          message = data.message;
          payload = data.data;
        } else if (data && typeof data === 'object' && 'message' in data) {
          message = data.message;
          const { message: _, ...rest } = data;
          payload = Object.keys(rest).length > 0 ? rest : null;
        }

        return {
          success: true,
          message,
          data: payload ?? null,
        };
      }),
    );
  }
}
