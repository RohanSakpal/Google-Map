//Google API dynamic call
  // loadGoogleMapsScript(): Promise<void> {
  //   const script = this.renderer.createElement('script');
  //   script.type = 'text/javascript';
  //   //script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKdOQTo8TQJ6x3QwmK3TfZpt49Xek81KM`;
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.MAP_API}`;
  //   script.defer = true;

  //   return new Promise<void>((resolve, reject) => {
  //     script.onload = () => resolve();
  //     script.onerror = () => reject();

  //     this.renderer.appendChild(document.head, script);
  //   });
  // }
  
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GMap';
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;
  activeCircle: google.maps.Circle | null = null;
  circles: google.maps.Circle[] = [];
  markerCoordinates = [];
  ngAfterViewInit(): void {
    const mapProperties = {
      center: new google.maps.LatLng(35.2271, -80.8431),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.markerCoordinates = [
      { lat: 35.2271, lng: -80.8431, name: 'Marker 1', image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fen.troyeslachampagne.com%2Fwp-content%2Fuploads%2Fsites%2F2%2F2020%2F11%2F98819129-%25C2%25A9-Bj%25C3%25B6rn-Wylezich-stock.adobe_.com_.jpeg&tbnid=1Ingeo0_VgjuxM&vet=12ahUKEwidgZi-wI-DAxVJTmwGHfHjDdYQMygLegUIARCQAQ..i&imgrefurl=https%3A%2F%2Fen.troyeslachampagne.com%2Fshopping%2Fwhat-is-an-outlet-store%2F&docid=BRT0Mhk6ySggNM&w=990&h=660&q=outlet%20images&ved=2ahUKEwidgZi-wI-DAxVJTmwGHfHjDdYQMygLegUIARCQAQ' },
      { lat: 35.2280, lng: -80.8420, name: 'Marker 2', image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fc8.alamy.com%2Fcomp%2FCRJGC0%2Fthe-factory-outlet-shop-store-in-ipswich-suffolk-england-britain-uk-CRJGC0.jpg&tbnid=BgcgB_INq0d-SM&vet=12ahUKEwil35bfwI-DAxXja2wGHUcEDvQQMygAegQIARBz..i&imgrefurl=https%3A%2F%2Fwww.alamy.com%2Fstock-photo%2Ffactory-outlet-store.html&docid=I0W4b1O8YNKpRM&w=1300&h=953&q=outlet%20store%20images&ved=2ahUKEwil35bfwI-DAxXja2wGHUcEDvQQMygAegQIARBz' },
      { lat: 35.2265, lng: -80.8440, name: 'Marker 3', image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmountainairverbier.com%2FContent%2FImages%2Fuploaded%2FBlog%2F2018%2Fhero%2520outlet.jpg&tbnid=BltlF9_MkkUvxM&vet=12ahUKEwil35bfwI-DAxXja2wGHUcEDvQQMygIegUIARCGAQ..i&imgrefurl=https%3A%2F%2Fmountainairverbier.com%2Fen%2Foutlet-store&docid=1SeoU0q97Rjb0M&w=1104&h=621&q=outlet%20store%20images&ved=2ahUKEwil35bfwI-DAxXja2wGHUcEDvQQMygIegUIARCGAQ' },
      { lat: 35.2280, lng: -80.8460, name: 'Marker 4', image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcorporate.bestbuy.com%2Fbest-buy-to-open-4-new-outlet-stores%2F&psig=AOvVaw1P4wZxSs2k4q-ZkN12dqF3&ust=1702663175344000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJi9v_DAj4MDFQAAAAAdAAAAABAD' },
    ];;

    // Loop through marker coordinates and add markers to the map
    for (const coord of this.markerCoordinates) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(coord.lat, coord.lng),
        map: this.map,
        title: `${coord.name} at ${coord.lat}, ${coord.lng}`,
        // icon: {
        //   url: coord.image, // Image URL for the marker icon
        //   scaledSize: new google.maps.Size(20, 40), // Adjust the size of the image as needed
        // },
      });

      
    
      // google.maps.event.addListener(marker, 'mouseout', () => {
      //   const marker = new google.maps.Marker({
      //     position: new google.maps.LatLng(coord.lat, coord.lng),
      //     map: this.map,
      //     title: `${coord.name} at ${coord.lat}, ${coord.lng}`
      //   });
      // });

      marker.addListener('click', () => {
        this.updateCircle(marker.getPosition());
        // const clickedCoordinate: google.maps.LatLng = marker.getPosition();
        // const circleRadius = 500;
        const innerCoordinates = [];
        const outerCoordinates = [];

        for (const coord of this.markerCoordinates) {
          let isInsideAnyCircle = false;

          // Check if the coordinate is inside any of the circles
          for (const circle of this.circles) {
            if (this.isCoordinateWithinCircle(coord, circle.getCenter(), 0.2)) {
              isInsideAnyCircle = true;
              break;
            }
          }

          if (isInsideAnyCircle) {
            innerCoordinates.push(coord);
          } else {
            outerCoordinates.push(coord);
          }
        }

        console.log('inner',innerCoordinates)
        console.log('outer',outerCoordinates)
      });

      // google.maps.event.addListener(marker, 'mouseover', () => {
      //   debugger
      //   const marker = new google.maps.Marker({
      //     position: new google.maps.LatLng(coord.lat, coord.lng),
      //     map: this.map,
      //     title: `${coord.name} at ${coord.lat}, ${coord.lng}`,
      //     icon: {
      //       url: coord.image, // Image URL for the marker icon
      //       scaledSize: new google.maps.Size(20, 40), // Adjust the size of the image as needed
      //     },
      //   });
      // });
    }
  }

  updateCircle(position: google.maps.LatLng): void {
    // Remove the previous active circle, if any
    if (this.activeCircle) {
      this.activeCircle.setMap(null);
    }

    // Create a new circle around the clicked marker
    const newCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: position,
      radius: 200 // 500 meters
    });

    // Set the new circle as the active circle
    this.activeCircle = newCircle;
    this.circles = [];
    this.circles.push(newCircle);
  }

  isCoordinateWithinCircle(
    coordinate: any,
    circleCenter: any,
    radius: number
  ): boolean {
    const earthRadius = 6371; // Earth radius in kilometers
  
    // Convert latitude and longitude from degrees to radians
    const lat1 = this.toRadians(coordinate.lat);
    const lng1 = this.toRadians(coordinate.lng);
    const lat2 = this.toRadians(circleCenter.lat());
    const lng2 = this.toRadians(circleCenter.lng());
  
    // Calculate the Haversine distance
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    // Check if the distance is within the circle radius
    return distance <= radius;
  }
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  
}
