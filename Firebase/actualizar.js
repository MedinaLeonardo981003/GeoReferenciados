editar.addEventListener('submit',(e)=> {
    e.preventDefault();

    let id =editar.ideditar.value;
    let nombre =editar.nombreeditar.value;
    let codigo =editar.codigoeditar.value;

    var registro = new Registro(id,nombre,codigo);

    registro.actualizar();

    var idregistro = document.getElementById(id);
    idregistro.querySelector('.nombre').value = nombre + ' ';
    idregistro.querySelector('.codigo').value = codigo + ' ' ;

    editar.nombreeditar.value ='';
    editar.codigoeditar.value ='';

    $('#ventanaeditar').modal('hide');
});