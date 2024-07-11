import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { HomePage} from '../home/home'
import { MaterialPage } from '../material/material';
import { Platform } from 'ionic-angular';
import { MenuPage } from '../menu/menu';
import { MenumoduloPage } from '../menumodulo/menumodulo';
import { ReservaPage } from '../reserva/reserva';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user='';
  pass='';
  showPassword: boolean = false;
  fun: any = {};
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alert: AlertController, 
              public toastCtrl: ToastController, 
              public modal: ModalController, 
              public loadingCtrl: LoadingController,
              public platform: Platform)
               {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  inicio(){
    const loading = this.loadingCtrl.create({
      content: "Validando!!!"
    
    });
    loading.present();
    var LINE_FEED = '\n';
    var CARRIAGE_RETURN = '\r';
      
        //let url ="http://ERPPRODUCCION.catv.hn:8004/sap/bc/srt/rfc/sap/zws_validar_usuario_apps/900/zws_validar_usuario_apps/zws_validar_usuario_apps_bn";

            
        let url = "http://cep.tresvalles.hn:8004/sap/bc/srt/rfc/sap/zws_validar_usuario_apps/900/zws_validar_usuario_apps/zws_validar_usuario_apps_bn";

        var srt = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">'+ CARRIAGE_RETURN + LINE_FEED +
        '<soapenv:Header/>'+ CARRIAGE_RETURN + LINE_FEED +
        '<soapenv:Body>'+ CARRIAGE_RETURN + LINE_FEED +                                                                                                                                        
           '<urn:ZFM_RFC_USER_MBL_XSOC>'+ CARRIAGE_RETURN + LINE_FEED +
              '<IMP_ACS></IMP_ACS>'+ CARRIAGE_RETURN + LINE_FEED +
              '<IMP_PASS>'+this.pass+'</IMP_PASS>'+ CARRIAGE_RETURN + LINE_FEED +
              '<IMP_USER>'+this.user+'</IMP_USER>'+ CARRIAGE_RETURN + LINE_FEED +
           '</urn:ZFM_RFC_USER_MBL_XSOC>'+ CARRIAGE_RETURN + LINE_FEED +
        '</soapenv:Body>'+ CARRIAGE_RETURN + LINE_FEED +
     '</soapenv:Envelope>';
    //alert(srt)
   let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange =  () => {  
       //alert(xmlhttp.status);
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        loading.dismiss(); 
        var Respuesta = xmlhttp.responseXML.getElementsByTagName('EXP_USUARIO').item(0).textContent;
        if((Respuesta.substring(Respuesta.length, (Respuesta.length - 1))) == '1'){
          let contador = 0;
          let nombre = '';
          let usuario = '';

          for(var i = 0; i< Respuesta.length; i++){
            if(Respuesta[i] == '|' || Respuesta[i] == '-'){
              contador = contador + 1;
            }
            if(contador == 1){
              usuario = usuario + Respuesta[i];
            }
            if(contador == 2){
              nombre = nombre + Respuesta[i];
            }
             this.user = usuario.substring(1,usuario.length);
            // this.NombreUsuario = nombre.substring(1,nombre.length);  
          }
       this.fun.SOCIEDAD = xmlhttp.responseXML.getElementsByTagName('EXP_BUKRS').item(0).textContent;
          this.navCtrl.setRoot(MenumoduloPage);
        }else{
          this.AlertasSencillas('CATV','Usuario o contraseña invalido.')
          this.pass = null;
        }
       
 
    }
    }      
    //ENCABEZADOS DE AUTORIZACION PARA EVITAR POLITICA DE CORS
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.setRequestHeader("Access-Control-Allow-Credentials", "true");
    xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "...All Headers...");
    xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
    xmlhttp.setRequestHeader('Authorization', 'Basic ' + btoa('RFC_USER:Aviones.2018'));
    xmlhttp.setRequestHeader("soapAction", "urn:sap-com:document:sap:soap:functions:mc-style:ZWS_RFC_USER_MBL:ZfmRfcUserMblRequest");
    xmlhttp.timeout = 20000;
    xmlhttp.ontimeout = function () {
    alert("tiempo de espera agotado");
    loading.dismiss(); 
    xmlhttp.abort();
    }    
    xmlhttp.send(srt);
  }

  
  
  AlertasSencillas(titulo,Mensaje) {
    let alert = this.alert.create({
      title: titulo,
      subTitle: Mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  salir() {
    let alert =  this.alert.create({
      title: 'Confirmar',
      message: '¿Estás seguro de que deseas salir de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Salir',
          handler: () => {
           
            let toast = this.toastCtrl.create({
              message: 'Saliendo de la aplicación...',
              duration: 2000
            });
            toast.present();
            setTimeout(() => {
              this.platform.exitApp();
            }, 2000);
          }
        }
      ]
    });

    alert.present();
  }
   
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
 
}


