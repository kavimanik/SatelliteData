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
            satellites = values[2];
             
            // Print out the data
            console.log(companies);
            console.log(contractors);
            console.log(satellites);

            // add attributes each company for number of satellites
            companies.forEach(function(company){
                company['numSatellites'] = 0;
            });

            // Change companyID to number in companies
            companies.forEach(function(company){
                company['companyID'] = +company['CompanyID'];
            });


            companies.forEach(function(company){
                satellites.forEach(function(satellite){
                    if (satellite.CompanyID == company.CompanyID){
                        company['numSatellites'] += 1;
                    }
                });
            });

            // add attributes each contractor for number of satellites
            contractors.forEach(function(contractor){
                contractor['numSatellites'] = 0;
            });

            // ContractorsID to number in contractors
            contractors.forEach(function(contractor){
                contractor['contractorID'] = +contractor['ContractorID'];
            });

            contractors.forEach(function(contractor){
                satellites.forEach(function(satellite){
                    if (satellite.ContractorID == contractor.ContractorID){
                        contractor['numSatellites'] += 1;
                    }
                });
            });
            
            // remove all companies with no satellites
            companies = companies.filter(function(company){
                return company.numSatellites > 0; 
            });

            // remove all companies with no satellites
            contractors = contractors.filter(function(contractor){
                return contractor.numSatellites > 0; 
            });

            // Add all companies names to the dropdown menu with the value as the companyID
            var dropdown = d3.select("#company_dropdown");
            dropdown.selectAll("option")
                .data(companies)
                .enter()
                .append("option")
                .attr("value", function(d) { return d.companyID; })
                .text(function(d) { return d.Name; });

                // Add all companies names to the dropdown menu with the value as the companyID
            var dropdown = d3.select("#contractor_dropdown");
            dropdown.selectAll("option")
                .data(contractors)
                .enter()
                .append("option")
                .attr("value", function(d) { return d.contractorID; })
                .text(function(d) { return d.Name; });

            columns = {'Name' : '  Name ', 'Country' : '  Country  ', 'DateOfLaunch':  '  Launch Date  ', 'LaunchSite': '  Launch Site  ', 'LifeExpectancy': '  Life Expectancy (yrs)  ','Mass' :  '  Mass (kg)  ','Orbit': '  Orbit  ', 'PeriodOfTime':  '  Period (min)  ', 'Power': '  Power  ' }
            satellites.unshift(columns);
            draw_Table(satellites);
         });
 });

// Draws a table for all satellites in the list in the satellite_table
function draw_Table(satellites){
    
    //columns = ['Name', 'Country', 'Contractor', 'Launch Date', 'Launch Site', 'Life Expectancy (yrs)', 'Mass (kg)', 'Orbit', 'Period (min)', 'Power' ]
    columns = ['Name', 'Country', 'DateOfLaunch', 'LaunchSite', 'LifeExpectancy', 'Mass', 'Orbit', 'PeriodOfTime', 'Power' ]

    
    var table = d3.select("#satellite_table");

    table.selectAll("tr").remove();

    var thead = table.append("thead")
    var tbody = table.append("tbody");
    
    table.append("table")
    thead.append("tr")
    .selectAll('th')
    .data(columns).enter()
    .append("th")
        .text(function(column) { return column; });

    table.selectAll("tr").remove();
    rows = tbody.selectAll("tr")
        .data(satellites)
        .enter()
        .append("tr")
        //.html(function(d) { return "<td>" + d.Name + "</td><td>" + d.Country + "</td><td>" + d.DateOfLaunch + "</td><td>" + d.LauchSite + "</td><td>" 
        //+ d.LifeExpectancy + "</td><td>" + d.Mass + "</td><td>" + d.Orbit + "</td><td>" + d.PeriodOfTime + "</td><td>" + d.Power + "</td>"; });

    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });

    return table;
}

function new_country_selected(){
    var dropdown = document.getElementById("company_dropdown");
    var selected_company = dropdown.options[dropdown.selectedIndex].value;
    console.log(selected_company);

    //put every satellite with satellite.CompanyID == selected_company in a list
    columns = {'Name' : '  Name ', 'Country' : '  Country  ', 'DateOfLaunch':  '  Launch Date  ', 'LaunchSite': '  Launch Site  ', 'LifeExpectancy': '  Life Expectancy (yrs)  ','Mass' :  '  Mass (kg)  ','Orbit': '  Orbit  ', 'PeriodOfTime':  '  Period (min)  ', 'Power': '  Power  ' }
    if(selected_company == -1){
        draw_Table(satellites);
    }
    else{
        var satellitesList = [columns];
        satellites.forEach(function(satellite){
            if (satellite.CompanyID == selected_company){
                satellitesList.push(satellite);
            }
        });
        
        
        console.log(satellitesList);
        //draw table for satellites
        draw_Table(satellitesList);
    }
}

function new_contractor_selected(){
    var dropdown = document.getElementById("contractor_dropdown");
    var selected_contractor = dropdown.options[dropdown.selectedIndex].value;
    console.log(selected_contractor);

    //put every satellite with satellite.CompanyID == selected_company in a list
    columns = {'Name' : '  Name ', 'Country' : '  Country  ', 'DateOfLaunch':  '  Launch Date  ', 'LaunchSite': '  Launch Site  ', 'LifeExpectancy': '  Life Expectancy (yrs)  ','Mass' :  '  Mass (kg)  ','Orbit': '  Orbit  ', 'PeriodOfTime':  '  Period (min)  ', 'Power': '  Power  ' }
    if(selected_contractor == -1){
        draw_Table(satellites);
    }
    else{
        var satellitesList = [columns];
        satellites.forEach(function(satellite){
            if (satellite.ContractorID == selected_contractor){
                satellitesList.push(satellite);
            }
        });
        
        
        console.log(satellitesList);
        //draw table for satellites
        draw_Table(satellitesList);
    }
}