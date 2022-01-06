define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./Widget.html",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "dojo/on", 
  "dojo/_base/lang",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "esri/tasks/query",
  "jimu/utils",
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  template,
  Search,
  FeatureLayer,
  on,
  lang,
  Deferred,
  OnDemandList, 
  Selection, 
  Memory,
  Query,
  utils,
){
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    startup: function() {
      this.inherited(arguments)

      var search = new Search({

          enableButtonMode: false, 
  
          showInfoWindowOnSelect: false,
  
          theme: 'arcgisSearch',
    
          sources: []
  
      });
       
      this.searchOne.appendChild(search.domNode);

      var sources = search.get("sources");
      
      sources.push({
        
        featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/0"),
  
        searchFields: ["camp_nm_ca"],
  
        displayField: "camp_nm_ca",
  
        exactMatch: false,
  
        outFields: ["camp_nm_ca", "clop_nm_cl", "poco_nm_co", "poco_md_la", "poco_md_lo"],
  
        maxResults: 6,
  
        maxSuggestions: 6,
  
        enableSuggestions: true,
  
        minCharacters: 1,
  
      });
      sources.push({
        
        featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/0"),
  
        searchFields: ["poco_nm_co"],
  
        displayField: "poco_nm_co",
  
        exactMatch: false,
  
        outFields: ["camp_nm_ca", "clop_nm_cl", "poco_nm_co", "poco_md_la", "poco_md_lo"],
  
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
      var def = new Deferred();

      var featureSetRemapped = [];

      featureSetRemapped.push({
        'featureGeo': e.result.feature.geometry,
        'campFeatureAttr': e.result.feature.attributes.camp_nm_ca,
        'clopFeatureAttr': e.result.feature.attributes.clpo_nm_cl,
        'coFeatureAttr': e.result.feature.attributes.poco_nm_co,
        'laFeatureAttr': e.result.feature.attributes.poco_md_la,
        'loFeatureAttr': e.result.feature.attributes.poco_md_lo,
      });          
        def.resolve(new Memory({
          data: featureSetRemapped
        })
      );
      return def;
    },
  
    createList: function(e) {
      console.log(e.result.feature)
      
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
        var campFeatureAttr, clopFeatureAttr, coFeatureAttr, laFeatureAttr, loFeatureAttr;

        // Create camp_nm_ca
        if(featureObj.campFeatureAttr && typeof featureObj.campFeatureAttr === 'string') {
          campFeatureAttr = document.createElement('strong');
          campF = document.createElement('P');
          campFeatureAttr.innerHTML = "Name:  ";
          campF.innerHTML = featureObj.campFeatureAttr

          var divNova = document.createElement("div");
          divNova.className = 'div-item';
          divNova.appendChild(campFeatureAttr);
          divNova.appendChild(campF);
          listItemRoot.appendChild(divNova);
        }
        // Create clopFeature
        if(featureObj.clopFeatureAttr && typeof featureObj.clopFeatureAttr === 'string') {
          clopFeatureAttr = document.createElement('H4');
          clopF = document.createElement('P');
          clopFeatureAttr.innerHTML = "Clop:  ";
          clopF.innerHTML = featureObj.clopFeatureAttr
          listItemRoot.appendChild(clopFeatureAttr);
          listItemRoot.appendChild(clopF);
        }
        // Create coFeatureAttr
        if(featureObj.coFeatureAttr && typeof featureObj.coFeatureAttr === 'string') {
          coFeatureAttr = document.createElement('strong');
          coF = document.createElement('P');
          coFeatureAttr.innerHTML = "Poco Co:  ";
          coF.innerHTML = featureObj.coFeatureAttr

          var dNova = document.createElement("div");
          dNova.className = 'div-item';
          dNova.appendChild(coFeatureAttr);
          dNova.appendChild(coF);
          listItemRoot.appendChild(dNova);
        }
        // Create laFeatureAttr
        if(featureObj.laFeatureAttr && typeof featureObj.laFeatureAttr === 'number') {
          laFeatureAttr = document.createElement('strong');
          laF = document.createElement('P');
          laFeatureAttr.innerHTML = "Latitude:  ";
          laF.innerHTML = featureObj.laFeatureAttr

          var laNova = document.createElement("div");
          laNova.className = 'div-item';
          laNova.appendChild(laFeatureAttr);
          laNova.appendChild(laF);
          listItemRoot.appendChild(laNova);
        }

        // Create loFeatureAttr
        if(featureObj.loFeatureAttr && typeof featureObj.loFeatureAttr === 'number') {
          loFeatureAttr = document.createElement('strong');
          loF = document.createElement('P');
          loFeatureAttr.innerHTML = "Longitude:  ";
          loF.innerHTML = featureObj.loFeatureAttr

          var loNova = document.createElement("div");
          loNova.className = 'div-item';
          loNova.appendChild(loFeatureAttr);
          loNova.appendChild(loF);
          listItemRoot.appendChild(loNova);
        }

      } else {
        listItemRoot.innerHTML = 'NO DATA AVAILABLE';
      }
      return listItemRoot;
    },

  })
})