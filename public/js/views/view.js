var searchQuery =[];
App.DashboardView = Ember.View.extend({
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
                                search_text = search_text+stringMatch[i].replace(/"/g,""); 
                               // alert(search_text);                  
                            }
                            else{
                                search_text = search_text+"+"+stringMatch[i].replace(/"/g,"");
                                /*search_text = search_text+"+"+stringMatch[i];*/
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
        $.ajax ({
            type: "GET", 
            url:'/jqcloudCall',            
            success: function(data) {                                     
                for(var i=0;i<data.length;i++){                                    
                    searchQuery.push({text: data[i].searchQuery, weight: data[i].count});                   
                }
                $("#example").jQCloud(searchQuery);     
            },
            error:function(data){
                alert("Msg: "+ data.status + ": " + data.statusText);
            }                        
        });         
	}
});

App.SearchResultView = Ember.View.extend({
    
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
                                search_text = search_text+stringMatch[i].replace(/"/g,""); 
                               // alert(search_text);                  
                            }
                            else{
                                search_text = search_text+"+"+stringMatch[i].replace(/"/g,"");
                                /*search_text = search_text+"+"+stringMatch[i];*/
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

App.TagsView = Ember.View.extend({
    tagName : 'div',
    attributeBindings : [ 'name', 'id','border','width' ],
    classNamesBindings : [ 'class' ],
    didInsertElement : function() {
        
        $('#tags').textext({ 
            plugins : 'tags'
        });
        
    }
});


App.CVUploadTool = Ember.TextField.extend({
    tagName : 'input',
    attributeBindings : [ 'name', 'data-url' ],
    classNamesBindings : [ 'class' ],
    type : 'file',
    classNames : 'form-control',
    didInsertElement : function() {

        /*
         this.$().fileupload('option', {
         maxFileSize: 5000000
         });*/

        var that = this;

        this.$().fileupload({
            add : function(e, data) {
                var goUpload = true;
                var file = document.getElementById("uploadcv").value;
                var uploadFile = data.files[0];
                if (!(/\.(doc|docx)$/i)
                        .test(uploadFile.name)) {
                    addmessage("danger",'Please select an doc or docx file.');
                    goUpload = false;
                }               
                if (uploadFile.size > 5000000) { // 2mb
                    addmessage("warning",'Please upload a smaller file, max size is 5 MB');
                    goUpload = false;
                }
                if (goUpload == true) {
                    $('#uploadcv').hide();
                    $('#addEmpSbmt').attr('disabled',true);
                    data.context = $('<button/>').text('Upload')
                    .appendTo($("#uploadcv").parent())
                    .click(function (e) {
                        e.preventDefault();
                        $(this).parent().append('<div class="progress" id="#progress"> <div class="progress-bar progress-bar-aqua" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> </div> </div>');
                
                        //addmessage("info","Uploading "+data.files[0].name);
                        //data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                        data.submit();
                    });                 
                    
                    //data.submit();
                }
            },
            dataType : 'text',
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('.progress-bar').css(
                    'width',
                    progress + '%'
                );
            },          
            done : function(e, data) {
                //console.log(JSON.parse(data.result));
                $('.progress-bar').parent().prev().text('Uploaded').attr('disabled',true);
                $('#addEmpSbmt').attr('disabled',false);
                $('.uploadedfile').text(data.result);
            }

        });

    }

});


App.FileUploadTool = Ember.TextField.extend({
    tagName : 'input',
    attributeBindings : [ 'name', 'data-url' ],
    classNamesBindings : [ 'class' ],
    type : 'file',
    classNames : 'form-control',
    didInsertElement : function() {
        /*
         this.$().fileupload('option', {
         maxFileSize: 5000000
         });*/

        var that = this;

        this.$().fileupload({
            add : function(e, data) {
                var goUpload = true;
                var uploadFile = data.files[0];
                if (!(/\.(xls|xlsx)$/i)
                        .test(uploadFile.name)) {
                    addmessage("danger",'Please select an xls or xlsx file.');
                    goUpload = false;
                }               
                if (uploadFile.size > 5000000) { // 2mb
                    addmessage("warning",'Please upload a smaller file, max size is 5 MB');
                    goUpload = false;
                }
                if (goUpload == true) {
                    $('#importcandidatefile').attr('disable', true);
                    addmessage("info","Uploading "+data.files[0].name);
                    data.submit();
                }
            },
            dataType : 'text',
            done : function(e, data) {
                addmessage("success","Upload Complete");
                $('#importcandidatefile').attr('disable', false);
                console.log(JSON.parse(data.result));
            }

        });

    }

});

