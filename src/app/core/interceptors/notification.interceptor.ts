import { Injectable, inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { SharedService } from '../service';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
    constructor(
        private message: NzMessageService,
        private router: Router,
        public shared: SharedService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
                        const status: number = event.body.status;
                        switch (status) {
                            case 1:
                                if (event.body.message !== null && event.body.message !== '') {
                                    this.message.success(event.body.message);
                                }
                                break;
                            case 0:
                                this.message.warning('服务端未进行任何执行，请联系系统管理员。');
                                break;
                            default:
                                this.message.info(event.body.message);
                                break;
                        }
                    }
                },
                /**
                 * 处理非200状态
                 * 1.401(未认证)
                 * 2.403(无权限访问资源)
                 * 3.500(服务器异常)
                 * 4.504(网络不可达)
                 * 5.404(未找到)
                 *   400(后台业务权限)
                 */
                (err: any) => {
                    if (err.status === 500) {
                        this.message.error('服务器端异常');
                    } else if (err.status === 404) {
                        this.message.error('未发现资源');
                    } else if (err.status === 504) {
                        this.message.error('网络通讯异常');
                    } else if (err.status === 401) {
                        this.message.error('未登录或登录已失效');
                        // this.router.navigate(['/passport/login']);
                        this.shared.doLogout();
                        this.router.navigateByUrl('/index');
                    } else if (err.status === 403) {
                        this.message.error('无权限访问');
                    } else {
                        if (err.error.message) {
                            this.message.error(err.error.message);
                        } else {
                            this.message.error(err.error);
                        }
                    }
                }
            )
        );
    }
}
