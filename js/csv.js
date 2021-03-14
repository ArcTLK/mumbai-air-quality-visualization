/*
* CSV Functions
*/

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, data, fileName) {
  if (headers) {
    data.unshift(headers);
  }

  var jsonObject = JSON.stringify(data);

  var csv = convertToCSV(jsonObject);

  var exportedFilename = fileName;

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export function downloadAQSample() {
  let demoData = [
    {
      date: "01/01/2020",
      latitude: "19.02",
      longitude: "72.91",
      o3: "30",
      pm25: "10.5",
      pm10: "12.4",
      no2: "2.4",
      so2: "5.1",
      co: "1",
      nh3: "17",
    },
    {
      date: "01/01/2020",
      latitude: "19.03",
      longitude: "72.91",
      o3: "20",
      pm25: "14.5",
      pm10: "11.2",
      no2: "2",
      so2: "2.5",
      co: "1.2",
      nh3: "11.5",
    },
  ];

  aqvObjectToCSVFile(demoData, "Mumbai AQ Sample.csv")
}

export function aqvObjectToCSVFile(data, filename) {
  const headers = {
    date: "date",
    latitude: "latitude",
    longitude: "longitude",
    o3: "o3",
    pm25: "pm2.5",
    pm10: "pm10",
    no2: "no2",
    so2: "so2",
    co: "co",
    nh3: "nh3",
  };

  exportCSVFile(headers, data, filename);
}


export function csvToObject(data, demoData = false) {
  let dataset = [];
  let properties = [];
  for (let item of data.split('\n')) {
    if (item === '') {
      continue;
    }

    const itemData = item.trim().split(',');

    if (properties.length === 0) {
      properties = itemData;
    }
    else {
      const dataItem = {};

      for (let i = 0; i < itemData.length; ++i) {
        if (properties[i] !== 'date') {
          if (parseFloat(itemData[i]) || itemData[i] == "0")
            dataItem[properties[i]] = parseFloat(itemData[i]);
          else
            dataItem[properties[i]] = itemData[i];
        }
        else {
          dataItem[properties[i]] = itemData[i];
        }
      }
      dataset.push(dataItem);
    }
  }

  return dataset;
}