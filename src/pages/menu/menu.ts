import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MaterialPage } from '../material/material';
import { LoginPage } from '../login/login';
import { MenumoduloPage } from '../menumodulo/menumodulo';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
redirigirPagina(valor: number ) {
  
   this.navCtrl.push(MaterialPage, { operacion: valor }); 
  }

  goBack() {
    this.navCtrl.setRoot(MenumoduloPage); 
  }
}
