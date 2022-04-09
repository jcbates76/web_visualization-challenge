// Drop down button has sample ID data
// Pull in the sample.json data. 
let data = d3.json("samples.json").then(data => {
    // Pull the names from the data for the drop down
    const names = data.names;
    // ID names listed into the drop down
    let dropDown = d3.select('#selDataset');
    // Iterate through all of the names and append into the drop down
    names.forEach(name => {
        dropDown.append('option').text(name).property('value', name);
    });
});

// Functions to update the demographic and chart sections when a Subject ID is selected
function optionChanged(selection) {
    demographicInfo(selection);
    buildCharts(selection)
};

// Function to pull the demographic metadata for sample ID selected
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

// Function to generate a horizontal bar plot and bubble chart
function buildCharts(id) {
    // Pull the data from the json for to populate the charts
    d3.json("samples.json").then(data => {
        // Filter the data to only pull the data for the sample ID selected
        let filteredData = data.samples.filter(SampleId => SampleId.id == id)[0];
        // Define a variable for the sample values
        let sampleValues = filteredData.sample_values;
        // Define a variable for the sample OTU ID's
        let sampleIds = filteredData.otu_ids;
        // Define a variable for the sample labels
        let sampleLabels = filteredData.otu_labels;
        
        // Build the horizontal bar chart
        // Setup the variables and chart parameters
        // The slice will take the top 10 values from the array
        // The array is reversed so that the values will show in the chart from top to bottom (default is bottom to top)
        // The map command will convert the otu_ID into a string which will contain the term "OTU".  
        let trace1 = {
            x: sampleValues.slice(0,10).reverse(),
            y: sampleIds.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: sampleLabels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'  // Designation for the horizontal bar chart
        };
        let barChartVariables = [trace1];
        // Setup the layout of the horizontal bar chart
        let layout1 = {
            title: `Top 10 OTU's in Subject ID ${id}.`
        };
        // Plot the horizontal bar chart
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

        // Setup the layout of the bubble chart
        let layout2 = {
            title: `Values for Subject ID ${id}`,
            showlegend: false,
            height: 600,
            width: 1200
        };

        // Plot the bubble chart
        Plotly.newPlot('bubble', bubbleChartVariables, layout2);
    });
};