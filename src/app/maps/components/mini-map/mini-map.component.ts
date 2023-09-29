import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit{
  @Input()
  public lngLat!:[number, number];
  @ViewChild('map')
  public divMap?:ElementRef;
  public map?:Map;

  ngAfterViewInit():void{

    if(!this.divMap) throw Error("Map Div not Found");
    if(!this.lngLat) throw Error("LngLat can't be null");
// MAPA
    this.map=new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lngLat,
      zoom:15,
      interactive:false,
    });

// MARKER
    new Marker()
    .setLngLat(this.lngLat)
    .addTo(this.map);

  }
}
