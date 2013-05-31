Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        //Write app code here
        this.doLayout();
    },
    
    doLayout: function() { 

        
        var states = Ext.create('Ext.Container', {
                        scope: this,
                        items: [{
                            xtype: 'rallyattributecombobox',
                            model: 'Defect',
                            field: 'State',
                            multiSelect: true,
                            width: 300,
                        }]
                    });

        var priority = Ext.create('Ext.Container', {
                        scope: this,
                        items: [{
                            xtype: 'rallyattributecombobox',
                            model: 'Defect',
                            field: 'Priority',
                            multiSelect: true,
                            width: 300
                        }]
                    });
    
    
        var severity = Ext.create('Ext.Container', {
                        scope: this,
                        items: [{
                            xtype: 'rallyattributecombobox',
                            model: 'Defect',
                            field: 'Severity',
                            multiSelect: true,
                            width: 300
                        }]
                    });
                        
        var environment = Ext.create('Ext.Container', {
                        scope: this,
                        items: [{
                            xtype: 'rallyattributecombobox',
                            model: 'Defect',
                            field: 'Environment',
                            multiSelect: true,
                            width: 300
                        }]
                    });

       var daysrange = Ext.create('Ext.Container', {
                        scope: this,
                        title: 'Date Range',
                        bodyPadding: 10,
                        items: [{
                            xtype: 'numberfield',
                            anchor: '100%',
                            name: 'evens',
                            fieldLabel: 'Date Range',
                    
                            // Set step so it skips every other number
                            step: 1, value: 30,
                    
                            // Add change handler to force user-entered numbers to evens
                            listeners: {
                                change: function(field, value) {
                                    value = parseInt(value, 10);
                                    field.setValue(value);
                                }
                            }
                        }]
                    });

        var storerange = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"days", "name":"Days"},
                {"abbr":"weeks", "name":"Weeks"},
                {"abbr":"months", "name":"Months"},
                {"abbr":"quarters", "name":"Quarters"}
                ]
        });
                                 
        var typerange = Ext.create('Ext.form.ComboBox', {
                        scope: this,
                        fieldLabel: 'Chose range',
                        store: storerange,
                        queryMode: 'local',
                        valueField: 'abbr',
                        value: 'days',
                        // Template for the dropdown menu.
                        // Note the use of "x-boundlist-item" class,
                        // this is required to make the items selectable.
                        tpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                                '<div class="x-boundlist-item">{name}</div>',
                            '</tpl>'
                        ),
                        // template for the content inside text field
                        displayTpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                                '{name}',
                            '</tpl>'
                        )
                    });                           

        var loadButton = Ext.create('Ext.Button', {
                text: 'Load',
                renderTo: Ext.getBody(),
                handler: function() {
                    alert('You clicked the button!');
                }
            });
            

        this.add(states);
        this.add(priority); 
        this.add(severity);
        this.add(environment);
        this.add(daysrange);
        this.add(typerange);
        this.add(loadButton);
             
    }
   
});
