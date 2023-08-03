import { Observable } from 'rxjs';
export type GuardResponse = boolean | Promise<boolean> | Observable<boolean>;
