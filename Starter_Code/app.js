// Use D3 to read in samples.json
d3.json("/Starter_Code/samples.json").then(function(data) {
    console.log(data[0]);
});