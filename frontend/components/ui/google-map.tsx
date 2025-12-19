'use client';

import React, { useCallback, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.75rem',
};

const defaultCenter = {
    lat: 13.7563, // Bangkok (S1 base)
    lng: 100.5018
};

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    seasonal_color?: string; // Optional: Override color
    season_slug?: string;
}

interface GoogleMapProps {
    center?: { lat: number, lng: number };
    zoom?: number;
    markers?: MapMarker[];
    className?: string;
}

// Map styles for Dark Mode
const darkMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

export function EarthArcadeMap({ center = defaultCenter, zoom = 2, markers = [], className }: GoogleMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const getMarkerIcon = (color?: string, slug?: string) => {
        // Simple color based markers or custom URLs could go here
        // For now, default Google markers, maybe we can adjust color via URL if needed
        // http://maps.google.com/mapfiles/ms/icons/blue-dot.png

        let markerColor = 'red';
        if (slug === 's1') markerColor = 'red'; // Thailand -> Red/Hot
        if (slug === 's2') markerColor = 'blue'; // Finland -> Blue/Cold
        // if (slug === 's3') markerColor = 'yellow'; // Bali/Torong -> Yellow?
        if (color) markerColor = color;

        return `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`;
    };

    if (!isLoaded) {
        return (
            <div className={`w-full h-full min-h-[400px] bg-zinc-900 rounded-xl animate-pulse flex items-center justify-center text-zinc-500 ${className}`}>
                Loading Map...
            </div>
        );
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className={`w-full h-full min-h-[400px] bg-zinc-900 rounded-xl flex items-center justify-center text-red-400 p-4 text-center border border-red-900/50 ${className}`}>
                Missing Google Maps API Key.<br />
                Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
            </div>
        );
    }

    return (
        <div className={className}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markers.length === 1 ? { lat: markers[0].lat, lng: markers[0].lng } : center}
                zoom={markers.length === 1 ? 12 : zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: darkMapStyles,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => setSelectedMarker(marker)}
                        icon={getMarkerIcon(marker.seasonal_color, marker.season_slug)}
                        title={marker.title}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="text-black p-2 max-w-[200px]">
                            <h3 className="font-bold text-sm mb-1">{selectedMarker.title}</h3>
                            {selectedMarker.season_slug && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white mb-2 inline-block">
                                    {selectedMarker.season_slug.toUpperCase()}
                                </span>
                            )}
                            {selectedMarker.description && (
                                <p className="text-xs text-zinc-600 leading-tight">{selectedMarker.description}</p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}
