 const listaloggedout = document.querySelectorAll('.logged-out');
 const listaloggedin = document.querySelectorAll('.logged-in');
 const datosdelacuenta = document.querySelector('.datosdelacuenta');
 const account = document.getElementById('raccount');
 const mapinfo = document.getElementById('map');
 const reunionesdelacuenta = document.querySelector('.reunionesdelacuenta');

 const configuraMenu = (user) => {
   if (user) {
     db.collection('usuarios').doc(user.uid).get().then(doc => {
       const html = `
                <p>Nombre: ${ doc.data().nombre }</p>
                <p>Correo: ${ user.email}</p>
            `;
       const html1 = `
            <p>${ user.email},</p>
        `;
       datosdelacuenta.innerHTML = html;
       account.innerHTML = html1;
     });
     arreglo = [];
     var emialuser = user.email;
     var count = 0;
     db.collection('reuniones').get().then(doc => {
       doc.docs.forEach(doc => {
         //console.log(doc.id);
         if (doc.data().email == emialuser) {
           data = {
             "ID": doc.id,
             "email": doc.data().email,
             "nombre": doc.data().nombre
           };
           arreglo.push(data);

           for (i = 0; i < arreglo.length; i++) {
             var nodo = document.createElement("p");

             nodo.innerHTML = " Id: " + arreglo[i].ID + "  Reunion: " + arreglo[i].nombre + "." + "."
             console.log("este es el contador de g  " + i);
             document.getElementById("childpid").appendChild(nodo);
           }
           console.log("se salio  " +  i);
         } else {
           //console.log("No entro if")
         }
         //console.log("No entro for")
       });
       //console.warn(arreglo);
     })

     iniciaMapa();
     listaloggedin.forEach(item => item.style.display = 'block');
     listaloggedout.forEach(item => item.style.display = 'none');

   } else {
     datosdelacuenta.innerHTML = '';
     mapinfo.innerHTML = "";
     listaloggedin.forEach(item => item.style.display = 'none');
     listaloggedout.forEach(item => item.style.display = 'block');
   }
 }


 function iniciaMapa() {

   var propiedades = {
     center: {
       lat: 21.152639,
       lng: -101.711598
     },
     zoom: 12

   };

   var mapa = document.getElementById("map");

   var map = new google.maps.Map(mapa, propiedades);

   var icono = {
     url: "./img/gps.png",
     scaledSize: new google.maps.Size(25, 25),
     origin: new google.maps.Point(0, 0),
     anchor: new google.maps.Point(0, 0)
   };

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


   if (navigator.geolocation) {

     watchId = navigator.geolocation.watchPosition(function (position) {
       var lat = position.coords.latitude;
       var lng = position.coords.longitude;

       console.log(position);

       var coordenadas = lat + ',' + lng;

       /*var velocidad = position.coords.speed ? position.coords.speed : 'no disponible';
       var fechayhora = (new Date(position.timestamp)).toString();


       const html2 = `
                  <p>Velocidad: ${ velocidad }</p>
                  <p>Fecha y hora: ${ fechayhora }</p>
              `;

       mapinfo.innerHTML = html2;*/

       marker.setPosition(new google.maps.LatLng(lat, lng));
       map.panTo(new google.maps.LatLng(lat, lng));

     }, error, positionOptions);
   }


   function error(positioError) {
     console.log(positioError.messsage);
   }
 }