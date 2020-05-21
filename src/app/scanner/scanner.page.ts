import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastController, LoadingController, Platform } from "@ionic/angular";
import jsQR from "jsqr";

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.page.html",
  styleUrls: ["./scanner.page.scss"],
})
export class ScannerPage implements OnInit {
  navigator: any;
  constructor(
    private toastCtrl: ToastController,
    private loadingCrtl: LoadingController,
    private ptl: Platform
  ) {
    const isInStandaloneMode = () =>
      "standalone" in window.navigator && window.navigator["standalone"];
    if (this.ptl.is("ios") && isInStandaloneMode()) {
    }
  }
  ngOnInit() {}

  scanActive = false;
  scanResult = null;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  loading: HTMLIonLoadingElement;

  @ViewChild("video", { static: false }) video: ElementRef;
  @ViewChild("canvas", { static: false }) canvas: ElementRef;
  @ViewChild("fileinput", { static: false }) fileinput: ElementRef;

//Agrego la funcion para cargar Imagen desde el dispositivo
CaptureImage()
{
this.fileinput.nativeElement.click();
}

handleFile(files: FileList)
{
const file = files.item(0);

var img = new Image();
img.onload = () => {
  this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
  const imageData = this.canvasContext.getImageData(
    0,
    0,
    this.canvasElement.width,
    this.canvasElement.height
  );
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });
  if (code) {
    this.scanResult = code.data;
    this.showQRToast();
  } 
};
img.src = URL.createObjectURL(file);
}

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async StartScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute("playsinline", true);
    this.videoElement.play();
    this.loading = await this.loadingCrtl.create({});
    this.loading.present();
    requestAnimationFrame(this.Scan.bind(this));
  }
  async Scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasContext = this.canvasElement.getContext("2d");
      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      console.log("code: ", code);

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.showQRToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.Scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.Scan.bind(this));
    }
  }

  StopScanner() {
    this.scanActive = false;
  }

  Reset() {
    this.scanResult = null;
  }

  async showQRToast() {
    const toast = await this.toastCtrl.create({
      message: `Abrir ${this.scanResult}?`,
      position: "top",
      color: 'primary',
      duration: 7500,
      buttons: [
        {
          text: "Abrir",
          handler: () => {
            window.open(this.scanResult, "_system", "location=yes");
          },
        },
      ],
    });
    toast.present();
  }
}
