function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var meta_data = data.metadata;

        var resultArray = meta_data.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var panel = d3.select("#sample-metadata");

        panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
            
            console.log(key, value);
        });
    });
}

function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var result_list = samples.filter(sampleObj => sampleObj.id == sample);
        var results = result_list[0];
        
        var sample_values = results.sample_values;
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;

        // console.log(otu_ids, otu_labels, sample_values);

        // Bar chart
        var y_value = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var bar_data = [
            {
            x: sample_values.slice(0, 10).reverse(),
            y: y_value,
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            }
        ];
        var bar_layout = {
            title: "Top 10 Bacteria Cultures Found"
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        // Bubble Chart
        var bubble_data = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            } 
        ]; 
        var bubble_layout = {
            title: "Bacteria Samples",
            margin: { t: 0},
            // showlegend: false,
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: { t: 30}
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
}

// This function is called when a dropdown menu item is selected
function init() {
    
    var dropdownMenu = d3.select("#selDataset");

    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Using first sample data to create initial charts
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

init();

 