function init() {
    d3.json("samples.json").then(data => {
        console.log("read samples");
        console.log(data);
        console.log("reading the detail in the json");
        console.log(data.metadata[0]["id"]);
        console.log("trying to get an array of id's");

        let options = [];
       

        for (let i = 0; i < data.metadata.length; i++) {
            options.push(data.metadata[i]["id"]);
            
        };

        console.log("checking to see if id prints")
        console.log(options);

        let select = document.getElementById("selDataset");
        for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let el = document.createElement("option");
            el.text = opt;
            el.value = opt;

            select.add(el);
        }      

    });
}
function optionChanged(value) {
    console.log(value);
}

init();