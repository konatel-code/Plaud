import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuditService } from "./audit.service";

const METHOD_AKCIA: Record<string, string> = {
  POST: "VYTVORENIE",
  PATCH: "UPRAVA",
  PUT: "UPRAVA",
  DELETE: "ZMAZANIE",
};

/** Zaznamená každú mutujúcu (POST/PATCH/PUT/DELETE) požiadavku do audit logu. */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const akcia = METHOD_AKCIA[req.method];
    const path: string = req.path ?? req.url ?? "";

    // Logujeme len mutácie a vynechávame autentifikáciu (heslá).
    const skip = !akcia || path.includes("/auth/");

    return next.handle().pipe(
      tap(() => {
        if (skip) return;
        const entita = path.replace(/^\/api\//, "").split("/")[0] || "?";
        this.audit.log({
          userId: req.user?.id ?? null,
          akcia,
          entita,
          entitaId: req.params?.id ?? null,
        });
      }),
    );
  }
}
