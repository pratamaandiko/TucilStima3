
const inputElement = document.getElementById("fileInput");
let dropDownTitikAwal = document.getElementById("dropDownTitikAwal");
let dropDownTitikAkhir = document.getElementById("dropDownTitikAkhir");
let executeButton = document.getElementById("executeButton");
let outputField = document.getElementById("output");

inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {

    //menghitung euclidan distance
    function jarak(a,b) {
        var x = ((a[0] - b[0])**2 + (a[1] - b[1])**2)**0.5;
        return x.toFixed(2);
      }

      //pengurutan prioritas array dari terkecil
      function add(arr,x) {
        arr.push(x);
        arr.sort(function(a, b){return b[1] - a[1]});
      }

      // menghitung total jalur yang sudah dilalui, ekuivalen dengan g(n)
      function countPrev(prev,distance,x) {
        var total = 0;
        while(prev[x] != -1) {
          total = total + distance[x][prev[x]];
          x = prev[x];
        }
        return total;
      }
      
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
        add(prio,[t1,distance[t1,t2]]);
        while(found == 0 && prio.length != 0) {
          for(var i = 0;i<prio.length;i++) {
            prio[i] = prio[i];
          }
          var simpul = prio.pop();
          dikunjungi[i] = 1;
          if(simpul[0] == t2) {
            found = 1;

          }
          else {
            for(var i = 0;i<matrix[simpul[0]].length;i++) {
              if(dikunjungi[i] == 0 && matrix[simpul[0]][i] == 1) {
                prev[i] = simpul[0];
                var estimate = countPrev(prev,distance,i) + distance[i][t2];
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
            console.log("Lokasi tujuan sama dengan lokasi awal");
          }
          else {
            var answer = "Titik yang dilewati : ";
            answer = answer + name[result[0]];  
            for(var i = 1;i<result.length;i++) {
              answer = answer + " -> " + name[result[i]] ;
            }
            console.log("Jarak yang ditempuh : " + total_distance + " km");
            console.log(answer);
          }
        }
        else {
          console.log("Tujuan tidak bisa dicapai");
        }
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
      console.log(newtext);

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
          distance[i][j] = Number(jarak(coordinate[i],coordinate[j]));
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

      //execute button event
      function execute(){
        while (outputField.firstChild) {  
            outputField.removeChild(outputField.firstChild);
          }
        let tempOption = document.createElement('p');
        //lak pingin print deleh kene
        tempOption.innerHTML = "Titik awal = ";
        tempOption.innerHTML += dropDownTitikAwal.value;
        tempOption.innerHTML += ", Titik akhir = ";
        tempOption.innerHTML += dropDownTitikAkhir.value;
        outputField.appendChild(tempOption);
        outputField.append(name);
        outputField.append(document.createElement("br"));
        outputField.append(coordinate);
        outputField.append(document.createElement("br"));
        outputField.append(matrix);
        outputField.append(document.createElement("br"));
        outputField.append(distance);
      }
      executeButton.onclick = execute;
    }
  }