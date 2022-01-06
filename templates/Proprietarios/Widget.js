define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./Widget.html",
  "esri/dijit/Search",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "dojo/on", 
  "esri/layers/FeatureLayer", 
  "dojo/_base/lang",
  "jimu/Utils",
  "esri/tasks/query",
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  template,
  Search,
  Deferred,
  OnDemandList, 
  Selection, 
  Memory,
  on, 
  FeatureLayer, 
  lang,
  utils,
  Query
){
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    startup: function() {
      this.inherited(arguments)

      var search = new Search({

          enableButtonMode: false, 
  
          showInfoWindowOnSelect: false,
  
          theme: 'arcgisSearch',

          enableSearchingAll: true,
  
          sources: []
  
      });
       
      this.searchTree.appendChild(search.domNode);

      var sources = search.get("sources");

      sources.push({

        featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/2"),
        
        exactMatch: false,
  
        searchFields: ["sequencial"],
  
        displayField: "sequencial",
  
        outFields: ["*"],
  
        maxResults: 6,
  
        maxSuggestions: 6,
  
        enableSuggestions: true,
  
        minCharacters: 1,
  
      });

      sources.push({

        featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/2"),
        
        exactMatch: false,
  
        searchFields: ["denomin"],
  
        displayField: "denomin",
  
        outFields: ["*"],
  
        maxResults: 6,
  
        maxSuggestions: 6,
  
        enableSuggestions: true,
  
        minCharacters: 1,
  
      });

      sources.push({

        featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/2"),
        
        exactMatch: false,
  
        searchFields: ["proprietar"],
  
        displayField: "proprietar",
  
        outFields: ["*"],
  
        maxResults: 6,
  
        maxSuggestions: 6,
  
        enableSuggestions: true,
  
        minCharacters: 1,
  
      });
  
      search.set("sources", sources);

      this.own(on(search,'select-result', lang.hitch(this, function(e) {
        this.createList(e)
      })));

    },

    _getDataStore: function(e) {
      var featureSetRemapped = [];
      var def = new Deferred();
      var items = e.result.feature.attributes
      var keys = Object.keys(items);

      keys.forEach((key, index) => {
        featureSetRemapped.push(`<strong>${key}:</strong> <p>${items[key]}</p>`)
      });
        
        def.resolve(new Memory({
          data: featureSetRemapped
        })
      );
      return def;
    },
  
    createList: function(e) {
      this._getDataStore(e).then(lang.hitch(this, function(datastore) {
        var list = new (declare([OnDemandList, Selection]))({
          'store': datastore,
          'selectionMode': 'single',
          'renderRow': lang.hitch(this, function (object, options) {
            return this._createListItem(object);
          })
        }, this.listNode);
        list.startup();

        list.on('.dgrid-row:click', lang.hitch(this, function(evt) {
          var row = list.row(evt);
          var query = new Query();
          query.objectIds = [row.data];
          console.log(query.objectIds)
          this.featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, lang.hitch(this, function(result) {
            this.zoomToFeatures(result)
            console.log(result)
          }))
        }))
      }))
    },

    zoomToFeatures(features) {
      var featureSet = utils.toFeatureSet(features)
      utils.zoomToFeatureSet(map, featureSet)
    },
  
    _createListItem: function(featureObj) {
      var listItemRoot = document.createElement('DIV');
      listItemRoot.className = 'list-item';
      if(featureObj) {
            propSeq = document.createElement('div');
            propSeq.className = 'div-item';
            propSeq.innerHTML = featureObj;
            listItemRoot.appendChild(propSeq);

      } else {
        listItemRoot.innerHTML = 'NO DATA AVAILABLE';
      }
      return listItemRoot;
    },

  })
})