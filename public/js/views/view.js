App.SearchView = Ember.View.extend({
	templateName : 'search',

	didInsertElement : function() {
		window.visualSearch = VS.init({
            container  : $('#search_box_container'),
            showFacets : true,
            unquotable :[],
            callbacks  : {
                search : function(query, searchCollection) {
                    var $query = $('#search_query');
                    search_text="";
                    var str=query;
                    if(str != ""){
                        var stringMatch = str.match(/"(.*?)"/g);
                        stringMatch=''+stringMatch+'';
                        stringMatch=stringMatch.split(",");
                        for(var i=0;i<stringMatch.length;i++){
                            if(i == 0){
                                search_text = search_text+stringMatch[i]; 
                               // alert(search_text);                  
                            }
                            else{
                                search_text = search_text+"AND"+stringMatch[i];
                                //alert(search_text);                  
                            }
                        }
                    }

                    $query.stop().animate({opacity : 1}, {duration: 300, queue: false});
                    clearTimeout(window.queryHideDelay);
                    window.queryHideDelay = setTimeout(function() {
                        $query.animate({opacity : 0 }, {duration: 1000,queue: false});
                    }, 2000);
                },

                facetMatches : function(callback) {
                  callback([
                    { label: 'freetext',    category: 'generic' },
                    { label: 'city',       category: 'location' },
                    { label: 'country',    category: 'location' },
                    { label: 'skills',    category: 'other' },
                    { label: 'company',    category: 'other' }
                  ]);
                },

                valueMatches : function(facet, searchTerm, callback) {
                    switch (facet) {
                        case 'skills':
                            callback(['java','dotnet','php','nodejs']);
                            break;
                        case 'company':
                            callback(['srs', 'infosys', 'wipro','capgemini']);
                            break;               
                        case 'city':
                            callback([
                            'Cleveland',
                            'New York City',
                            'Brooklyn',
                            'Manhattan',
                            'Queens',
                            'The Bronx',
                            'Staten Island',
                            'San Francisco',
                            'Los Angeles',
                            'Seattle',
                            'London',
                            'hyderabad',  
                            'Portland',
                            'Chicago',
                            'Boston'
                          ]);
                          break;          
                        case 'country':
                          callback([
                            "China", "India", "United States", "Indonesia", "Brazil",
                            "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                            "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                            "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                            "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                            "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                            "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                            "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                            "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                            "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                            "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                            "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                            "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                            "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                            "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                            "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                            "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                            "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                            "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                            "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                            "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                            "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                            "Slovakia", "Finland", "Eritrea", "Turkmenistan"
                          ], {preserveOrder: true});
                          break;
                    }
                }
            }
        });    
	}
});