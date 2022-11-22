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
         });
 });