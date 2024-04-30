import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    let currentUser = localStorage.getItem('currentUser') || {};
    if (typeof currentUser === "string") {
      currentUser = JSON.parse(currentUser);
    }
    if (currentUser && (currentUser as any).authdata) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${(currentUser as any).authdata}`
        }
      });
    }

    return next.handle(request);
  }
}
