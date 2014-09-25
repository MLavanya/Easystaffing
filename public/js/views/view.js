var searchQuery=[];
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
                            callback(['CISCO','SRS', 'Infosys', 'Wipro','Capgemini']);
                            break;                                       
                    }
                }
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
                            callback(['CISCO','SRS', 'Infosys', 'Wipro','Capgemini']);
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
                if (!(/\.(docx)$/i)
                        .test(uploadFile.name)) {
                    addmessage("danger",'Please select docx file.');
                    goUpload = false;
                }               
                if (uploadFile.size > 5000000) { // 2mb
                    addmessage("warning",'Please upload a smaller file, max size is 5 MB');
                    goUpload = false;
                }
                if (goUpload == true) {
                    $('#uploadcv').hide();
                    $('#addEmpSbmt').attr('disabled',true);
                    data.context = $('<button/>').text('Click me to Upload')
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


App.CandidateSuggestionsView = Ember.View.extend({

    didInsertElement : function(){
/*
        var model = this.get('controller').get('content');
        var that = this;

        var key = model.city+"+"+model.country+"+"+model.skills+"+"+model.title+"+"+model.name+"+"+model.exp_max+"&fl=*,score";

        $.ajax ({
            type: "POST", 
            url:'/solrclient',
            data:{searchtext:key,schema:'c'},                   
            success: function(data) {  
                search_text="";
                // model.candidates = data.response.docs;
                //that.get('controller').set('content',model);
                that.set('result',data.response.docs);
            },
            error: function(data) {
                alert("Msg: "+ data.status + ": " + data.statusText);
            }
        }); 
*/
    }

});


App.VacancySuggestionsView = Ember.View.extend({

    didInsertElement : function(){
        
    }

});

App.JqcloudView = Ember.View.extend({
    didInsertElement: function(){
        $.ajax ({
            type: "GET", 
            url:'/jqcloudCall',            
            success: function(data) {         
                searchQuery = [];                            
                for(var i=0;i<data.length;i++){                                    
                    searchQuery.push({text: '<a href="#/searchResult/'+data[i].searchQuery+'">'+data[i].searchQuery+'</a>', weight: data[i].count});                   
                }
                $("#example").jQCloud(searchQuery);     
            },
            error:function(data){
                alert("Msg: "+ data.status + ": " + data.statusText);
            }                        
        }); 
    }
});


App.VSuggestionsView = Ember.View.extend({
    tagName : 'div',
    attributeBindings : [ 'name','id' ],
    classNamesBindings : [ 'class' ],

    didInsertElement : function() {

        var sug = $('#suggestions');

        var m = this.get('controller').get('content').details;
        var key = m.city+"+"+m.country+"+"+m.skills;

        $.ajax ({
            type: "POST", 
            url:'/solrclient',
            data:{searchtext:key,schema:'v'},                   
            success: function(data) {  
                var cs = data.response.docs;
                var res="";

                for(var i=0; i<(cs.length>3?3:cs.length); i++){

                    res = res  + '<div class="panel-body">'
                        +'<p><i class="panel-title-icon fa fa-user"></i><strong>'+cs[i].vname+'</strong></p>'
                        +'<span id="stars-rating-example"><ul class="widget-rating"><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li><a href="#" title="" class="widget-rating-item"></a></li></ul></span>'
                        +'<p> '+cs[i].vexp_min+' to '+cs[i].vexp_min+' years Exp</p>'
                        +'<div class="search-tags">'
                        +'<span class="search-tags-text">Tags:</span>';

                    var r = cs[i].vskills.split(",");
                    for(var j=0;j<r.length;j++){
                        res = res+'<label class="label label-success">'+r[j]+'</label>&nbsp;';
                    }

                    res = res + '</div><br/>'
                        +'</div>';
                }

                sug.html(res);

            },
            error: function(data) {
                sug.html("");
            }
        }); 

    }

});

App.CSuggestionsView = Ember.View.extend({
    tagName : 'div',
    attributeBindings : [ 'name','id' ],
    classNamesBindings : [ 'class' ],

    didInsertElement : function() {

        var sug = $('#suggestions');

        var m = this.get('controller').get('content');
        var key = m.city+"+"+m.country+"+"+m.skills;

        $.ajax ({
            type: "POST", 
            url:'/solrclient',
            data:{searchtext:key,schema:'c'},                   
            success: function(data) {  
                var cs = data.response.docs;
                var res="";

                for(var i=0; i<(cs.length>3?3:cs.length); i++){

                    res = res  + '<div class="panel-body">'
                        +'<p><i class="panel-title-icon fa fa-user"></i><strong>'+cs[i].cname+'</strong></p>'
                        +'<span id="stars-rating-example"><ul class="widget-rating"><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li class="active"><a href="#" title="" class="widget-rating-item"></a></li><li><a href="#" title="" class="widget-rating-item"></a></li></ul></span>'
                        +'<p> '+cs[i].cexp+' years Exp</p>'
                        +'<div class="search-tags">'
                        +'<span class="search-tags-text">Tags:</span>';

                    var r = cs[i].cskills.split(",");
                    for(var j=0;j<r.length;j++){
                        res = res+'<label class="label label-success">'+r[j]+'</label>&nbsp;';
                    }

                    res = res + '</div><br/>'
                        +'</div>';
                }

                sug.html(res);

            },
            error: function(data) {
                sug.html("");
            }
        }); 

    }

});

App.PieChartView = Ember.View.extend({
    didInsertElement:function(){
        // Easy Pie Charts
        var easyPieChartDefaults = {
            animate: 2000,
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'square',
            size: 90,
            trackColor: '#e5e5e5'
        };
        jQuery('#easy-pie-chart-1').easyPieChart($.extend({}, easyPieChartDefaults, {
            barColor: '#489cdf'
        }));
        $('#easy-pie-chart-2').easyPieChart($.extend({}, easyPieChartDefaults, {
            barColor: '#489cdf'
        }));
        $('#easy-pie-chart-3').easyPieChart($.extend({}, easyPieChartDefaults, {
            barColor: '#489cdf'
        }));
        $('#easy-pie-chart-4').easyPieChart($.extend({}, easyPieChartDefaults, {
            barColor: '#489cdf'
        }));                                
    }

});

App.AddCandidateView = Ember.View.extend({

    didInsertElement: function(){
        $("input.form-control").val("");
    }
});

App.AddVacancyView = Ember.View.extend({

    didInsertElement: function(){
        $(".form-control input").val("");
    }
});