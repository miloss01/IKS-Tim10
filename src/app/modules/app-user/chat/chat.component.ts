import { NonNullAssert } from '@angular/compiler';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppUser, AppUserForRide, MessageReceivedDTO, MessageResponseDTO, MessageSentDTO } from 'src/app/models/models';
import { AppUserService } from 'src/app/services/app-user.service';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import { WebsocketService } from '../../ride/service/websocket.service';
import { UserServiceService } from '../account/services/user.service';
import { accountsDTO } from '../manage-passengers/manage-passengers.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: MessageReceivedDTO[] = []
  userEmail: string = ""
  newMessage: string = ""
  isAdmin: boolean = false
  admins: AppUserForRide[] | undefined = []


  constructor(private appUserService: AppUserService, private authService: LoginAuthentificationService, private userService: UserServiceService, private socketService: WebsocketService) { }

  async ngOnInit(): Promise<void> {

    let role: string = this.authService.getRole()
    this.isAdmin = true ? role == "ADMIN" : false

    if (!this.isAdmin)
      this.admins = await this.appUserService.getAdmins().toPromise()

    let stompClient: any = this.socketService.initWebSocket();
    stompClient.connect({}, () => {
      let id: string = this.authService.getId()
      stompClient.subscribe("/ride-notification-message/" + id, (message: { body: string }) => {
        let received: MessageSentDTO = JSON.parse(message.body)

        let newMessage: MessageReceivedDTO = {
          id: 0,
          timeOfSending: '',
          senderId: 0,
          receiverId: received.receiverId,
          message: received.message,
          type: received.type,
          rideId: received.rideId
        }

        this.messages.push(newMessage)

      });

    });
  }

  async loadMessages(): Promise<void> {
    this.messages = []
    let id: string = this.authService.getId()
    let receiver: AppUser | undefined = await this.userService.getUserByEmail(this.userEmail).toPromise()
    console.log(receiver)
    this.appUserService.getMessagesByUserId(Number(id)).subscribe((messages: MessageResponseDTO) => {
      console.log(messages)
      for (let message of messages.results)
        if (message.receiverId == receiver?.id || message.senderId == receiver?.id)
          this.messages.push(message)
    })
  }

  getFlexAlign(message: MessageReceivedDTO): string {
    let id: string = this.authService.getId()
    if (message.senderId == Number(id))
      return "flex-end"
    else
      return "flex-start"
  }

  getBgColor(message: MessageReceivedDTO): string {
    let id: string = this.authService.getId()
    if (message.senderId == Number(id))
      return "#81d484"
    else
      return "#d49381"
  }

  async sendMessage(): Promise<void> {
    let receiver: AppUser | undefined = await this.userService.getUserByEmail(this.userEmail).toPromise()
    let message: MessageSentDTO = {
      receiverId: receiver?.id!,
      message: this.newMessage,
      type: "support",
      rideId: 0
    }
    this.appUserService.sendMessage(receiver?.id!, message).subscribe((receivedMessage: MessageReceivedDTO) => {
      this.messages.push(receivedMessage)
    })
  }

}
