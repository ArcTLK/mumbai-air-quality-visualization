import { downloadAQSample, csvToObject } from './csv.js';
import { openData, changeToolbarIcon, changeModalTab, snackbar } from './interface.js';
import { resetAirQualityParametersToDefault, saveAirQualityParameters, addDatasetsToDOM, loadHeatmapFromAirQualityDatasets } from './air-quality-and-demographic-utils.js';
import { state } from './state.js';

/*
* Event handlers
*/
document.getElementById('download-aq-sample-dataset').addEventListener('click', downloadAQSample);

document.getElementById('resetAirQualityToDefaultButton').addEventListener('click', resetAirQualityParametersToDefault);

document.getElementById('aq-parameters-form').addEventListener('submit', saveAirQualityParameters);

Array.from(document.querySelectorAll('.openData')).map(x => x.addEventListener('click', openData));
Array.from(document.querySelectorAll('.toolbarIcon')).map(x => x.addEventListener('click', changeToolbarIcon));
Array.from(document.querySelectorAll('.changeModalTab')).map(x => x.addEventListener('click', changeModalTab));

document
  .getElementById("aq-upload-dataset")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
      state.datasets.airQuality.push({
        data: csvToObject(reader.result),
        name: event.target.value.replace(/^.*?([^\\\/]*)$/, '$1'),
        addedOn: new Date().toISOString(),
        id: state.datasets.airQuality.length > 0 ? state.datasets.airQuality[state.datasets.airQuality.length - 1].id + 1 : 0
      });
      addDatasetsToDOM(state.datasets.airQuality, 'airQuality');
      loadHeatmapFromAirQualityDatasets(state.datasets.airQuality)
      localStorage.setItem('air-quality-datasets', JSON.stringify(state.datasets.airQuality));
      snackbar('Air quality dataset has been loaded!', 'success');
    };
    reader.readAsBinaryString(event.target.files[0]);
  });

document
  .getElementById("demo-upload-dataset")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.readAsBinaryString(event.target.files[0]);
  });


const tooltip = document.getElementById('location-tooltip');
const regionTooltip = document.getElementById('region-name-tooltip')

document.addEventListener('mousemove', function (event) {
  // Region name
  regionTooltip.style.left = `${event.clientX + 12}px`;
  regionTooltip.style.top = `${event.clientY + 12}px`;

  // Latitude and longitude
  const latlng = state.mappingPixelCoordsToLatLng(event.clientX + state.viewBoxCoords.min_x, event.clientY + state.viewBoxCoords.min_y);
  tooltip.innerHTML = `<strong>Latitude:</strong> ${latlng.lat.toFixed(4)}  <strong>Longitude:</strong> ${latlng.lng.toFixed(4)}`;
});

// Show region name near mouse when it is hovered over
let region = document.getElementById('svg-regions')
region.addEventListener('mouseover', (e) => {
  regionTooltip.innerHTML = e.target.getAttribute('gname')
})

region.addEventListener('mouseout', () => {
  regionTooltip.innerHTML = ''
})
