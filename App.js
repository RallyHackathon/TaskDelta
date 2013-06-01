Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    items: [
    {
        xtype: 'container',
        itemId: 'iterationFilter',
    },
    {
        xtype: 'container',
        itemId: 'exportBtn',
    },
    {
        xtype: 'container',
        itemId: 'taskgrid',
        cls: 'grid'
    }],

    launch: function() {
        //Write app code here
        this.doLayout();
    },
    
    doLayout: function() { 
    
        this.down('#iterationFilter').add({
            xtype: 'rallyiterationcombobox',
            itemId: 'iterationComboBox',
            allowNoEntry: true,
            listeners: {
                select: this._onSelect,
                ready: this._onLoad,
                scope: this
            }
        });
        
  
         this.down('#exportBtn').add({ 
            xtype: 'rallybutton',
            text: 'Export to Excel',
            handler: this._onClick,
         });
            

    },
  
  
    _onClick: function(){

		if (/*@cc_on!@*/0) { //Exporting to Excel not supported in IE
            Ext.Msg.alert('Error', 'Exporting to CSV is not supported in Internet Explorer. Please switch to a different browser and try again.');
        } else if (document.getElementById('taskgrid')) {
            
        	Ext.getBody().mask('Exporting Tasks...');
            
            setTimeout(function() {
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
                var base64   = function(s) { return window.btoa(unescape(encodeURIComponent(s))) };
                var format   = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
                var table    = document.getElementById('taskgrid');

                var excel_data = '<tr>';
                Ext.Array.each(table.innerHTML.match(/<span .*?x-column-header-text.*?>.*?<\/span>/gm), function(column_header_span) {
                    excel_data += (column_header_span.replace(/span/g,'td'));
                });
                excel_data += '</tr>';
                Ext.Array.each(table.innerHTML.match(/<tr class="x-grid-row.*?<\/tr>/gm), function(line) {
                	excel_data += line.replace(/[^\011\012\015\040-\177]/g, '>>');
                });

                var ctx = {worksheet: name || 'Worksheet', table: excel_data};
                window.location.href = 'data:application/vnd.ms-excel;base64,' + base64(format(template, ctx));
                Ext.getBody().unmask();
            }, 500);
        }
    },
  
    _onLoad: function(comboBox) {
        Rally.data.ModelFactory.getModel({
            type:'Iteration',
            success:this._onModelRetrieved,
            scope: this
        });
    },

    _onSelect: function() {
        var filterConfig = {
            property:'Iteration',
            operator: '=',
            value: this.down('#iterationComboBox').getValue()
        };

        this.grid.filter(filterConfig, true, true);
    },


    _onModelRetrieved: function(model) {
        var totalDelta = 0;
        Rally.data.ModelFactory.getModel({
            type: 'Task',
            success: function(model) {
                this.grid = this.down('#taskgrid').add({
                    xtype: 'rallygrid',
                    id: 'taskgrid',
                    model: model,
                    enableEditing: false,
                    features: [{
                        ftype: 'summary'
                    }],
                    
                    columnCfgs: [
                        { text: "Task ID",
                          dataIndex: "FormattedID",
                          xtype: 'templatecolumn',
                          flex:1,
                          tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate') // make the ID a live link
                        },
                        
                        "Name",
                        { text: "WorkProduct", 
                          dataIndex: "WorkProduct",
                          flex: 2,
                          renderer : function(value) {
                              return value.Name;
                          },
                          summaryRenderer: function(){
                              return 'Totals:';
                          }
                        },"Project",
                        
                        { text: "Estimate", 
                          dataIndex: "Estimate",
                          flex: 1,
                          align: 'center',
                          summaryType: 'sum'
                        },
                        
                        { text: "ToDo", 
                          dataIndex: "ToDo",
                          flex: 1,
                          align: 'center',
                          summaryType: 'sum'
                        },
                        
                        { text: "Actuals", 
                          dataIndex: "Actuals",
                          flex: 1,
                          align: 'center',
                          summaryType: 'sum'
                        },
                        
                        { text: "Delta (Actuals - Estimate)",
                            id: "deltaColumn",
                            dataIndex: "Delta",
                            flex: 1,
                            align: 'center',
                            summaryType: 'sum',
                            summaryRenderer: function() {
                              return totalDelta;
                            },
                            renderer: function(value, metadata, record){
                                    var estimate = parseFloat(record.get('Estimate'));
                                    var actuals = parseFloat(record.get('Actuals'));
                                    
                                    if (isNaN(estimate)) { estimate = 0; }
                                    if (isNaN(actuals)) { actuals = 0; }
                                    value = (actuals - estimate);
                                    
                                    if (value > 0) {
                                        metadata.style = 'color:red;font-weight:bold';
                                    }
                                    else {
                                        metadata.style = '';                                    
                                    }
                                    totalDelta += value;
                                    return value;        
                                }
                        }],
                        
                    storeConfig: {
                        filters: [
                            {
                                property: 'Iteration',
                                operator: '=',
                                value: this.down('#iterationComboBox').getValue() 
                            }
                        ]
                    }                    
                });

            },
            scope: this
        });
    }
   
});
