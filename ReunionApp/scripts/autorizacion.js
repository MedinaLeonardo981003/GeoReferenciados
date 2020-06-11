auth.onAuthStateChanged(user => {

    if (user) {
        console.log('Usuario entró');
        configuraMenu(user);
        var name, email;

        name = user.displayName;
        email = user.email;

        console.log(name, email);

    } else {
        console.log('Usuario salió');
        configuraMenu();
    }

});


const formaregistrate = document.getElementById('formaregistrate');

formaregistrate.addEventListener('submit', (e) => {
    e.preventDefault();

    const correos = formaregistrate['rcorreo'].value;
    const contrasena = formaregistrate['rcontrasena'].value;

    auth.createUserWithEmailAndPassword(correos, contrasena).then(cred => {

        return db.collection('usuarios').doc(cred.user.uid).set({
            nombre: formaregistrate['rnombre'].value,
            correo: formaregistrate['r2correo'].value
        });


    }).then(() => {
        $('#registratemodal').modal('hide');
        formaregistrate.reset();
        formaregistrate.querySelector('.error').innerHTML = '';
    }).catch(err => {
        formaregistrate.querySelector('.error').innerHTML = mensajeError(err.code);
    });
});


const salir = document.getElementById('salir');

salir.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        alert("El usuario ha salido del sistema");
    });

});


function mensajeError(codigo) {

    let mensaje = '';

    switch (codigo) {
        case 'auth/wrong-password':
            mensaje = 'Su contraseña no es correcta';
            break;
        case 'auth/user-not-found':
            mensaje = 'El usuario no existe o el correo no esta registrado';
            break;
        case 'auth/weak-password':
            mensaje = 'Contraseña débil debe tener al menos 6 caracteres';
            break;
        default:
            mensaje = 'Ocurrió un error al ingresar con este usuario';
    }
    return mensaje;
}

const formaingresar = document.getElementById('formaingresar');

formaingresar.addEventListener('submit', (e) => {
    e.preventDefault();
    let correo = formaingresar['correo'].value;
    let contrasena = formaingresar['contrasena'].value;

    auth.signInWithEmailAndPassword(correo, contrasena).then(cred => {

        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML = '';
    }).catch(err => {

        formaingresar.querySelector('.error').innerHTML = mensajeError(err.code);
        console.log(err);
    });

});


entrarGoogle = () => {

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {

        var token = result.credential.accessToken;
        console.log(token);

        var user = result.user;

        console.log(user);
        const html = `
                <p>Nombre: ${ user.displayName }</p>
                <p>Correo: ${ user.email}</p>
                <img src="${ user.photoURL }" width="50px">
            `;
        datosdelacuenta.innerHTML = html;

        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML = '';


        // ...
    }).catch(function (error) {
        console.log(error);
    });
}




const formaAdd = document.getElementById('formaAdd');



formaAdd.addEventListener('submit', (e) => {
    e.preventDefault();


    var emails1 = document.getElementById("raccount");
    var emails2 = emails1.outerHTML;
    var emails3 = emails2.substring("17")
    var emails4 = emails3.substring("16", emails3.indexOf('×'));
    addEventListener('submit', (e) => {
        e.preventDefault();
        db.collection('reuniones').add({
            nombre: formaAdd['rnombre'].value,
            email: emails4
        });

        $('#addreunionmodal').modal('hide');
        formaAdd.reset();
        formaAdd.querySelector('.error').innerHTML = '';
        alert("Reunion creada con exito");
    })
})















 
const formaAdd = document.getElementById('mapCanvas');


var position = [40.748774, -73.985763];

function addmarker() { 
    var latlng = new google.maps.LatLng(position[0], position[1]);
    var myOptions = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

    marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Latitude:"+position[0]+" | Longitude:"+position[1]
    });

    google.maps.event.addListener(map, 'click', function(event) {
        var result = [event.latLng.lat(), event.latLng.lng()];
        transition(result);
    });
}

//Load google map
google.maps.event.addDomListener(window, 'load', initialize);


var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;

function transition(result){
    i = 0;
    deltaLat = (result[0] - position[0])/numDeltas;
    deltaLng = (result[1] - position[1])/numDeltas;
    moveMarker();
}

function moveMarker(){
    position[0] += deltaLat;
    position[1] += deltaLng;
    var latlng = new google.maps.LatLng(position[0], position[1]);
    marker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
    marker.setPosition(latlng);
    if(i!=numDeltas){
        i++;
        setTimeout(moveMarker, delay);
    }
}


