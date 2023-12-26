mapboxgl.accessToken = mapToken;
const campDataObject = JSON.parse(campData);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campDataObject.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});
const marker1 = new mapboxgl.Marker()
.setLngLat(campDataObject.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h5>${campDataObject.title}</h5>`
    )
)
.addTo(map);