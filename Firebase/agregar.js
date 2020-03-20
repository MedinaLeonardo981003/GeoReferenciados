formula.addEventListener('submit',(e)=> {
    e.preventDefault();
    var registro = new Registro(null,formula.nombre.value,formula.codigo.value);
    registro.agregar();
    formula.nombre.value ='';
    formula.codigo.value ='';
    $('#ventananuevo').modal('hide');
});

