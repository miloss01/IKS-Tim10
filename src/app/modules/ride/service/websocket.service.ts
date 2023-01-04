import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  stompClient: any;

  constructor() { }

  initWebSocket() {
    let ws = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = null;
    // let that = this;
    // this.stompClient.connect({}, function () {
    //   that.openGlobalSocket();
    // });
    return this.stompClient;
  }

}
