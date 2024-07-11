import { Component,ViewChild} from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { MaterialPage } from '../pages/material/material';
import { ReservaPage } from '../pages/reserva/reserva';
import { MenumoduloPage } from '../pages/menumodulo/menumodulo';
import { ReservaPageModule } from '../pages/reserva/reserva.module';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  //rootPage: any = ReservaPage;
 rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;
  isMenuOpen: boolean = false

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menuCtrl: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'INICIAR SESIÓN', component: LoginPage, icon: 'person' },
      { title: 'MENÚ', component: MenuPage, icon: 'options'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  redirigirPagina(valor: number ) {
    this.nav.push(MaterialPage, { operacion: valor}); 
    this.closeMenu();
   }
 

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
   
   
  }
  // Cerrar el side menu utilizando el MenuController
  closeMenu() {
    this.menuCtrl.close(); 
  }
}