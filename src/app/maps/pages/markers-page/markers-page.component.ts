import { Component, ElementRef, ViewChild } from '@angular/core';
import {LngLat, Map, Marker} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { reduce } from 'rxjs';


interface MarkerAndColor {
  color:string;
  marker:Marker;
}

interface PlainMarker{
  color:string;
  lngLat:number[];
}

@Component({
  selector: 'makers-page-app',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?:ElementRef;

  public markers:MarkerAndColor[] = [];

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
      zoom: 13, // starting zoom
      });
      this.readFromLocalStorage();


      // const makerHtml = document.createElement('div');
      // makerHtml.innerHTML = 'Marcador'
      // const marker = new Marker({element: makerHtml})
      // .setLngLat(this.currentLngLat)
      // .addTo(this.map)
  }
  createMarker():void{
    if(!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  addMarker(lngLat:LngLat, color:string){
    if(!this.map) return;
    const marker = new Marker({
      color: color,
      draggable:true,

    })
      .setLngLat(lngLat)
      .addTo(this.map)

    this.markers.push({color:color,  marker:marker});
    marker.on('dragend', ()=>{this.saveToLocalStorage() })
    this.saveToLocalStorage();
  }
  deleteMarker(index:number):void{
    this.markers[index].marker.remove();
    this.markers.splice(index, 1)
    this.saveToLocalStorage();
  }
  flyTo(marker:Marker):void{
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat(),
    })
  }

  saveToLocalStorage(){
    const plainMarkers: PlainMarker[] = this.markers.map(({color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }
  readFromLocalStorage(){
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers:PlainMarker[] = JSON.parse(plainMarkersString);
    plainMarkers.forEach(({color, lngLat}) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords,color)
    });
  }


}

