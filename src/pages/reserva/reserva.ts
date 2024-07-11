import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { MenuPage } from "../menu/menu";
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-reserva',
  templateUrl: 'reserva.html',
})
export class ReservaPage {
  rest: string = "";
  inputDisabled: boolean = false;
  loading: any;
  reservationInfo: any[] = [];
  reservationDet: any[] = [];
  reserva: string;
  fecha: string;
  movimiento: string;
  mercancia: string;
  coste: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
     public alertCtrl: AlertController, public platform: Platform) {
      
  }
  
  toggleDetail(selectedDet): void {
    this.reservationDet.forEach(det => {
      if (det === selectedDet) {
        det.showDetail = !det.showDetail;
      } else {
        det.showDetail = false;
      }
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservaPage');
  }
  
getReservaInfo() { 
  //validaciones
  if (this.rest.length > 10) {
      this.showAlert('Error', 'La reserva debe contener como máximo 10 dígitos numéricos.');
      return; 
      }
  if (!/^\d+$/.test(this.rest)) {
    this.showAlert('Error', 'La reserva debe contener solo caracteres numéricos.');
    return; 
     }
     //depuracion de las reservas
     console.log('Número de material:', this.rest);
     console.log('Datos en reserva:', this.reservationInfo);
     console.log('Datos en reserva detalle:', this.reservationDet);
    this.reservationInfo = [];
    this.reservationDet = [];
    this.inputDisabled = true;
    this.loading = this.loadingCtrl.create({
      content: "Cargando información de la reserva..."
    });
    this.loading.present();

 //Cuerpo de solicitud formateada en XML que envia datos a un servicio web SAP utilizando el protocolo SOAP.
    let srt = `<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZFM_RFC_SELEC_RESERVA_MAT>
          <IMP_RESERVA>${this.rest}</IMP_RESERVA>
          <IMP_SOCIEDAD>CATV</IMP_SOCIEDAD>   
          <EXP_CAB>
         </EXP_CAB>
          <TI_DETALLE>   
          </TI_DETALLE>
         
       </urn:ZFM_RFC_SELEC_RESERVA_MAT>
    </soapenv:Body>
 </soapenv:Envelope>`;

 //Url del servicio web donde estara toda la informacion en stock de reservas en SAP.
    let url = "http://cep.tresvalles.hn:8004/sap/bc/srt/rfc/sap/zws_visu_reserva_mat/900/zws_visu_reserva_mat/zws_visu_reserva_mat_bn";
   let xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (this.loading) {
          this.loading.dismiss();
        }
   
        this.inputDisabled = false;
            
        if ( xmlhttp.status == 200) {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString( xmlhttp.responseText, 'text/xml');
          let encabezado = xmlDoc.getElementsByTagName('EXP_CAB')[0];

          // Objeto para almacenar la información de la cabecera
          let reservaInfo = { 
            reserva: encabezado.querySelector('RESERVA') ? encabezado.querySelector('RESERVA').textContent : '',
            fecha: encabezado.querySelector('FECHA') ? encabezado.querySelector('FECHA').textContent : '',
            movimiento: encabezado.querySelector('MOVIMIENTO') ? encabezado.querySelector('MOVIMIENTO').textContent : '',
            mercancia: encabezado.querySelector('DEST_MERCADERIA') ? encabezado.querySelector('DEST_MERCADERIA').textContent : '',
            coste: encabezado.querySelector('CECO') ? encabezado.querySelector('CECO').textContent : ''
        };
        // Depuracion - mostrar en la consola la información de la cabecera
        console.log('Datos de la cabecera:', reservaInfo); 
        
        // Asignar la información de la cabecera al arreglo reservationInfo
        this.reservationInfo = [reservaInfo];
      
          let stockItems = xmlDoc.getElementsByTagName('TI_DETALLE')[0].getElementsByTagName('item');
          if (stockItems.length > 0) {        
     
            this.reservationDet= Array.from(stockItems).map(item => {
              return {
               
                posicion: item.querySelector('POSICION') ? item.querySelector('POSICION').textContent : '',
                codigo_material: item.querySelector('MATERIAL') ? item.querySelector('MATERIAL').textContent.replace(/^0+/, '') : '',
                material: item.querySelector('DESC_MAT') ? item.querySelector('DESC_MAT').textContent : '',
                um: item.querySelector('UM') ? item.querySelector('UM').textContent : '',
                centro: item.querySelector('CENTRO') ? item.querySelector('CENTRO').textContent : '',
                almacen: item.querySelector('ALMACEN') ? item.querySelector('ALMACEN').textContent : '',
                cantidad_necesaria: item.querySelector('CANTIDAD_NECESARIA') ? item.querySelector('CANTIDAD_NECESARIA').textContent : '',
                cantidad_tomada: item.querySelector('CANTIDAD_TOMADA') ? item.querySelector('CANTIDAD_TOMADA').textContent : ''
                
              };
            });
          } else {
            this.showAlert('Error', 'No se encontró información.');
          }
        } 
        this.rest = "";
       
     
      }
    };  
  
    xmlhttp.ontimeout = () => {
      this.loading.dismiss();
      this.showAlert('Error', 'Tiempo de espera agotado. Por favor, inténtelo de nuevo más tarde.');
      if (this.loading) {
        this.loading.dismiss();
      }
    };

       
    xmlhttp.onerror = () => {
      this.loading.dismiss();
      this.showAlert('Error', 'Error de red. Por favor, asegúrese de estar conectado a internet y vuelva a intentarlo.');
      if (this.loading) {
        this.loading.dismiss();
      }
    };
  //ENCABEZADOS DE AUTORIZACION PARA EVITAR POLITICA DE CORS
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/soap+xml;charset=UTF-8');
    xmlhttp.send(srt);
    xmlhttp.timeout = 3000;
  }
  
    //Alertas para usuario
  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
    this.rest = "";
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Salir',
          handler: () => {
            console.log('Salir');
            
            if (this.platform.is('cordova')) {
              this.platform.exitApp();
            } 
          }
        }
      ]
    });
    confirm.present();
  }
  goBack() {
    this.navCtrl.setRoot(MenuPage); 
  }
  
}
