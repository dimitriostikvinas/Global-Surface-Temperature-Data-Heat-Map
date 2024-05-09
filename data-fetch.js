
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"; // static JSON file
document.addEventListener('DOMContentLoaded', function(){
    fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        drawHeatMap(data); // Calls the function defined in d3-heat-map.js
    })
    .catch(error => {
        console.error("Error fetching the data:", error);
    });
});