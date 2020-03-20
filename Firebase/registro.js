class Registro {
        
    constructor(id,nombre,codigo){
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
    };

    borrar(id){                
        db.collection("productos").doc(id).delete();
    };

    agregar(){
        db.collection('productos').add({
            nombre: this.nombre,
            codigo: this.codigo
        });
    }

    editar(id){    
        editar.nombreeditar.value = this.nombre;
        editar.codigoeditar.value = this.codigo;
        editar.ideditar.value = this.id;
    };

    actualizar(){    
        db.collection('productos').doc(this.id).update({
            nombre: this.nombre,
            codigo: this.codigo
        });
    };

};