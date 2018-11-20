import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WidgetItem } from './../models/widget.item';

@Injectable()
export class LayoutService {
  
  configOrderUrl = "assets/config-order.json"
  
  constructor(private http: HttpClient) {
    
  }
  
  getWidgetsList(url): Observable<WidgetItem[]> {
    return this.http.get<any>(url)
                .pipe( map( wi => mapWidgetItem(wi) ) ) 
  }
  
  getConfigList(url): Observable<any> {
    return this.http.get(url);
      /*.pipe(
        flatMap((co:any) => {
          return this.processConfigJson(co)
        })
      )*/
  }
  

  handleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['error'] || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  getConfigItem(url:string){
    return this.http.get(url);
  }
  
  getConfigOrder(url:string) {
    return this.http.get(url);
    
  }


}


function mapWidgetItem( wi: any ):WidgetItem[] {
  let items = [];
  
  for(let i = 0; i < wi.widgets.length; i++ ){
    let item = <WidgetItem>{};
    
    item['name'] = wi.widgets[i].name ? wi.widgets[i].name : "widget";
    item['label'] = wi.widgets[i].label ? wi.widgets[i].label : "widget";
    item['class'] = wi.widgets[i].class ? wi.widgets[i].class : "widget";
    item['inputType'] = wi.widgets[i].inputType ? wi.widgets[i].inputType : "widget";
    item['icon'] = wi.widgets[i].icon ? wi.widgets[i].icon : "widgets";
    item['formConfig'] = wi.widgets[i].formConfig ? wi.widgets[i].formConfig : {};
    
    if( wi.widgets[i]['parent'] === true ){
      item['children'] = [] as any[];
      item['flex'] =  wi.widgets[i].flex ? wi.widgets[i].flex : 100;
    } else {
      item['result'] = <any>{};
      
    }
    items.push(item)
  }
  
  return items
}