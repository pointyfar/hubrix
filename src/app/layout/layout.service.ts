import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { WidgetItem } from './../models/widget.item';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class LayoutService {
  
  configOrderUrl = "assets/config-order.json"
  
  constructor(private http: HttpClient) {
    
  }
  
  getSiteConfig(url): any {
    return this.http.get<any>(url);
              /*.pipe(map(
                site => {
                  return mapSite(site)
                }
              ))*/
    
  }
/*  getConfigs(url): any {
    return this.http.get<any>(url)
            .pipe(
              mergeMap(
                (config):any => {
                  let site = this.getSiteConfig(config.site);
                  let widgets = mapWidgetItem(config)
                  console.log('widgets',widgets)
                  return forkJoin([site, widgets])
                }
              )
            ).pipe(
              map(fork => { 
                console.log(fork[1], 'fork1')
                return {site:fork[0], widgets: fork[1]}
              })
            )
  }
  
  this.postsService
      .getPostData(postId)
        .switchMap(
          postData => this.getUserByPostData(postData)
            .map(userByPostData => ({ postData, userByPostData })
        )
      ).subscribe(({ postData, userByPostData })=> console.log(postData, userByPostData));


*/  
  getConfigs(url): any {
    return this.http.get<any>(url)
            .pipe(
              mergeMap( (config):any => {
                  return this.getSiteConfig(config.site)
                             .pipe(map( site => ({site, config}) ))
                }
              )
            )
            .pipe(
              map(combi => { 
                let widgets = mapWidgetItem(combi['config'])
                let site = combi['site']
                return {site, widgets}
              })
            )
  }

  getWidgetsList(url): Observable<WidgetItem[]> {
    return this.http.get<any>(url)
                .pipe( map( wi => mapWidgetItem(wi) ) ) 
  }
  
  getConfigList(url): Observable<any> {
    return this.http.get(url);
  }
  
  getConfigList2(url){
    return this.http.get(url)
                .pipe(map(m => mapSite(m)))
    ;
    
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

function mapSite(m:any): any{
  let model:any;
  let fields: FormlyFieldConfig[];
  
  fields = m.jsonFields;
  model = m.modelJson;
  
  return {
    jsonFields: fields,
    modelJson: model
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
    item['group'] = wi.widgets[i].group ? wi.widgets[i].group : "ungrouped";
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