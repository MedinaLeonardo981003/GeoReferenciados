 const listaloggedout = document.querySelectorAll('.logged-out');
 const listaloggedin = document.querySelectorAll('.logged-in');
 const datosdelacuenta = document.querySelector('.datosdelacuenta');
 const account = document.getElementById('raccount');
 const mapinfo = document.getElementById('map');
 const reunionesdelacuenta = document.querySelector('.reunionesdelacuenta');
 const correodrop = document.getElementById('correodrop');
 const correoenter = document.getElementById('correoenter');
 const viewemail = document.getElementById("viewemail");
 var buttonAppear = document.getElementById("buttonAppear");
 var cosiem;
 const arre = [];
 const namaewas = document.getElementById("namaewa");

 //Esta funcion se encarga de configurar el menu cuando el usuario inicia sesion o cuando la sesion esta cerrada.
 const configuraMenu = (user) => {
   namaewas.innerHTML = "";
   //Se confirma que el usuario este autenticado.
   if (user) {
     //Se toma la informacion de firebase.
     db.collection('usuarios').doc(user.uid).get().then(doc => {
       //Se agrega la informacion traida de firebase
       const html = `
                <p>Nombre: ${ doc.data().nombre }</p
                <p>Correo: ${ user.email}</p>
            `;
       const html1 = `
            <p>${ user.email},</p>
        `;
       var datito = {
         "nombre": doc.data().nombre
       }

       //Se le inserta la informacion al arreglo
       arre.push(datito);
       cosiem = arre[0].nombre;

       //Se agrega a casillas de texto la informacion traida de firebase..
       namaewas.innerHTML = '';
       namaewas.innerHTML = cosiem;
       datosdelacuenta.innerHTML = html;
       account.innerHTML = html1;
       correodrop.innerHTML = html1;
       correoenter.innerHTML = html1;
       viewemail.innerHTML = html1;
     });
     //Se crea un arreglo para crear la lista de reuniones.
     arreglo = [];

     //Se iguala una variable al correo del usuario autenticado.
     var emialuser = user.email;

     var count = 0;
     console.log("Exito");
     //Se obtiene la informacion desde firebase.
     db.collection('reuniones').get().then(doc => {
       doc.docs.forEach(doc => {
         //Se compara que los correos sean identicos
         if (doc.data().email == emialuser) {
           //Se guarda la informacion traida de firebase.
           data = {
             "ID": doc.id,
             "email": doc.data().email,
             "nombre": doc.data().nombre,
             "codigo": doc.data().codigo
           };
           //Se agrega la informacion en el arreglo.
           arreglo.push(data);
           //Se hac un ciclo para que traiga todas las reuniones existentes
           while (count < arreglo.length) {
             var nodo = document.createElement("p");
             nodo.innerHTML = "Nombre de la reunion: " + arreglo[count].nombre + " | Codigo: " + arreglo[count].codigo + " |";
             document.getElementById("childpid").appendChild(nodo);
             count = count + 1;
           }
         } else {}
       });
     })


     //Se llama a la funcion que inicia mapa.
     iniciaMapa();
     //Se modifica el moddal para ocultar el modal de la ventana de login
     listaloggedin.forEach(item => item.style.display = 'block');
     listaloggedout.forEach(item => item.style.display = 'none');
   } else {
     //Se vacia la informacion.
     datosdelacuenta.innerHTML = '';
     mapinfo.innerHTML = "";
     buttonAppear.innerHTML = '';
     namaewas.innerHTML = '';
     //Se modifica el moddal para ocultar el modal de la ventana de home
     listaloggedin.forEach(item => item.style.display = 'none');
     listaloggedout.forEach(item => item.style.display = 'block');
   }
 }


 //Funcion que carga el mapa al momento de iniciar sesion, con el  watchposition funcionando
 function iniciaMapa() {

   //Se crean las propiedades que se usaran en el mapa.
   var propiedades = {
     center: {
       lat: 21.152639,
       lng: -101.711598
     },
     zoom: 12

   };

   //Se genera la variable que tiene el mapa guardado.
   var mapa = document.getElementById("map");

   //Se crea el mapa con sus propiedades.
   var map = new google.maps.Map(mapa, propiedades);

   //Se crea un icono a mostrar en el mapa.
   var icono = {
     url: "./img/stick.png",
     scaledSize: new google.maps.Size(25, 25),
     origin: new google.maps.Point(0, 0),
     anchor: new google.maps.Point(0, 0)
   };

   //Se crea un marcador que tendra el icono que se mostrara, aqui se insertaran las coordenadas.
   var marker = new google.maps.Marker({
     position: {
       lat: 0,
       lng: 0
     },
     icon: icono,
     map: map
   });

   //Se crea una variable nula, para la ubiccion en tiempo real.
   var watchId = null;


   //Se crean las variables de recarga del WatchPosition.
   var positionOptions = {
     enableHighAccuracy: true,
     timeout: 5 * 1000, //5 segundos
     maximumAge: 30 * 1000 //30 segundos
   };

   //Creacion variable para almacenar info de marcador
   informacion = new google.maps.InfoWindow;

   //Se obtienen las coordenadas del navegador.
   if (navigator.geolocation) {

     //Se agregan las coordenas al  WatchPosition .
     watchId = navigator.geolocation.watchPosition(function (position) {
       var lat = position.coords.latitude;
       var lng = position.coords.longitude;

       console.log(position);

       var pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       }
       //Se guardan la coordenadas obtenidas.
       var coordenadas = lat + ',' + lng;

       //Se implementan las coordenadas en el marcador
       marker.setPosition(new google.maps.LatLng(lat, lng));
       informacion.setPosition(pos);
       informacion.setContent(cosiem);
       informacion.open(map);
       map.panTo(new google.maps.LatLng(lat, lng));

     }, error, positionOptions);
   }

   //Error para obtener la posicion.
   function error(positioError) {
     //console.log(positioError.messsage);
   }
 }

 //Funcion que permite refrescar la pagina
 function refreshPage() {
   window.location.reload();
 }