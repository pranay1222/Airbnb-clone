const myAPIKey = myToken;
        
        const map = L.map('map',{
            center:listing.geometry.coordinates,
            zoom:13
        }); 

        L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${myAPIKey}`, {
            attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        
        // Add a marker 📍
        L.marker(listing.geometry.coordinates).addTo(map)
            .bindPopup(`<h2>${listing.title}</h2><p>Exact location wil be revealed after booking</p>`)
            .openPopup();

