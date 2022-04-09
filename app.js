// Drop down button has sample ID data
// Pull in the sample.json data. 
let data = d3.json("samples.json").then(data => {

    // Pull the data from the json
    const samples = data.samples;
    const metadata = data.metadata;
    const names = data.names;

    // ID names listed into the drop down
    let dropDown = d3.select('#selDataset')
    names.forEach(name => {
        dropDown.append('option').text(name).property('value', name);
    });
});

// Function to pull data based on drop down selection
function optionChanged(selection) {
    demographicInfo(selection);
    buildCharts(selection)
};

// Function to pull the demographic metadata for sample ID
function demographicInfo(id) {
    d3.json("samples.json").then(data => {
        // Define a variable to store the metadata form the json
        let metadata = data.metadata;
        // Define a variable for the Demographic Info Box
        let demoInfoBox = d3.select('#sample-metadata');
        // Clear the demographic metadata (will continue to append if not included)
        demoInfoBox.html('');
        // Filter the metadata to to pull out only the data related to the sample ID
        let filteredData = metadata.filter(sampleName => sampleName.id == id)[0];
        // Append the filtered data into the HTML code, iterating through the keys of the dictionary
        // Object.entries is a shortcut to iterate through key / value pairs in a dictionary
        Object.entries(filteredData).forEach(([key, value]) => {
            demoInfoBox.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};

// Function to plot the OTU's for a given sample ID
function buildCharts(id) {
    d3.json("samples.json").then(data => {
        let filteredData = data.samples.filter(SampleId => SampleId.id == id)[0];
        let sampleValues = filteredData.sample_values;
        let sampleIds = filteredData.otu_ids;
        let sampleLabels = filteredData.otu_labels;
        
        // Build the horizontal bar chart
        // Setup the variables and chart parameters
        let trace1 = {
            x: sampleValues.slice(0,10).reverse(),
            y: sampleIds.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: sampleLabels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        let barChartVariables = [trace1];
        // Setup the layout of the chart
        let layout1 = {
            title: `Top 10 OTU's in Subject ID ${id}.`
        };
        // Plot the chart
        Plotly.newPlot("bar", barChartVariables, layout1);

        //Build the bubble chart
        // Setup the variables and chart parameters
        let trace2 = {
            x: sampleIds,
            y: sampleValues,
            text: sampleLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: sampleIds
            }
        };

        let bubbleChartVariables = [trace2];

        let layout2 = {
            title: `Values for Subject ID ${id}`,
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubble', bubbleChartVariables, layout2);
        
    });
};