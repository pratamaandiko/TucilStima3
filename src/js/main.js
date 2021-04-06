
const inputElement = document.getElementById("fileInput");
let dropDownTitikAwal = document.getElementById("dropDownTitikAwal");
let dropDownTitikAkhir = document.getElementById("dropDownTitikAkhir");
let executeButton = document.getElementById("executeButton");
let outputField = document.getElementById("output");
let keterangan = document.getElementById("keterangan");

inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {

    //menghitung euclidan distance
      // function jarak(a,b) {
      //   var x = ((a[0] - b[0])**2 + (a[1] - b[1])**2)**0.5;
      //   return Number(x.toFixed(2));
      // }
      function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
        if (typeof miles === "undefined"){miles=false;}
        function deg2rad(deg){return deg * (Math.PI/180);}
        function square(x){return Math.pow(x, 2);}
        var r=6371; // radius of the earth in km
        lat1=deg2rad(lat1);
        lat2=deg2rad(lat2);
        var lat_dif=lat2-lat1;
        var lng_dif=deg2rad(lng2-lng1);
        var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
        var d=2*r*Math.asin(Math.sqrt(a));
        if (miles){return d * 0.621371;} //return miles
        else{return d;} //return km
      }

      //pengurutan prioritas array dari terkecil
      function add(arr,x) {
        arr.push(x);
        var n = arr.length;
        for (var i = 0; i < n-1; i++) {
          for (var j = 0; j < n-i-1; j++) {
            if (arr[j][1] < arr[j+1][1]) {
              var temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] = temp;
            }
          }
        }
      }

      // menghitung total jalur yang sudah dilalui, ekuivalen dengan g(n)
      function countPrev(prev,distance,x) {
        var total = 0;
        while(prev[x] != -1) {
          total = total + distance[x][prev[x]];
          x = prev[x];
        }
        return Number(total.toFixed(2));
      }
      
      
    
    //pemrosesan input file
    const fileList = this.files;
    var reader = new FileReader;
    reader.readAsText(fileList[0]);
    reader.onload = function() {
      var rawLog = reader.result;
      var text1 = rawLog.split("\n");
      var newtext = text1;
      for(var i = 0;i<text1.length;i++) {
        newtext[i] = text1[i].split(" ");
      }

      var n = Number(text1[0]);
      var name = [];
      var matrix = [];
      var coordinate = [];
      var dikunjungi = [];
      var distance = [];
      for (var i = 1; i<=n; i++) {
          name.push(newtext[i][0]);
          coordinate.push([newtext[i][1],newtext[i][2]]);
      }
      for (var i = 0; i<coordinate.length; i++) {
        for (var j = 0; j<coordinate[i].length; j++) {
          coordinate[i][j] = Number(coordinate[i][j]);
        }
      }
      for (var i = n+1; i <= n*2; i++) {
          matrix.push(newtext[i]);
      }
      for (var i = 0; i<matrix.length; i++) {
        for (var j = 0; j<matrix[i].length; j++) {
          matrix[i][j] = Number(matrix[i][j]);
        }
      }
      for(var i = 0;i<=n;i++) {
        dikunjungi.push(0);
      }
      for(var i = 0;i<n;i++) {
        distance.push([]);
        for(var j = 0;j<n;j++) {
          distance[i].push(0);
        }
      }
      for (var i = 0; i<n; i++) {
        for (var j = 0; j<n; j++) {
          //distance[i][j] = jarak(coordinate[i],coordinate[j]);
          distance[i][j] = Number(getDistanceFromLatLng(coordinate[i][0], coordinate[i][1], coordinate[j][0], coordinate[j][1]));
        }
      }
      console.log(name);
      console.log(coordinate);
      console.log(matrix);
      console.log(distance);

      //mengisi dropdown
      for (const nodess of name) {
        let tempOption = document.createElement('option');
        tempOption.innerText = nodess;
        tempOption.value = nodess;
        dropDownTitikAwal.appendChild(tempOption);
      }
      for (const nodess of name) {
        let tempOption = document.createElement('option');
        tempOption.innerText = nodess;
        tempOption.value = nodess;
        dropDownTitikAkhir.appendChild(tempOption);
      }

      var polylinePoints = [];
      function initMap() {
        //graph
        let graph = document.createElement('div');
        graph.id = "mapid";
        outputField.append(graph);
        keterangan.classList.remove('hide');
        var mapOptions = {
          center: coordinate[0],
          zoom: 16
        }
        globalThis.map = new L.map('mapid', mapOptions);
        var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        map.addLayer(layer);

        let myCustomColour = '#522546';
        for (let index = 0; index < coordinate.length; index++) {
          var marker = new L.marker(coordinate[index]);
          map.addLayer(marker);
          if (name[index] === dropDownTitikAwal.value) {
            myCustomColour = '#e23e57';
          }else if (name[index] === dropDownTitikAkhir.value) {
            myCustomColour = '#ffc400';
          }else{
            myCustomColour = '#522546';
          }

          const markerHtmlStyles = `
          background-color: ${myCustomColour};
          width: 3rem;
          height: 3rem;
          display: block;
          left: -1.5rem;
          top: -1.5rem;
          position: relative;
          border-radius: 3rem 3rem 0;
          transform: rotate(45deg);
          border: 1px solid #FFFFFF`

          const markerHtmlStyles2 = `
          display: block;
          left: 2.5rem;
          top: 1.5rem;
          position: relative;
          transform: rotate(-45deg);`

          L.marker(coordinate[index], {
            icon: L.divIcon({
              className: "my-custom-pin text-below-marker",
              iconAnchor: [0, 24],
              labelAnchor: [-6, 0],
              popupAnchor: [0, -36],
              html: `<span style="${markerHtmlStyles}"> <span style="${markerHtmlStyles2}"">${name[index]}</span></span>`
              })
          }).addTo(map);
        }
        for (var i = 0; i<matrix.length; i++) {
          polylinePoints = [];
          for (var j = 0; j<matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
              polylinePoints.push(coordinate[i]);
              polylinePoints.push(coordinate[j]);
              var polyline = new L.polyline(polylinePoints, {
                color: '#522546',
                smoothFactor: 1
              });
              map.addLayer(polyline);
              polylinePoints = [];
            }
          }
        }
      }

      initMap();
      //execute button event
      function execute(){
        while (outputField.firstChild) {  
            outputField.removeChild(outputField.firstChild);
          }

        initMap();
      

        outputField.append(document.createElement("br"));
        let tempOption = document.createElement('p');
        tempOption.innerHTML = "Titik awal = ";
        tempOption.innerHTML += dropDownTitikAwal.value;
        tempOption.innerHTML += ", Titik akhir = ";
        tempOption.innerHTML += dropDownTitikAkhir.value;
        outputField.appendChild(tempOption);
        astar(dropDownTitikAwal.value,dropDownTitikAkhir.value,name,matrix,distance);
        //algoritma A*
        function astar(awal,akhir,name,matrix,distance) {
          var t1,t2;
          var dikunjungi = [];
          var prio = [];
          var prev = [];
          var found = 0;
          for(var i = 0;i<name.length;i++) {
            if(awal == name[i]) {
              t1 = i;
            }
            if(akhir == name[i]) {
              t2 = i;
            }
          }
          for(var i = 0;i<name.length;i++) {
            dikunjungi.push(0);
          }
          for(var i = 0;i<name.length;i++) {
            prev.push(-1);
          }
          add(prio,[t1,distance[t1][t2]]);
          while(found == 0 && prio.length != 0) {
            for(var i = 0;i<prio.length;i++) {
              prio[i] = prio[i];
            }
            var simpul = prio.pop();
            dikunjungi[simpul[0]] = 1;
            if(simpul[0] == t2) {
              found = 1;

            }
            else {
              for(var i = 0;i<matrix[simpul[0]].length;i++) {
                if(dikunjungi[i] == 0 && matrix[simpul[0]][i] == 1) {
                  prev[i] = simpul[0];
                  var estimate = Number((countPrev(prev,distance,i) + distance[i][t2]).toFixed(2));
                  add(prio,[i,estimate]);     
                }
              }
            }
            
          }
          if(found == 1) {
            var result = [];
            var carry = t2;
            var total_distance = countPrev(prev,distance,t2);
            while(carry != -1) {
              result.push(carry);
              carry = prev[carry];
            }
            result.reverse();
            if(result.length == 1) {
              //console.log("Lokasi tujuan sama dengan lokasi awal");
              outputField.append("Lokasi tujuan sama dengan lokasi awal");
              outputField.append(document.createElement("br"));
            }
            else {
              //mewarna jalur graph terdekat
              polylinePoints = [];
              for (let i = 0; i < result.length; i++) {
                polylinePoints.push(coordinate[result[i]]);
              }
              var polyline = new L.polyline(polylinePoints, {
                color: '#46eb34',
                smoothFactor: 1
              });
              map.addLayer(polyline);

              var answer = "Titik yang dilewati : ";
              answer = answer + name[result[0]];  
              for(var i = 1;i<result.length;i++) {
                answer = answer + " -> " + name[result[i]] ;
              }
              //console.log("Jarak yang ditempuh : " + total_distance.toFixed(2) + " km");
              //console.log(answer);
              outputField.append("Jarak yang ditempuh : " + total_distance.toFixed(2) + " km");
              outputField.append(document.createElement("br"));
              outputField.append(answer);
              outputField.append(document.createElement("br"));
            }
          }
          else {
            //console.log("Tujuan tidak bisa dicapai");
            outputField.append("Tujuan tidak bisa dicapai");
            outputField.append(document.createElement("br"));
          }
        }

      }
      executeButton.onclick = execute;
    }
  }

