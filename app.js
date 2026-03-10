// app.js
document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos del DOM
  const modal = document.getElementById('modalTyC');
  const aceptarBtn = document.getElementById('aceptarTyC');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const mainContent = document.getElementById('mainContent');
  const verTyCModal = document.getElementById('verTyCModal');
  const comprarBtn = document.getElementById('comprarBtn');
  const formularioSection = document.getElementById('formularioSection');
  const volverBtn = document.getElementById('volverBtn');
  
  // Elementos del selector
  const cantidadInput = document.getElementById('cantidad');
  const decrementBtn = document.getElementById('decrementBtn');
  const incrementBtn = document.getElementById('incrementBtn');
  const totalPagar = document.getElementById('totalPagar');
  
  // Elementos del contador
  const diasEl = document.getElementById('dias');
  const horasEl = document.getElementById('horas');
  const minutosEl = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  
  // Constantes
  const PRECIO_BOLETO = 25; // 25 Bolívares
  const MIN_BOLETOS = 2;
  const MAX_BOLETOS = 50;
  
  // Variable para el archivo
  const archivoInput = document.getElementById('comprobante');
  const archivoNombre = document.querySelector('.archivo-nombre');
  
  // ===========================================
  // MODAL TÉRMINOS Y CONDICIONES
  // ===========================================
  
  // Verificar si ya aceptó antes
  const tycAceptado = localStorage.getItem('tycAceptado');
  
  if (!tycAceptado) {
    modal.classList.remove('hidden');
    mainContent.classList.add('hidden');
  } else {
    mainContent.classList.remove('hidden');
  }
  
  // Aceptar términos
  aceptarBtn.addEventListener('click', function() {
    localStorage.setItem('tycAceptado', 'true');
    modal.classList.add('hidden');
    mainContent.classList.remove('hidden');
  });
  
  // Cerrar modal
  closeModalBtn.addEventListener('click', function() {
    if (!localStorage.getItem('tycAceptado')) {
      // Si no ha aceptado, no puede cerrar
      alert('Debes aceptar los términos y condiciones para continuar');
    } else {
      modal.classList.add('hidden');
    }
  });
  
  // Ver términos desde el formulario
  if (verTyCModal) {
    verTyCModal.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.remove('hidden');
    });
  }
  
  // ===========================================
  // BOTÓN COMPRAR TICKETS (muestra el formulario)
  // ===========================================
  
  comprarBtn.addEventListener('click', function() {
    // Scroll suave hasta el formulario
    formularioSection.classList.remove('hidden');
    formularioSection.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Botón Volver (oculta el formulario)
  volverBtn.addEventListener('click', function() {
    formularioSection.classList.add('hidden');
    // Scroll hasta arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // ===========================================
  // SELECTOR DE CANTIDAD
  // ===========================================
  
  function actualizarTotal() {
    let cantidad = parseInt(cantidadInput.value, 10);
    
    if (isNaN(cantidad) || cantidad < MIN_BOLETOS) {
      cantidad = MIN_BOLETOS;
    }
    if (cantidad > MAX_BOLETOS) {
      cantidad = MAX_BOLETOS;
    }
    
    cantidadInput.value = cantidad;
    
    const total = cantidad * PRECIO_BOLETO;
    totalPagar.textContent = total.toFixed(2) + ' Bs.';
    
    // Guardar en localStorage
    localStorage.setItem('cantidadSeleccionada', cantidad);
  }
  
  decrementBtn.addEventListener('click', function() {
    let valor = parseInt(cantidadInput.value, 10) || MIN_BOLETOS;
    if (valor > MIN_BOLETOS) {
      cantidadInput.value = valor - 1;
      actualizarTotal();
    }
  });
  
  incrementBtn.addEventListener('click', function() {
    let valor = parseInt(cantidadInput.value, 10) || MIN_BOLETOS;
    if (valor < MAX_BOLETOS) {
      cantidadInput.value = valor + 1;
      actualizarTotal();
    }
  });
  
  cantidadInput.addEventListener('change', actualizarTotal);
  
  // Cargar cantidad guardada
  const cantidadGuardada = localStorage.getItem('cantidadSeleccionada');
  if (cantidadGuardada) {
    cantidadInput.value = Math.min(MAX_BOLETOS, Math.max(MIN_BOLETOS, parseInt(cantidadGuardada, 10)));
  }
  actualizarTotal();
  
  // ===========================================
  // CONTADOR REGRESIVO
  // ===========================================
  
  // Fecha del sorteo: 9 de marzo de 2026, 22:00 (10:00pm)
  const fechaSorteo = new Date(2026, 2, 9, 22, 0, 0); // Marzo es mes 2 en JS (0-index)
  
  function actualizarContador() {
    const ahora = new Date();
    const diferencia = fechaSorteo - ahora;
    
    if (diferencia <= 0) {
      // Sorteo ya pasó
      diasEl.textContent = '00';
      horasEl.textContent = '00';
      minutosEl.textContent = '00';
      segundosEl.textContent = '00';
      return;
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    diasEl.textContent = dias.toString().padStart(2, '0');
    horasEl.textContent = horas.toString().padStart(2, '0');
    minutosEl.textContent = minutos.toString().padStart(2, '0');
    segundosEl.textContent = segundos.toString().padStart(2, '0');
  }
  
  // Actualizar cada segundo
  actualizarContador();
  setInterval(actualizarContador, 1000);
  
  // ===========================================
  // MANEJO DE ARCHIVO (mostrar nombre)
  // ===========================================
  
  if (archivoInput) {
    archivoInput.addEventListener('change', function(e) {
      if (this.files && this.files.length > 0) {
        archivoNombre.textContent = this.files[0].name;
        
        // Validar tamaño (máx 10 MB)
        if (this.files[0].size > 10 * 1024 * 1024) {
          alert('El archivo es demasiado grande. Máximo 10 MB.');
          this.value = '';
          archivoNombre.textContent = 'Sin archivos seleccionados';
        }
        
        // Validar tipo
        const tipo = this.files[0].type;
        if (!tipo.match(/image\/(jpeg|png)|application\/pdf/)) {
          alert('Solo se permiten archivos JPG, PNG o PDF');
          this.value = '';
          archivoNombre.textContent = 'Sin archivos seleccionados';
        }
      } else {
        archivoNombre.textContent = 'Sin archivos seleccionados';
      }
    });
  }
  
  // ===========================================
  // MANEJO DE CHECKBOXES CÉDULA (V/E)
  // ===========================================
  
  const cedula1 = document.getElementById('cedula1');
  const cedula2 = document.getElementById('cedula2');
  
  if (cedula1 && cedula2) {
    cedula1.addEventListener('change', function() {
      if (this.checked) {
        cedula2.checked = false;
      }
    });
    
    cedula2.addEventListener('change', function() {
      if (this.checked) {
        cedula1.checked = false;
      }
    });
  }
  
  // ===========================================
  // SIMULACIÓN DE BARRA DE PROGRESO (QUEDAN 61%)
  // ===========================================
  
  function actualizarProgreso() {
    const porcentajeRestante = 61; // Fijo como en la imagen
    const barra = document.querySelector('.barra-llenado');
    if (barra) {
      barra.style.width = (100 - porcentajeRestante) + '%';
    }
  }
  
  actualizarProgreso();
  
  // ===========================================
  // PREVENIR ENVÍO DEL FORMULARIO (solo demo)
  // ===========================================
  
  const btnEnviar = document.getElementById('btnEnviar