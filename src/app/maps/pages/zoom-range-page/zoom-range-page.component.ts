import { AfterViewInit,OnDestroy, Component, ElementRef, ViewChild } from '@angular/core';
import {LngLat, Map} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

@Component({
  selector: 'zoom-range-app',
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{



  @ViewChild('map')
  public divMap?:ElementRef;

  public zoom:number = 10;
  public map?:Map;
  public currentLngLat:LngLat = new LngLat(-74.09993068799578, 4.677548535923876);

  ngAfterViewInit(): void {

    console.log(this.divMap);
    if(!this.divMap) throw Error('El elemento HTML no fue encontrado');
     this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });
      this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();

  }

  mapListeners():void{
    if(!this.map) throw Error('Mapa no inicializado');
    this.map.on('zoom', (ev)=>{
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev)=>{

      if(this.map!.getZoom()<18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () =>{
      this.currentLngLat =this.map!.getCenter();
      console.log(this.currentLngLat);
    })


  }

  zoomIn():void{
    this.map?.zoomIn();
  }
  zoomOut():void{
    this.map?.zoomOut();
  }
  zoomChanged(value:string){
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
