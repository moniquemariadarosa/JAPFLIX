let datosPeliculas = []; 

window.onload = async function () {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    datosPeliculas = await response.json();
};

document.getElementById('btnBuscar').addEventListener('click', () => {
    const terminoBusqueda = document.getElementById('inputBuscar').value.toLowerCase();
    const peliculasFiltradas = datosPeliculas.filter(pelicula => {
        return (
            pelicula.title.toLowerCase().includes(terminoBusqueda) ||
            pelicula.genres.some(genero => genero.name.toLowerCase().includes(terminoBusqueda)) || 
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(terminoBusqueda)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(terminoBusqueda))
        );
    });
    mostrarPeliculas(peliculasFiltradas);
});

function mostrarPeliculas(peliculas) {
    const listaPeliculas = document.getElementById('lista');
    listaPeliculas.innerHTML = ''; 

    peliculas.forEach(pelicula => {
        const itemPelicula = document.createElement('li');
        itemPelicula.classList.add('list-group-item', 'bg-dark', 'text-light');

        itemPelicula.innerHTML = `
            <h5>${pelicula.title}</h5>
            <p>${pelicula.tagline}</p>
            <div class="estrellas">${obtenerEstrellas(pelicula.vote_average)}</div>
            <button class="btn btn-secondary mt-2" onclick="mostrarDetallesPelicula(${pelicula.id})">Detalles</button>
        `;

        listaPeliculas.appendChild(itemPelicula);
    });
}

function obtenerEstrellas(promedioVotos) {
    const estrellas = Math.round(promedioVotos / 2); 
    let iconosEstrellas = '';
    for (let i = 0; i < 5; i++) {
        iconosEstrellas += i < estrellas ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
    }
    return iconosEstrellas;
}

function mostrarDetallesPelicula(idPelicula) {
    const pelicula = datosPeliculas.find(p => p.id === idPelicula);
    const listaGeneros = pelicula.genres.map(genero => genero.name).join(' - ');

    const modalExistente = document.getElementById('modalDetallesPelicula');
    if (modalExistente) {
        modalExistente.remove();
    }

    const modalDetallesPelicula = `
        <div class="offcanvas offcanvas-top" id="modalDetallesPelicula">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">${pelicula.title}</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <p>${pelicula.overview}</p>
                <hr class="divisor-genero" /> <!-- Línea divisoria aquí -->
                <div class="d-flex justify-content-between align-items-center">
                    <span>${listaGeneros}</span>
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Más
                    </button>
                    <ul class="dropdown-menu">
                        <li><strong>Año:</strong> ${pelicula.release_date.split('-')[0]}</li>
                        <li><strong>Duración:</strong> ${pelicula.runtime} mins</li>
                        <li><strong>Presupuesto:</strong> $${pelicula.budget}</li>
                        <li><strong>Ingresos:</strong> $${pelicula.revenue}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalDetallesPelicula);

    const offcanvas = new bootstrap.Offcanvas(document.getElementById('modalDetallesPelicula'));
    offcanvas.show();
}
