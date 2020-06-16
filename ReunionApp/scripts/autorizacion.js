auth.onAuthStateChanged(user => {

    if (user) {
        //console.log('Usuario entró');
        configuraMenu(user);
        var name, email;

        name = user.displayName;
        email = user.email;

        //console.log(name, email);

    } else {
        //console.log('Usuario salió');
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
const formaAct = document.getElementById("childpid");

formaAdd.addEventListener('submit', (e) => {
    e.preventDefault();

    var user = firebase.auth().currentUser;
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

    var length = 5;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }


    addEventListener('submit', (e) => {
        e.preventDefault();
        db.collection('reuniones').add({
            nombre: formaAdd['rnombre'].value,
            email: emails4,
            latitud: lat5,
            longitud: long5,
            codigo: result
        });


        $('#addreunionmodal').modal('hide');
        formaAdd.reset();
        formaAdd.querySelector('.error').innerHTML = '';
        alert("Reunion creada con exito");

        formaAct.innerHTML = '';
        configuraMenu(user);
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


const formaDrop = document.getElementById('formaDrop');
const formaAct2 = document.getElementById("childpid");

formaDrop.addEventListener('submit', (e) => {
    e.preventDefault();


    var user = firebase.auth().currentUser;
    var drop = document.getElementById("correodrop");
    var drop1 = drop.outerHTML;
    var drop2 = drop1.substring("49")
    var drop3 = drop2.substring("13", drop2.indexOf(','));


    var codigo = formaDrop['codigo'].value

    var arr, arr2, arr3;

    arreglos = [];
    db.collection('reuniones').get().then(doc => {
        doc.docs.forEach(doc => {
            //console.log(doc.id);
            if (doc.data().codigo == codigo) {
                data = {
                    "email": doc.data().email,
                };
                arreglos.push(data);
                arr = JSON.stringify(arreglos);
                //console.log(arr)       
                arr2 = arr.substring("11")
                arr3 = arr2.substring("0", arr2.indexOf('"'))
            }
        })


        console.log(arr3)
        if (user.email == arr3) {
            // User is signed in.

            if (codigo != null) {

                var dele = db.collection("reuniones").where("codigo", "==", codigo);

                if (codigo != dele) {
                    console.log(" 1 ");
                    dele.get().then(function (querySnapshot) {
                        console.log(" 2 ");
                        querySnapshot.forEach(function (doc) {
                            console.log(" 3 ");
                            doc.ref.delete();
                        });
                    });

                    $('#dropreunionmodal').modal('hide');
                    formaDrop.reset();
                    formaDrop.querySelector('.error').innerHTML = '';
                    alert("Reunion eliminada con exito");

                    formaAct2.innerHTML = '';
                    configuraMenu(user);
                } else {

                }
            } else {

            }
        } else {
            alert("Tienes que ser el creador de esta reunion para poder eliminarla");
        }
    })
})



const formaEnter = document.getElementById('formaEnter');
const latit = document.getElementById('lati');
const longit = document.getElementById('longi');
var mapita = document.getElementById("map");

formaEnter.addEventListener('submit', (e) => {
    e.preventDefault();

    var mapa = document.getElementById("map");
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var user = firebase.auth().currentUser;
    array1 = [];
    array2 = [];


    var codigos = formaEnter['codigo'].value
    if (codigo != null) {
        var code = db.collection("reuniones").where("codigo", "==", codigos);
        if (codigos != code) {
            code.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    data1 = {
                        "latitud": doc.data().latitud,
                    };
                    data2 = {
                        "longitud": doc.data().longitud,
                    };
                });
                array1.push(data1);
                array2.push(data2);



                var array3 = parseFloat(array1[0].latitud);
                console.log("array3 " + array3)

                var array4 = parseFloat(array2[0].longitud);
                console.log("array4 " + array4)




                mapa.innerHTML = '';




                var propiedades = {
                    center: {
                        lat: 21.152639,
                        lng: -101.711598
                    },
                    zoom: 12

                };



                var map = new google.maps.Map(mapa, propiedades);

                var icono = {
                    url: "./img/gps.png",
                    scaledSize: new google.maps.Size(25, 25),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };

                var markers = new google.maps.Marker({
                    position: {
                        lat: array3,
                        lng: array4
                    },
                    icon: icono,
                    map: map
                });

                markers.setPosition(new google.maps.LatLng(array3, array4));



                var marker = new google.maps.Marker({
                    position: {
                        lat: 0,
                        lng: 0
                    },
                    icon: icono,
                    map: map
                });

                var watchId = null;


                var positionOptions = {
                    enableHighAccuracy: true,
                    timeout: 10 * 1000, //10 segundos
                    maximumAge: 30 * 1000 //30 segundos
                };

                const latii;
                const longii;

                if (navigator.geolocation) {

                    watchId = navigator.geolocation.watchPosition(function (position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;

                        console.log(position);

                        var coordenadas = lat + ',' + lng;


                        marker.setPosition(new google.maps.LatLng(lat, lng));
                        map.panTo(new google.maps.LatLng(lat, lng));

                        latti = lat;
                        console.log('latii ' + latii)
                        longii = lng;
                        console.log('longii ' + longii)

                    }, error, positionOptions);
                


                function error(positioError) {
                    console.log(positioError.messsage);
                }




                directionsDisplay.setMap(map);

                var start = (position.coords.latitude,position.coords.longitude);
                var end = (array3,array4)
                 // Haight.
                  
                var request = {
                    origin: {
                        lat: latti,
                        lng: longii
                      },
                      destination: {
                        lat: array3,
                        lng: arrray4
                      },
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, function (result, status) {
                    console.log(status + " status")
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);
                        
                    }
                });


            }


                $('#enterreunionmodal').modal('hide');
                formaEnter.reset();
                formaEnter.querySelector('.error').innerHTML = '';
                alert("Entraste con exito a la reunion");
            });
        } else {

        }
    } else {

    }



})