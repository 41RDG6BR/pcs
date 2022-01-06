define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  "./templates/Aeo/Widget",
  "./templates/Proprietarios/Widget",
  "./templates/Pocos/Widget",
  "dijit/layout/ContentPane",
  "dijit/layout/TabContainer",
  "dojo/_base/array",
  "dojo/domReady!",
],
function(
  declare, 
  BaseWidget, 
  Aeo,
  Prop,
  Pocos,
  ContentPane,
  TabContainer,
  array,
) {
  return declare([BaseWidget], {

    baseClass: 'esri-search',

    postCreate: function() {
      this.inherited(arguments);

      var tabs = [
        {
          title: this.nls.configTitles[0],
          content: pocos = new Pocos({})
        }, {
          title: this.nls.configTitles[1],
          content: aeo = new Aeo({
            nls: this.nls,
            folderUrl: this.folderUrl,
          })
        }, {
        title: this.nls.configTitles[2],
        content: prop = new Prop({
          nls: this.nls,
          folderUrl: this.folderUrl,
        })
      }];

      var tabContainer = new TabContainer({
        doLayout: false,
      }, this.tabContainer);
      
      array.forEach(tabs, function(tab){
          var cp = new ContentPane({
              title: tab.title,
              content: tab.content,
              style: 'height:300px;width:100%;',
          });
          tabContainer.addChild(cp);
          tabContainer.startup();
        })
        
    },
    
  });

});