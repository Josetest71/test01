import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avances';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            // Request hacia /tareas/:id

            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })

        }
        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement;
            const id = tareaHTML.dataset.tarea;
            const url = `${location.origin}/tareas/${id}`;

            Swal.fire({
                title: '¿Deseas eliminar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'No, cancelar!',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar el delete por medio de axios
                    axios.delete(url, { params: {id} })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                actualizarAvance();
                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )
                            }
                        });
                }
            })
        }
    });
}

export default tareas;