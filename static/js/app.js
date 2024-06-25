// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data); // Log the entire data object

    // Filter the metadata for the object with the desired sample number
    const filteredData = data.samples.filter((item) => item.id === String(sample));
    console.log(filteredData);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries({
      Age: filteredData.age,
      Gender: filteredData.gender,
      Location: filteredData.location,
    }).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter((d) => d.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = filteredSample.otu_ids;
    const otuLabels = filteredSample.otu_labels;
    const sampleValues = filteredSample.sample_values;

    // Build a Bubble Chart
    const bubbleChart = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleChart]);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIds.slice(0, 10).map((id) => `OTU ${id}`);

    // Build a Bar Chart
    const barChart = {
      x: sampleValues.slice(0, 10),
      y: yticks,
      type: 'bar',
      orientation: 'h'
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barChart]);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((name) => {
      dropdown.append("option")
       .text(name)
       .property("value", name);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {

  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
