import {Injectable} from '@angular/core';
import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor, HttpProgressEvent,
  HttpRequest, HttpResponse,
  HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {Credentials, GoogleAuthService} from './google-auth.service';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private googleAuth: GoogleAuthService) {}

  private refreshInProgress = false;

  private refreshTokenSubject = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any>  {
    return next.handle(req).pipe(
      tap(request => {
        console.log('intercept non err');
        console.log(request);
      }),
      catchError(err => {
        console.log('intercept err');
        console.log(err);
        if (err.status !== 401) {
          return Observable.throw(err);
        }

        if (this.refreshInProgress) {
          return this.refreshTokenSubject
            .pipe(
              filter(res => res !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(req)))
            );
        } else {
          this.refreshInProgress = true;

          this.refreshTokenSubject.next(null);

          return from(this.googleAuth.refreshToken()).pipe(
            switchMap((creds: Credentials) => {
              this.refreshInProgress = false;
              this.refreshTokenSubject.next(creds);

              return next.handle(this.addAuthenticationToken(req));
            }),
            catchError(refreshErr => {
              this.refreshInProgress = false;

              // Logout
              return Observable.throw(refreshErr);
            })
          );
        }

      })
    );
  }

  addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // Get access token from Local Storage
    const creds = GoogleAuthService.getCredentialsLocal();
    if (creds === null) {
      return request;
    }
    return request.clone({
      setHeaders: {
        Authorization: `${creds.token_type} ${creds.access_token}`
      }
    });
  }

}

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//
//   // constructor(private authService: AuthenticationService) { }
//   constructor(private authService: GoogleAuthService) { }
//
//   isRefreshingToken = false;
//   tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
//
//   intercept(request: HttpRequest<any>, next: HttpHandler):
//             Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
//
//     return next.handle(this.addTokenToRequest(request, this.authService.getAuthToken()))
//       .pipe(
//         catchError(err => {
//           if (err instanceof HttpErrorResponse) {
//             switch ((<HttpErrorResponse>err).status) {
//               case 401:
//                 return this.handle401Error(request, next);
//               case 400:
//                 return <any>this.authService.logout();
//             }
//           } else {
//             return throwError(err);
//           }
//         }));
//   }
//
//   private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
//   }
//
//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//
//     if(!this.isRefreshingToken) {
//       this.isRefreshingToken = true;
//
//       // Reset here so that the following requests wait until the token
//       // comes back from the refreshToken call.
//       this.tokenSubject.next(null);
//
//       return from(this.authService.refreshToken())
//         .pipe(
//           switchMap((creds: Credentials) => {
//             if (creds) {
//               this.tokenSubject.next(creds.access_token);
//               return next.handle(this.addTokenToRequest(request, creds.access_token));
//             }
//
//             return <any>this.authService.logout();
//           }),
//           catchError(err => {
//             return <any>this.authService.logout();
//           }),
//           finalize(() => {
//             this.isRefreshingToken = false;
//           })
//         );
//     } else {
//       this.isRefreshingToken = false;
//
//       return this.tokenSubject
//         .pipe(filter(token => token != null),
//           take(1),
//           switchMap(token => {
//             return next.handle(this.addTokenToRequest(request, token));
//           }));
//     }
//   }
//
// }
