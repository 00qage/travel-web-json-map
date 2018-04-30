// var data;

// 指定 dom
var AR = document.querySelector('#ARId');
var hotAR = document.querySelector('#hotARList');
var listTitle = document.querySelector('#listTitle');
var list = document.querySelector('#list');
var markers = [];
var currentInfoWindow = '';
// 下載資料
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = function () {
  data = JSON.parse(xhr.responseText).result.records;
  render();
}

function render() {
  // 過濾成乾淨的區域陣列到 areaList
  var areaList = [];
  for (var i = 0; data.length > i; i++) {
    areaList.push(data[i].Zone);
  }
  // 再用 foreach 去判斷陣列裡面所有值是否有吻合
  var area = [];
  areaList.forEach(function (value) {
    if (area.indexOf(value) == -1) {
      area.push(value);
    }
  });
  // 監聽與更新
  areaUpdated(area);
  updatedListOriginal();
  AR.addEventListener('change', updatedList);
  AR.addEventListener('change', changeArea);
  hotAR.addEventListener('click', hotarea);
}

//行政區下拉選單
function areaUpdated(items) {
  var str = '<option value="none">-- 請選擇行政區 --</option>';
  for (var i = 0; i < items.length; i++) {
    str += '<option data-number="' + i + '" value="' + items[i] + '">' + items[i] + '</option>'
  }
  AR.innerHTML = str;
}
//熱門行政區
function hotarea(e) {
  if (e.target.nodeName !== 'INPUT') {
    return;
  }
  
  updatedList(e);
}

//載入地圖資訊
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {
      lat: 22.6048695,
      lng: 120.298119
    }
  });
}
//產生標記
function loadData(lat, lng, title) {
  var marker = new google.maps.Marker({
    position: {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    },
    title: title,
    map: map,
  });
  marker.addListener('click', function () {
    if (currentInfoWindow != '') {
      currentInfoWindow.close();
      currentInfoWindow = '';
    }
    infowindow.open(map, marker);
    currentInfoWindow = infowindow;
  });
  markers.push(marker);
}
//變更地區，並進行監聽
function changeArea(e){
  // 清除資料
  for(i=0;i<markers.length;i++){
    markers[i].setMap(null);   
  }
   markers = []; 
   infoWindows = [];
   // 載入資料
   for(var i=0;data.length>i;i++){
      if(data[i].Zone== e.target.value){
        loadData(data[i].Py,data[i].Px,data[i].Picdescribe1)
      }
    }
}



//同步更新網頁
function updatedList(e) {
  var str = '';
  for (var i = 0; i < data.length; i++) {
    if (data[i].Zone == e.target.value) {
      listTitle.textContent = data[i].Zone;
      str += '<li class="list-box"><a href="{Website}"><div class="list-img " style="background:url({Picture1});background-size: cover;background-position: center; "><h3>{Name}</h3><h2>{Zone}</h2></div><ul><li ><img src="images/icons_clock.png" alt="clock">{Opentime}</li><li ><img src="images/icons_pin.png" alt="pin">{Add}</li><li class="left-li"><img src="images/icons_phone.png" alt="phone">{Tel}</li><li class="right-li"><img src="images/icons_tag.png" alt="tag">{Ticketinfo}</li></ul></a></li>';
      if (data[i].Ticketinfo == '') {
        // 沒有資料的時候給空白讓他偏移
        data[i].Ticketinfo = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
      }
      str = str.replace('{Name}', data[i].Name)
        .replace('{Picture1}', data[i].Picture1)
        .replace('{Ticketinfo}', data[i].Ticketinfo)
        .replace('{Zone}', data[i].Zone)
        .replace('{Opentime}', data[i].Opentime)
        .replace('{Add}', data[i].Add)
        .replace('{Tel}', data[i].Tel)
        .replace('{Website}', data[i].Website == '' ? '#' : data[i].Website);

        //產生標記在此執行
      loadData(data[i].Py, data[i].Px, data[i].Picdescribe1)
    }
  }
  list.innerHTML = str;


}


//加入原始列表
function updatedListOriginal() {
  for (var i = 0; i < data.length; i++) {
    if (data[i].Zone == AR.value) {
      listTitle.textContent = data[i].Zone;
    }
  }
}

// 置頂按鈕

// 置頂功能
var gotoTop = document.querySelector('#scrollTopId');
gotoTop.addEventListener('click', function () {
  scrollTo(0, 0);
}, );
//消失功能
window.onscroll = function () {
  var scrollPos = window.pageYOffset;


  if (scrollPos >= (window.innerHeight) / 2) {
    gotoTop.style.display = 'block';
  } else {
    gotoTop.style.display = 'none';
  }
}