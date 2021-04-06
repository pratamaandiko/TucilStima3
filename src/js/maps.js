let outputField = document.getElementById("output");
let addMarksButton = document.getElementById("addMarksButton");
let clearMarksButton = document.getElementById("clearMarksButton");
let connectMarksButton1 = document.getElementById("connectMarksButton1");
let connectMarksButton2 = document.getElementById("connectMarksButton2");
let markobjects = document.querySelectorAll(".mark");

  // Keperluan maps

  //inisialisasi map
  var mapOptions = {
    center: [-6.890542682727725,107.61091659207523],
    zoom: 16
 }
var map = new L.map('mapid', mapOptions);
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
 map.addLayer(layer);

 //add marker
//  var marker = L.marker([-6.890542682727725,107.61091659207523]).addTo(map);
//  marker.bindPopup('<b>Institut Teknologi Bandung</b><br>Jl. Ganesa No.10, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132');
// var markers = L.markerClusterGroup();

//tambah mark
var markers = [];

function addMark(e) {


  var marker = new L.marker(e.latlng, {
    icon: L.divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -36],
      html: `<span class="mark tampilanmark1"> <span class="text-below-marker">${markers.length + 1}</span></span>`
      })
  });
      map.addLayer(marker);
      markers.push(marker);
      markobjects = document.querySelectorAll(".mark");
}

//menambah mark
addMarksButton.addEventListener('click', function(){
  if (addMarksButton.innerHTML === "Tambah mark") {
    connectMarksButton1.classList.add('hide');
    map.addEventListener('click',addMark);
    addMarksButton.innerHTML = "Selesai";
  }else{
    connectMarksButton1.classList.remove('hide');
    map.removeEventListener('click',addMark);
    addMarksButton.innerHTML = "Tambah mark";
  }

})

//menghapus semua mark
clearMarksButton.addEventListener('click',function(){
  for(i=0;i<markers.length;i++) {
    map.removeLayer(markers[i]);
    }
    markers = [];
})

connectMarksButton1.addEventListener('click', function(){
  var polylinePoints = [];
  if (connectMarksButton1.innerHTML === "Hubungkan mark") {
    addMarksButton.classList.add('hide');
    clearMarksButton.classList.add('hide');
    connectMarksButton2.classList.remove('hide');
    connectMarksButton1.innerHTML = "Selesai";
    map.addEventListener('click',function (e) {
      console.log(e);
      e.originalEvent.target.classList.toggle('markDipilih');
      polylinePoints.push([e.latlng.lat,e.latlng.lng]);
    })
    connectMarksButton2.addEventListener('click', function() {
      console.log(polylinePoints);
      if (polylinePoints.length != 0) {
        
      }
      var polyline = new L.polyline(polylinePoints, {
        color: '#522546',
        smoothFactor: 1
      });
      map.addLayer(polyline);
      polylinePoints = [];     
      })
  }else{
    
    addMarksButton.classList.remove('hide');
    clearMarksButton.classList.remove('hide');
    connectMarksButton2.classList.add('hide');
    connectMarksButton1.innerHTML = "Hubungkan mark";
  }
  
})

// document.querySelector("#mapid > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > div:nth-child(2) > span")