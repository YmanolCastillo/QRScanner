import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser/ngx";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  constructor(private browser : InAppBrowser, public platform : Platform,
    public router : Router) { }
   
Continuar()
{
  // let adId;
  // if(this.platform.is('android')) {
  //   adId = 'ca-app-pub-5395483951157379/3182966573';
  // }
  // this.Admob.prepareInterstitial({adId: adId})
  //   .then(() => { this.Admob.showInterstitial();
  //     this.router.navigate(["/scanner"]);
  //    });
     this.router.navigate(["/scanner"]);
    
}

   OpenBrowser()
   {
    var URL = "http://minple.info/";
    this.browser.create(URL, '_blank')
   }

  ngOnInit() {
  }

}
