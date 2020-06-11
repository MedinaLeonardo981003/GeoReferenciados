 const listaloggedout = document.querySelectorAll('.logged-out');
 const listaloggedin = document.querySelectorAll('.logged-in');
 const datosdelacuenta = document.querySelector('.datosdelacuenta');
 const account = document.getElementById('raccount');

 const configuraMenu = (user) => {
   if (user) {
     db.collection('usuarios').doc(user.uid).get().then(doc => {
       const html = `
                <p>Nombre: ${ doc.data().nombre }</p>
                <p>Correo: ${ user.email}</p>
            `;
       const html1 = `
            <p>${ user.email}×</p>
        `;
       datosdelacuenta.innerHTML = html;
       account.innerHTML = html1;
     });


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
       url: "https://media.giphy.com/media/1ZweHMlSaxcc32mSSu/giphy.gif",
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

     const boton = document.getElementById('boton');

     var positionOptions = {
       enableHighAccuracy: true,
       timeout: 10 * 1000, //10 segundos
       maximumAge: 30 * 1000 //30 segundos
     };


     if (navigator.geolocation) {

       boton.addEventListener('click', function () {


         watchId = navigator.geolocation.watchPosition(function (position) {
           var lat = position.coords.latitude;
           var lng = position.coords.longitude;

           console.log(position);

           var coordenadas = lat + ',' + lng;

           var exactitud = position.coords.accuracy ? position.coords.accuracy : 'no disponible';
           var altitud = position.coords.altitude ? position.coords.altitude : 'no disponible';
           var velocidad = position.coords.speed ? position.coords.speed : 'no disponible';
           var fechayhora = (new Date(position.timestamp)).toString();


           const html = `
                  <p>Coordenadas: ${ coordenadas }</p>
                  <p>Exactitud: ${ exactitud }</p>
                  <p>Altitud: ${ altitud }</p>
                  <p>Velocidad: ${ velocidad }</p>
                  <p>Fecha y hora: ${ fechayhora }</p>
              `;

           const datos = document.getElementById('datos');
           datos.innerHTML = html;

           marker.setPosition(new google.maps.LatLng(lat, lng));
           map.panTo(new google.maps.LatLng(lat, lng));

         }, error, positionOptions);
       });

       const botondetener = document.getElementById('botondetener');

       botondetener.addEventListener('click', function () {

         if (watchId !== null) {
           navigator.geolocation.clearWatch(watchId);

           const html = `
                  <p>Se detuvo el monitoreo</p>
              `;

           const datos = document.getElementById('datos');
           datos.innerHTML = html;

         }
       });

     }


     function error(positioError) {
       console.log(positioError.messsage);
     }




     listaloggedin.forEach(item => item.style.display = 'block');
     listaloggedout.forEach(item => item.style.display = 'none');


   } else {
     datosdelacuenta.innerHTML = '';
     listaloggedin.forEach(item => item.style.display = 'none');
     listaloggedout.forEach(item => item.style.display = 'block');
   }
 }