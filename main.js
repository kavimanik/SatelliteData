var companies = [];
var contractors = [];
var employees = [];

// On page load, load in the user's data
document.addEventListener('DOMContentLoaded', function () {     
    Promise.all([d3.csv('data/Companies.csv'),d3.csv('data/Contractors.csv'), d3.csv('data/Statellites.csv')])
        .then(function (values) {
            console.log('load Companies.csv, Contractors.csv, Statellites.csv');
            companies = values[0];
            contractors = values[1];
            statellites = values[2];
             
            // Print out the data
            console.log(companies);
            console.log(contractors);
            console.log(statellites);

            draw_Table_for_Companies();
         });
 });

// Draws a table for companies witht the columns headers CompanyName, CompanyID, and Country and Usecase from companies.csv
function draw_Table_for_Companies(){
    var table = d3.select("#country_table").append("table");
    var tbody = table.append("tbody");

    // append the header row
    table.append('thead')
        .append("tr")
        .selectAll("th")
        .data(["CompanyName", "CompanyID", "Country", "Usecase"])
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(companies)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return ["CompanyName", "CompanyID", "Country", "Usecase"].map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
}