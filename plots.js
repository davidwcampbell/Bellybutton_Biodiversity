function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });
  });
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " + result.age);
    PANEL.append("h6").text("LOCATION: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];

    var bar = [
      {
        type: "bar",
        x: result.sample_values,
        y: result.otu_ids.map((i) => `OTU ID: ${i}`),
        orientation: "h",
      },
    ];

    Plotly.newPlot("bar", bar);

    var bubble = [
      {
        mode: "markers",
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        marker: {
          size: result.sample_values,
          sizeref: 2,
          sizemode: "auto",
          color: result.otu_ids,
        },
      },
    ];

    Plotly.newPlot("bubble", bubble);

    var gauge2 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        title: { text: "Belly Button Wash Frequency" },
        type: "indicator",
        mode: "gauge",
        gauge: {
          axis: { range: [null, 9] },
        },
      },
    ];
    Plotly.newPlot("gauge", gauge2);
  });
}
