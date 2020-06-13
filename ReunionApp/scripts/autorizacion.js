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
    var emails4 = emails3.substring("16", emails3.indexOf(','));

    var lat1 = document.getElementById("latitude_view");
    var lat2 = lat1.outerHTML;
    var lat3 = lat2.substring("17")
    var lat4 = lat3.substring("8", lat3.indexOf('|'));
    var lat5 = parseFloat(lat4);

    var long1 = document.getElementById("longitude_view");
    var long2 = long1.outerHTML;
    var long3 = long2.substring("17")
    var long4 = long3.substring("9", long3.indexOf('|'));
    var long5 = parseFloat(long4);

    addEventListener('submit', (e) => {
        e.preventDefault();
        db.collection('reuniones').add({
            nombre: formaAdd['rnombre'].value,
            email: emails4,
            latitud: lat5,
            longitud: long5
        });

        $('#addreunionmodal').modal('hide');
        formaAdd.reset();
        formaAdd.querySelector('.error').innerHTML = '';
        alert("Reunion creada con exito");
    })
})


const lati = document.getElementById('latitude_view');
const lngu = document.getElementById('longitude_view');

function iniciaMapasss() {

    var map = new google.maps.Map(document.getElementById('mapCanvas'), {
        center: {
            lat: 21.152639,
            lng: -101.711598
        },
        zoom: 15
    });


    var markersito = new google.maps.Marker({
        position: {
            lat: 21.152639,
            lng: -101.711598
        },
        map: map,
        draggable: true
    });

    google.maps.event.addListener(markersito, 'dragend', function (event) {
        var position = event.latLng;
        lati.innerHTML = markersito.getPosition().lat() + "|";
        lngu.innerHTML = markersito.getPosition().lng() + "|";
        console.log(position);
    });

}


/*const search = document.getElementById('search_input');
function initmap(){
    var searchInput = search;

    $(document).ready(function () {
      var autocomplete;
      autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode'],
      });

      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        document.getElementById('loc_lat').value = near_place.geometry.location.lat();
        document.getElementById('loc_long').value = near_place.geometry.location.lng();

        document.getElementById('latitude_view').innerHTML = near_place.geometry.location.lat();
        document.getElementById('longitude_view').innerHTML = near_place.geometry.location.lng();
      });
    });
}*/