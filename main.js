// Variables
var text = "";
var countVowels = 0;
var countConsonants = 0;
var countPunctuation = 0;
var letterCount = {};
var letterCountList = [];
var vowelsList = [];
var consonantsList = [];
var colorAssociation = {};
var barType = consonantsList;
var barColor;

// Functions
function submitText() {
    text = document.getElementById("wordbox").value;
    console.log(text);
    const data = countLetters(text);
    drawD3DonutChart(data);
    var barType = consonantsList;
    drawD3BarChart();
}
function countLetters(text){
    countVowels = 0;
    countConsonants = 0;
    countPunctuation = 0;
    var vowels = ["a", "e", "i", "o", "u"];
    var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
    var punctuation = [".", ",", "!", "?", ";", ":"];

    vowelsList = [];
    consonantsList = [];
    
    // Change text to lowercase
    text = text.toLowerCase();

    // Make list each vowels and consonants count
    for (var i = 0; i < vowels.length; i++) {
        vowelsList.push({letter: vowels[i], count: 0});
    }
    for (var i = 0; i < consonants.length; i++) {
        consonantsList.push({letter: consonants[i], count: 0});
    }
    
    
    // Count Number of Vowels, Consonants, and Punctuation
    for (var i = 0; i < text.length; i++) {
        if (vowels.indexOf(text[i]) !== -1) {
            countVowels++;
            vowelsList[vowels.indexOf(text[i])].count++;
        }
        else if (consonants.indexOf(text[i]) !== -1) {
            countConsonants++;
            consonantsList[consonants.indexOf(text[i])].count++;
        }
        else if (punctuation.indexOf(text[i]) !== -1) {
            countPunctuation++;
        }
    }

    // Count the number of ever individual letter
    letterCount = {};
    for (var i = 0; i < text.length; i++) {
        if (letterCount[text[i]] === undefined) {
            letterCount[text[i]] = 1;
        }
        else {
            letterCount[text[i]]++;
        }
    }

    console.log(vowelsList);
    console.log(consonantsList);

    // Remove space and all punctuation from the letterCount
    delete letterCount[" "];
    delete letterCount["."];
    delete letterCount[","];
    delete letterCount["!"];
    delete letterCount["?"];
    delete letterCount[";"];
    delete letterCount[":"];
    delete letterCount["<"];
    delete letterCount[">"];


    // Convert letterCount to a list of dictionaries
    letterCountList = [];
    for (var key in letterCount) {
        letterCountList.push({label: key, count: letterCount[key]});
    }
    
    // Print the number of vowels, consonants, punctuation and the number of each individual letter
    console.log(countVowels);
    console.log(countConsonants);
    console.log(countPunctuation);
    console.log(letterCount);
    console.log(colorAssociation);
    barType = consonantsList;
    barColor = "#ffffb4";
    return [{label: "Vowels", count: countVowels}, {label: "Consonants", count: countConsonants}, {label: "Punctuation", count: countPunctuation}];
}

// Function to draw the pie chart
function drawD3DonutChart(data){
    console.log("drawD3DonutChartBegin");

    // Clear the svg
    d3.select("#pie_svg").selectAll("*").remove();

    // Select the svg
    var svg = d3.select("#pie_svg");

    // Select the data
    var data = [
        {label: "Consonants", count: countConsonants},
        {label: "Vowels", count: countVowels},
        {label: "Punctuation", count: countPunctuation}
    ];

    // Set the width and height of the svg
    var width = 580;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal([`#ffffb4`, `#8ed3c7`,`#bfbadb`]);

    // Create pie chart
    var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

    // Gernerate the arcs
    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 50);
    
    // Generate groups
    var arcs = svg.selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    
    // Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {

            // Gets the color associated with the label
            colorAssociation[color(i)] = d.data.label;

            return color(i);
        })
        .attr("d", arc).style("stroke", "black")
        //.style("stroke-width", "1px")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on('click', handleMouseClick);
    
    console.log(colorAssociation);
    console.log("drawD3DonutChartEnd");
}
// Draw a D3 bar chart using the letterCountList as the data
function drawD3BarChart(){
    console.log("drawD3BarChartBegin");

    // Clear the svg
    d3.select("#bar_svg").selectAll("*").remove();

    // Select the data for the bar chart
    var data = barType;
    console.log(data);

    // Standard margin, width, and height
    var width = 500;
    var height = 400;
    var color = d3.scaleOrdinal([barColor]);
    const margin = { top:40, bottom: 40, right: 20, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    var svg = d3.select("#bar_svg");
    
    
    // Create the x and y scales
    var x = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([innerHeight, 0]);
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);
    
    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Create the bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.letter); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return innerHeight - y(d.count); })
        .attr("fill", function(d) {
            return color(d.letter);
        })
        .text(function(d) { return d.letter; })
        .attr("label", function(d) { return d.letter; })
        .style("stroke", "black")
        .attr('transform', 'translate('+margin.left+', '+margin.top+')')
        .on("mouseover", handleMouseOverBar)
        .on("mouseout", handleMouseOutBar);

        const g = svg.append('g')
        .attr('transform', 'translate('+margin.left+', '+margin.top+')');
        const yAxis = d3.axisLeft(y);
            g.append('g').call(yAxis);             
        const xAxis = d3.axisBottom(x)
            .tickSize(7);                
            var gXAxis = g.append('g').call(xAxis);                 
            gXAxis.attr('transform',`translate(0,${innerHeight})`)
                            .selectAll("text")
                                .style("text-anchor", "end")
                                .attr("dx", "2px")
                                .attr("dy", "5px")
                                .attr("transform", "rotate(0)" );

    console.log("drawD3BarChartEnd");
}

