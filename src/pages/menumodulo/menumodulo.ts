import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { MaterialPage } from '../material/material';
import { ReservaPage } from '../reserva/reserva';
import { MenuPage } from '../menu/menu';
/**
 * Generated class for the MenumoduloPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menumodulo',
  templateUrl: 'menumodulo.html',
})
export class MenumoduloPage {

  mensajeSaludo: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenumoduloPage');
  }
 
  goBack() {
    this.navCtrl.setRoot(LoginPage); 
  }
  menuPagina(){
    this.navCtrl.setRoot(ReservaPage);
  }

  menuPaginaStock(){
    this.navCtrl.setRoot(MenuPage);
  }
 


}
