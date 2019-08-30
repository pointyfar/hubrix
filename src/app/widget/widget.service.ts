import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable, forkJoin } from 'rxjs';
// import { map, mergeMap, switchMap } from 'rxjs/operators';


@Injectable()
export class WidgetService {
  constructor(private http: HttpClient) {
    
  }

  getContent(url): any {
    return this.http.get<any>(url, { responseType: 'text' as 'json'})
  }
}