// Pie chart mouse over event, increase outline width
function handleMouseOver(d, i) {
   console.log(this);
    d3.select(this).transition()
        .attr('stroke-width', '4px');
    if(colorAssociation[this.attributes[0].nodeValue] == "Consonants"){
        // Set center text to be about consonants
        d3.select("#pie_legend")
            .transition()
            .duration(200)
            .style("font-size", "20px")
            .style("opacity", 1)
            .text("Consonants" + ": " + countConsonants);
    }else if(colorAssociation[this.attributes[0].nodeValue] == "Vowels"){
        // Set center text to be about vowels
        d3.select("#pie_legend")
            .transition()
            .duration(200)
            .style("font-size", "20px")
            .style("opacity", 1)
            .text("Vowels" + ": " + countVowels);
            //.attr("transform", "translate(-200,  -250)");
    }else if(colorAssociation[this.attributes[0].nodeValue] == "Punctuation"){
        // Set center text to be about punctuation
        d3.select("#pie_legend")
            .transition()
            .duration(200)
            .style("font-size", "20px")
            .style("opacity", 1)
            .text("Punctuation" + ": " + countPunctuation);
            //.attr("transform", "translate(-200,  -250)");
    }
}

// Pie chart mouse out event, decrease outline width
function handleMouseOut(d, i) {
    d3.select(this).transition()
        .attr('stroke-width', '1px');
    if(colorAssociation[this.attributes[0].nodeValue] == "Consonants"){
        // Set center text to be about consonants
        d3.select("#pie_legend")
            .transition()
            .duration(50)
            .text("");
    }else if(colorAssociation[this.attributes[0].nodeValue] == "Vowels"){
        // Set center text to be about vowels
        d3.select("#pie_legend")
            .transition()
            .duration(50)
            .text("");
    }
}

// Pie chart on mouse click event, change the bar chart data
function handleMouseClick(d, i) {
    //console.log(this);
    console.log(this.attributes[0].nodeValue);
    console.log(colorAssociation[this.attributes[0].nodeValue]);
    if(colorAssociation[this.attributes[0].nodeValue] == "Consonants"){
        console.log("Consonants");
        barType = consonantsList;
        barColor = this.attributes[0].nodeValue;
        drawD3BarChart();
    }else if(colorAssociation[this.attributes[0].nodeValue] == "Vowels"){
        console.log("Vowels");
        barType = vowelsList;
        barColor = this.attributes[0].nodeValue;
        drawD3BarChart();
    }
}

// Bar chart mouse over event, increase outline width
function handleMouseOverBar(d, i) {
    d3.select(this).transition()
        .attr('stroke-width', '1px');
    d3.select("#character-name")
        .text(this.attributes["label"].nodeValue)
        .style("color", "red");
    console.log(this);
    console.log(this.attributes["label"].nodeValue);
}

// Bar chart mouse out event, decrease outline width
function handleMouseOutBar(d, i) {
    d3.select(this).transition()
        .attr('stroke-width', '1px');
    d3.select("#character-name")
        .text("");
}
