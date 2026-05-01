/**
 * Función autoinvocada que inicializa el comportamiento del portafolio.
 * Maneja la visualización de proyectos, animaciones de entrada y expansión/colapso de la cuadrícula.
 */
(function () {
    var grid = document.querySelector('#portafolio .grid');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var btn = document.getElementById('showAllProjectsBtn');

    // Agrega la clase de preparación para la animación a todas las tarjetas
    cards.forEach(function (card) {
        card.classList.remove('is-hidden');
        card.classList.add('reveal-seed');
    });

    /**
     * Observador de intersección para activar las animaciones de revelado
     * cuando las tarjetas entran en el área visible del navegador.
     */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    // Inicializa las primeras 3 tarjetas y oculta el resto
    cards.forEach(function (card, i) {
        if (i < 3) observer.observe(card);
        else card.classList.add('is-hidden');

        // Manejador de clic para cada tarjeta
        card.addEventListener('click', function () {
            // Solo funciona si el grid está expandido (una sola columna)
            if (grid.classList.contains('is-expanded')) {
                var isActive = card.classList.contains('is-active');

                // Desactiva cualquier otra tarjeta activa
                cards.forEach(function (c) { c.classList.remove('is-active'); });

                // Si no estaba activa, la activa
                if (!isActive) {
                    card.classList.add('is-active');
                }
            }
        });
    });

    /**
     * Muestra todos los proyectos ocultos con una animación escalonada.
     * Actualiza el estado del botón y cambia su funcionalidad a 'colapsar'.
     */
    /**
     * Aplica la técnica FLIP para animar el reordenamiento de las tarjetas.
     * @param {Function} changeLayoutFn - Función que realiza el cambio de layout.
     */
    function animateReorder(changeLayoutFn) {
        // 1. FIRST: Guardar posiciones iniciales
        var firstPositions = cards.map(function (card) {
            return card.getBoundingClientRect();
        });

        // 2. LAST: Cambiar el layout
        changeLayoutFn();

        // 3. INVERT & PLAY
        requestAnimationFrame(function () {
            cards.forEach(function (card, i) {
                if (card.classList.contains('is-hidden')) return;

                var lastPos = card.getBoundingClientRect();
                var firstPos = firstPositions[i];

                // Solo animamos si la tarjeta ya era visible
                if (firstPos.width > 0) {
                    var dx = firstPos.left - lastPos.left;
                    var dy = firstPos.top - lastPos.top;

                    // Invertir: Forzar a la posición inicial sin transición
                    card.style.transition = 'none';
                    card.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

                    // Play: Activar transición y limpiar transform
                    requestAnimationFrame(function () {
                        card.style.transition = '';
                        card.style.transform = '';
                    });
                }
            });
        });
    }

    /**
     * Muestra todos los proyectos ocultos con una animación física de reordenamiento.
     */
    function showAll() {
        btn.setAttribute('aria-expanded', 'true');

        animateReorder(function () {
            grid.classList.add('is-expanded');

            var hidden = cards.filter(function (c, i) { return i >= 3 && c.classList.contains('is-hidden'); });
            hidden.forEach(function (card, idx) {
                card.classList.remove('is-hidden');
                card.classList.add('reveal-seed');

                // Los nuevos aparecen después de que los primeros se han movido un poco
                setTimeout(function () {
                    requestAnimationFrame(function () {
                        card.classList.add('reveal-in');
                    });
                }, 400 + (idx * 100));
            });
        });

        btn.textContent = 'Mostrar menos';
        btn.removeEventListener('click', onClick);
        btn.addEventListener('click', collapseAll);
    }

    /**
     * Oculta los proyectos adicionales con una animación física de reordenamiento.
     * Desplaza la página hacia el inicio de la sección del portafolio.
     * @param {Event} e - El evento de clic.
     */
    function collapseAll(e) {
        if (e) e.preventDefault();
        btn.setAttribute('aria-expanded', 'false');

        // Desplazar suavemente hacia el inicio de la sección del portafolio
        var portfolioSection = document.getElementById('portafolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Desactivar cualquier tarjeta activa al colapsar
        cards.forEach(function (card) {
            card.classList.remove('is-active');
        });

        // Ocultar los extras primero con animación
        cards.forEach(function (card, i) {
            if (i >= 3) {
                card.classList.remove('reveal-in');
                card.classList.add('reveal-seed');
            }
        });

        // Esperar un poco a que se desvanezcan antes de reordenar los primeros 3
        setTimeout(function () {
            animateReorder(function () {
                grid.classList.remove('is-expanded');
                cards.forEach(function (card, i) {
                    if (i >= 3) card.classList.add('is-hidden');
                });
            });
        }, 300);

        btn.textContent = 'Ver todos los proyectos';
        btn.removeEventListener('click', collapseAll);
        btn.addEventListener('click', onClick);
    }

    /**
     * Manejador del evento clic inicial para mostrar todos los proyectos.
     * @param {Event} e - El evento de clic.
     */
    function onClick(e) {
        e.preventDefault();
        showAll();
    }

    // Registra el evento de clic inicial en el botón
    btn.addEventListener('click', onClick);
})();
