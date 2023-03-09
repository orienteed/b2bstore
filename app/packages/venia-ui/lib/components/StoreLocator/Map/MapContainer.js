import React, { useEffect, useCallback, useState } from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './MapContainer.module.css';
import {
    GoogleMap,
    LoadScript,
    Marker,
    DirectionsService,
    DirectionsRenderer,
    InfoWindow
} from '@react-google-maps/api';

import StoreCard from '../StoreCard/StoreCard';
import Pagination from '../../Pagination';
import DirectionCard from '../DirectionCard/DirectionCard';
import { useIntl } from 'react-intl';
import { MapPin, Menu, X as Close } from 'react-feather';
import Icon from '../../Icon';
import SearchModal from '../SearchModal';
import LoadingIndicator from '../../LoadingIndicator';

const MapContainer = props => {
    const { mapProps, ...rest } = props;

    const {
        locationsItems,
        pageControl,
        showDirections,
        centerCoordinates,
        directionsCallback,
        response,
        mapZoom,
        openSearchModal,
        setOpenSearchModal,
        submitSearch,
        formProps,
        setFormApi,
        resetSearch,
        locationsLoading
    } = mapProps;

    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({});

    const [storeInfo, setStoreInfo] = useState({});

    const classes = useStyle(defaultClasses, props.classes);
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const containerStyle = {
        width: '100%',
        height: '500px'
    };

    const { formatMessage } = useIntl();

    const noStoresText = formatMessage({
        id: 'noStoresText',
        defaultMessage: 'There are no store available'
    });

    const mapRef = React.useRef();
    const directionsServiceRef = React.useRef(null);
    const directionsRendererRef = React.useRef(null);

    const handleOpenInfoStoreDialogue = useCallback(
        (lat, lng, street, city, country, name) => {
            setMarkerPosition({ lat: lat, lng: lng });
            setOpenInfoDialog(!openInfoDialog);
            setStoreInfo({ street: street, city: city, country: country, name: name });
        },
        [openInfoDialog]
    );

    const directionsOptions = React.useMemo(() => {
        return {
            destination: {
                lat: centerCoordinates.lat,
                lng: centerCoordinates.lng
            },
            origin: {
                lat: 20.9790646,
                lng: 105.7854776
            },
            travelMode: 'DRIVING'
        };
    }, [centerCoordinates]);

    useEffect(() => {
        if (directionsServiceRef.current) {
            directionsServiceRef.current = false;
        } else if (directionsRendererRef.current) {
            directionsRendererRef.current = false;
        }
    }, [centerCoordinates]);

    const onMapLoad = React.useCallback(map => {
        mapRef.current = map;
    }, []);

    const cardContainer = (
        <section>
            {locationsItems?.length === 0 ? (
                <span className={classes.noItemsText}>{noStoresText}</span>
            ) : (
                <>
                    <div className={classes.scrollableContainer}>
                        {locationsItems?.map((store, index) => (
                            <StoreCard {...rest} store={store} key={`${store.latitude}-${store.longitude}-${index}`} />
                        ))}
                    </div>
                    <Pagination pageControl={pageControl} />
                </>
            )}
        </section>
    );
    return (
        <LoadScript googleMapsApiKey={googleApiKey}>
            <main className={classes.container}>
                <section className={classes.innerContainer}>
                    <article className={classes.cardContainer}>
                        <div className={classes.searchBarWrapper}>
                            <button onClick={() => setOpenSearchModal(!openSearchModal)}>
                                <Icon src={!openSearchModal ? Menu : Close} />
                            </button>
                        </div>
                        {openSearchModal ? (
                            <SearchModal
                                submitSearch={submitSearch}
                                formProps={formProps}
                                setFormApi={setFormApi}
                                resetSearch={resetSearch}
                            />
                        ) : !showDirections ? (
                            locationsLoading ? (
                                <LoadingIndicator />
                            ) : (
                                cardContainer
                            )
                        ) : (
                            <div className={classes.scrollableContainerDirection}>
                                <DirectionCard />
                            </div>
                        )}
                    </article>
                    <article className={classes.googleMapContainer}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={centerCoordinates}
                            zoom={mapZoom}
                            onLoad={onMapLoad}
                        >
                            {locationsItems?.map((marker, index) => (
                                <Marker
                                    key={`${marker.latitude}-${marker.longitude}-${index}`}
                                    position={{ lat: +marker.latitude, lng: +marker.longitude }}
                                    onClick={() =>
                                        handleOpenInfoStoreDialogue(
                                            +marker.latitude,
                                            +marker.longitude,
                                            marker.street,
                                            marker.city,
                                            marker.country,
                                            marker.name
                                        )
                                    }
                                />
                            ))}

                            {showDirections && !directionsServiceRef.current && (
                                <DirectionsService
                                    options={directionsOptions}
                                    callback={directionsCallback}
                                    onLoad={service => {
                                        directionsServiceRef.current = service;
                                    }}
                                />
                            )}

                            {showDirections && response !== null && !directionsRendererRef.current && (
                                <DirectionsRenderer
                                    options={{
                                        directions: response
                                    }}
                                    onLoad={renderer => {
                                        directionsRendererRef.current = renderer;
                                    }}
                                />
                            )}
                            {openInfoDialog && (
                                <InfoWindow
                                    position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                    onCloseClick={() => setOpenInfoDialog(!openInfoDialog)}
                                >
                                    <section className={classes.dialogInfoContainer}>
                                        <article className={classes.infoStoreName}>
                                            <p>{storeInfo.name}</p>
                                        </article>
                                        <section className={classes.dialogIconAndLocation}>
                                            <article className={classes.iconContainer}>
                                                <Icon src={MapPin} size={24} />
                                            </article>
                                            <div>
                                                <span>{storeInfo.street} </span>
                                                <span>{storeInfo.city} </span>
                                                <span>{storeInfo.country}</span>
                                            </div>
                                        </section>
                                    </section>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </article>
                </section>
            </main>
        </LoadScript>
    );
};

export default MapContainer;
