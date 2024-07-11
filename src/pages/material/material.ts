import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { MenuPage } from "../menu/menu";


@IonicPage()
@Component({
  selector: 'page-material',
  templateUrl: 'material.html',
})

export class MaterialPage {
  materialInfo: any[] = [];
  materialENC: any[] = [];
  matnr: string = "";
  inputDisabled: boolean = false;
  loading: any;
  Desp: string = ''; 
  Operacion: number;
 
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
     public alertCtrl: AlertController, public platform: Platform ) {
   
      this.Operacion = this.navParams.get('operacion');

    console.log('Valor de Operacion:', this.Operacion);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaterialPage');
  }
  
  getMaterialInfo() {
   //Validaciones
    if (this.Operacion === 1 && (!this.matnr || !/^\d+$/.test(this.matnr))) {
      this.showAlert('Error', 'Ingrese un número de material válido.');
      return;
    } else if (this.Operacion === 2) {

    } else if (this.Operacion === 3 ) {
      
    }

   //depuracion de materiales
    console.log('Número de material:', this.matnr);
    console.log('Valor de Desp:', this.Desp)
    console.log('Datos en materialInfo:', this.materialInfo);
    this.materialInfo = [];
    this.inputDisabled = true;
    this.loading = this.loadingCtrl.create({
      content: "Cargando información del material..."
    });
    this.loading.present();

    //Cuerpo de solicitud formateada en XML que envia datos a un servicio web SAP utilizando el protocolo SOAP.
    let srt = `
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZFM_RFC_MM_INVENTARIO_ALMACEN>
            <IMP_BUKRS>CATV</IMP_BUKRS>
            <IMP_DESP>${this.Desp}</IMP_DESP>
            <IMP_MATNR>${this.matnr}</IMP_MATNR>
            <IMP_OPERACION>${this.Operacion}</IMP_OPERACION>     
            <TA_MATERIAL></TA_MATERIAL>
            <TA_STOCK></TA_STOCK>
          </urn:ZFM_RFC_MM_INVENTARIO_ALMACEN>
        </soapenv:Body>
      </soapenv:Envelope>`;
         //Url del servicio web donde estara toda la informacion de stock de materiales en SAP.
    let url = "http://cep.tresvalles.hn:8004/sap/bc/srt/rfc/sap/zws_rfc_mm_inventario_alm/900/zws_rfc_mm_inventario_alm/zws_rfc_mm_inventario_alm_bn";
   
    //Crear el tipo de solictud HTTP asincrona
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if ( xmlhttp.readyState == 4) {
        if (this.loading) {
          this.loading.dismiss();
        }
   
        this.inputDisabled = false;
            // Crear un objeto DOMParser para analizar la respuesta XML
        if (xmlhttp.status == 200) {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(xmlhttp.responseText, 'text/xml');
          let encabezado = xmlDoc.getElementsByTagName('TA_MATERIAL')[0].getElementsByTagName('item');
          let stockItems = xmlDoc.getElementsByTagName('TA_STOCK')[0].getElementsByTagName('item');

            // verificar y Mapear los elementos <item> en un array de objetos para TA_MATERIAL
          if (stockItems.length > 0) {
            this.materialENC = Array.from(encabezado).map(item => {
              return {
                matrn: item.querySelector('MATNR') ? item.querySelector('MATNR').textContent : '',
                maktx: item.querySelector('MAKTX') ? item.querySelector('MAKTX').textContent : '',
                meins: item.querySelector('MEINS') ? item.querySelector('MEINS').textContent : ''
            };
            
            });
        // Mapear los elementos <item> en un array de objetos para TA_STOCK
            this.materialInfo = Array.from(stockItems).map(item => {
              return {
                matrn: item.querySelector('MATNR') ? item.querySelector('MATNR').textContent : '',
                centro: item.querySelector('CENTRO') ? item.querySelector('CENTRO').textContent : '',
                sociedad: item.querySelector('BUKRS') ? item.querySelector('BUKRS').textContent : '',
                almacen: item.querySelector('ALMACEN') ? item.querySelector('ALMACEN').textContent : '',
                ubicacion: item.querySelector('UBICACION') ? item.querySelector('UBICACION').textContent : '',
                libre_utilizacion: item.querySelector('LIBRE_UTILIZACION') ? item.querySelector('LIBRE_UTILIZACION').textContent : '',
                consignacion_prov: item.querySelector('CONSIGNACION_PROV') ? item.querySelector('CONSIGNACION_PROV').textContent : '',
                stock_proyecto: item.querySelector('STOCK_PROYECTO') ? item.querySelector('STOCK_PROYECTO').textContent : ''
              };
            });
          } else {
            this.showAlert('Error', 'No se encontró información.');
          }
        } 
        this.matnr = "";
        this.Desp = "";
     
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
    xmlhttp.timeout = 15000;
  }

  
//Alertas para usuario
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

  
  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
    this.Desp = "";
  }

  goBack() {
    this.navCtrl.setRoot(MenuPage); 
  }
}
