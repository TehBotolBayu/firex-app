import React, { Component,  PureComponent} from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, Circle } from 'google-maps-react';

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

  render() {
    return (
      <>

      <div className='map-container'>
        <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={
          {
            lat: this.props.latitude,
            lng: this.props.longitude
          }
        }>


        {
            this.props.emergencies.map((e, i) => {
                return (
                <Circle
                        center={{ lat: parseFloat(e.latitude), lng: parseFloat(e.longitude) }}
                        radius={1000} // Radius in meters
                        strokeColor="red"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor="red"
                        fillOpacity={0.35}
                        />

                )
            })
        }

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