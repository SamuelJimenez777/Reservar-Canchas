// ELEMENTOS

const formulario = document.getElementById("formReserva");

const listaReservas = document.getElementById("listaReservas");

const estadisticas = document.getElementById("resultadoEstadisticas");

// CARGAR RESERVAS

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// MOSTRAR AL CARGAR

mostrarReservas();

// EVENTO FORMULARIO

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    // DATOS

    const nombre = document.getElementById("nombre").value;

    const cancha = document.getElementById("cancha").value;

    const fecha = document.getElementById("fecha").value;

    const hora = document.getElementById("hora").value;

    // OBJETO

    const reserva = {

        nombre,
        cancha,
        fecha,
        hora

    };

    // AGREGAR

    reservas.push(reserva);

    // GUARDAR

    localStorage.setItem("reservas", JSON.stringify(reservas));

    // MOSTRAR

    mostrarReservas();

    // PDF

    generarPDF(reserva);

    // CSV

    generarCSV();

    // LIMPIAR

    formulario.reset();

});

// FUNCIÓN MOSTRAR

function mostrarReservas(){

    listaReservas.innerHTML = "";

    reservas.forEach(function(reserva){

        const div = document.createElement("div");

        div.classList.add("reserva-item");

        div.innerHTML = `

            <h3>⚽ ${reserva.cancha}</h3>

            <p><strong>Cliente:</strong> ${reserva.nombre}</p>

            <p><strong>Fecha:</strong> ${reserva.fecha}</p>

            <p><strong>Hora:</strong> ${reserva.hora}</p>

        `;

        listaReservas.appendChild(div);

    });

}

// PDF

function generarPDF(reserva){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Reserva Confirmada", 20, 20);

    doc.setFontSize(12);

    doc.text(`Cliente: ${reserva.nombre}`, 20, 50);

    doc.text(`Cancha: ${reserva.cancha}`, 20, 70);

    doc.text(`Fecha: ${reserva.fecha}`, 20, 90);

    doc.text(`Hora: ${reserva.hora}`, 20, 110);

    doc.save("reserva.pdf");

}

// CSV

function generarCSV(){

    let contenido = "Nombre,Cancha,Fecha,Hora\n";

    reservas.forEach(function(reserva){

        contenido += `${reserva.nombre},${reserva.cancha},${reserva.fecha},${reserva.hora}\n`;

    });

    const blob = new Blob([contenido], {

        type: "text/csv"

    });

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(blob);

    enlace.download = "reservas.csv";

    enlace.click();

}

// ESTADÍSTICAS

function mostrarEstadisticas(){

    let contador = {};

    reservas.forEach(function(reserva){

        contador[reserva.hora] = (contador[reserva.hora] || 0) + 1;

    });

    let resultado = "";

    for(let hora in contador){

        resultado += `

            <div class="reserva-item">

                <h3>${hora}</h3>

                <p>${contador[hora]} reservas</p>

            </div>

        `;

    }

    estadisticas.innerHTML = resultado;

}