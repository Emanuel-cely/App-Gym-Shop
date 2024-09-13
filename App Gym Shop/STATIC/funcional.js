function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Inicializa el mapa centrado en una ubicación predeterminada
    const map = L.map('map').setView([0, 0], 13); // Latitud, Longitud y nivel de zoom inicial

    // Añade la capa de mapa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Obtiene la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Centra el mapa en la ubicación del usuario
            map.setView([lat, lng], 13);

            // Añade un marcador en la ubicación del usuario
            L.marker([lat, lng]).addTo(map)
                .bindPopup('Estás aquí')
                .openPopup();

            // Llama al backend para obtener los gimnasios cercanos
            fetch(`/api/gimnasios-cercanos?lat=${lat}&lng=${lng}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(gym => {
                        const gymLat = gym.latitud;
                        const gymLng = gym.longitud;
                        const gymName = gym.nombre;
                        const gymAddress = gym.direccion;

                        // Añade un marcador para cada gimnasio en el mapa
                        L.marker([gymLat, gymLng]).addTo(map)
                            .bindPopup(`<b>${gymName}</b><br>${gymAddress}`);
                    });
                })
                .catch(error => console.error('Error al obtener gimnasios cercanos:', error));
        }, showError);
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("El usuario ha negado la solicitud de geolocalización.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("La información de ubicación no está disponible.");
                break;
            case error.TIMEOUT:
                alert("La solicitud para obtener la ubicación ha expirado.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Se ha producido un error desconocido.");
                break;
        }
    }
});
