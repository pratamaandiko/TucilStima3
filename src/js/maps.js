let outputField = document.getElementById("output");
let addMarksButton = document.getElementById("addMarksButton");
let clearMarksButton = document.getElementById("clearMarksButton");


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
  var marker = new L.marker(e.latlng);
      map.addLayer(marker);
      markers.push(marker);
}

//menambah mark
addMarksButton.addEventListener('click', function(){
  if (addMarksButton.innerHTML === "Tambah mark") {
    map.addEventListener('click',addMark);
    addMarksButton.innerHTML = "Selesai";
  }else{
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