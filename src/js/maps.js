let outputField = document.getElementById("output");
let addMarksButton = document.getElementById("addMarksButton");
let clearMarksButton = document.getElementById("clearMarksButton");
let connectMarksButton1 = document.getElementById("connectMarksButton1");
let connectMarksButton2 = document.getElementById("connectMarksButton2");
let legendAddMark = document.getElementById("legendAddMark");
let legendConnectMark = document.getElementById("legendConnectMark");
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
var lines = [];

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
    legendAddMark.classList.remove('hide');
    map.addEventListener('click',addMark);
    addMarksButton.innerHTML = "Selesai";
  }else{
    connectMarksButton1.classList.remove('hide');
    legendAddMark.classList.add('hide');
    map.removeEventListener('click',addMark);
    addMarksButton.innerHTML = "Tambah mark";
  }

})

//menghapus semua mark
clearMarksButton.addEventListener('click',function(){
  for(i=0;i<markers.length;i++) {
    map.removeLayer(markers[i]);
    }
  for (let i = 0; i < lines.length; i++) {
    map.removeLayer(lines[i]);
  }  
    markers = [];
    lines = [];
})
var polylinePoints = [];
function tandaiMark(e) {
  e.originalEvent.target.classList.toggle('markDipilih');
  polylinePoints.push([e.latlng.lat,e.latlng.lng]);
}

function connectMark() {
  if (polylinePoints.length != 0) {
        
  }
  var polyline = new L.polyline(polylinePoints, {
    color: '#522546',
    smoothFactor: 1
  });

  for(let i=0;i<markers.length;i++) {
    markers[i]._icon.firstChild.classList.remove('markDipilih');
    }
  map.addLayer(polyline);
  polylinePoints = [];
  lines.push(polyline);  
}
connectMarksButton1.addEventListener('click', function(){
  if (connectMarksButton1.innerHTML === "Hubungkan mark") {
    addMarksButton.classList.add('hide');
    clearMarksButton.classList.add('hide');
    legendConnectMark.classList.remove('hide');
    connectMarksButton2.classList.remove('hide');
    connectMarksButton1.innerHTML = "Selesai";
    map.addEventListener('click',tandaiMark);
    connectMarksButton2.addEventListener('click', connectMark);
  }else{
    map.removeEventListener('click',tandaiMark);
    connectMarksButton2.removeEventListener('click', connectMark);
    addMarksButton.classList.remove('hide');
    clearMarksButton.classList.remove('hide');
    connectMarksButton2.classList.add('hide');
    legendConnectMark.classList.add('hide');
    connectMarksButton1.innerHTML = "Hubungkan mark";
  }
  
})