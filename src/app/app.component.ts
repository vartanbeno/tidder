import { Component, ViewChild, ElementRef } from '@angular/core';
import { SubtidderService } from './subtidder.service';
import { AuthService } from './auth.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userId: Object = {};
  subscriptions: Array<any> = [];
  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(private subtidderService: SubtidderService, private authService: AuthService) { }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.getSubscriptions();
    }
    this.subtidderService.navbar = this;
  }

  getSubscriptions() {
    this.userId['id'] = localStorage.getItem('id');
    this.subtidderService.getSubscriptions(this.userId).subscribe(
      res => {
        this.subscriptions = res;
        $('.ui.dropdown').dropdown();
      },
      err => console.log(err)
    )
  }

  focusOnSearch() {
    this.searchBox.nativeElement.focus();
  }

}
