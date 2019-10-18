import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

const routeLayer = {
    id: 'route',
    source: 'route',
    type: 'line',
    paint: {
        'line-width': 2,
        'line-color': '#007cbf'
    }
}

var originLongitude = -73.99338326922793;
var originLatitude = 40.732589082619626;
export default class Route extends Component {
    state = {
        routeData: null,
        viewport: {
            latitude: originLatitude,
            longitude: originLongitude,
            zoom: 15.5
        }
    };
    TOKEN = "pk.eyJ1IjoiYXdhaXNrIiwiYSI6ImNrMWhqamVseTBjdnAzZG5yNmEwcW1yNGoifQ.xXo0nVsOswONHV85L2VWlA";

    _onViewportChange = viewport => this.setState({ viewport });

    _getRoute = () => {
        axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoiYXdhaXNrIiwiYSI6ImNrMWhqamVseTBjdnAzZG5yNmEwcW1yNGoifQ.xXo0nVsOswONHV85L2VWlA&overview=full&geometries=geojson`)
            .then(res => {
                let { routeData } = this.state;
                routeData = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: res.data.routes[0].geometry.coordinates
                        }
                    }]
                };

                this.setState({ routeData });
            })
    }

    render() {
        const { viewport, routeData } = this.state;
        return (
            <div>
                <ReactMapGL
                    {...viewport}
                    width="1000px"
                    height="550px"
                    mapboxApiAccessToken={this.TOKEN}
                    onViewportChange={this._onViewportChange}
                >
                    {routeData && (
                        <Source type="geojson" data={routeData}>
                            <Layer {...routeLayer} />
                        </Source>
                    )}
                </ReactMapGL><br />
                <button onClick={this._getRoute}>Click</button><br />
            </div>
        );
    }
}