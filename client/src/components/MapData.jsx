import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

  const mapStyles = {
    width: '100%',
    height: '100%',
  };

export class MapContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
      lat: props.latitude,
      lng: props.longitude,
      showingInfoWindow: false,  // Hides or shows the InfoWindow
      activeMarker: {},          // Shows the active marker upon click
      selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
    }
  }

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  // console.log('tes')

  render() {
    return (
      <>
      <div className='map-container'>
        <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={
          {
            lat: this.props.latitude,
            lng: this.props.longitude
          }
        }>

        <Marker
          onClick={this.onMarkerClick}
        />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
        </Map>
        
      </div>
      </>
    );
  }
}

export default GoogleApiWrapper({
  // apiKey: 'AIzaSyBE78WkXrA-N9FGzYHPajlh0NutTeCxaJg'
  apiKey: import.meta.env.VITE_API_KEY
})(MapContainer);