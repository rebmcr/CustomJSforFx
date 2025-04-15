// Script for surfacing the statuspanel element as a customizable module in Firefox 135+ by rebmcr
// Intended to be used with Aris' Add-on bar script, and is based on that code
//
// The statuspanel element is primarily responsible for displaying a href target (link URL) on mouseover

ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");

var AddStatusModule = {
  init: function() {

    // style sheet
	Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).loadAndRegisterSheet(
      Services.io.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(`
        #statuspanel-label {
          background-color: var(--toolbar-bgcolor)!important;
          color: var(--toolbar-color)!important;
          border: none!important;
          height: 26px!important;
        }
        #statuspanel {
          transition: none!important;
        }
      `), null, null),
      Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
    );

    // module
    try {
      if(document.getElementById('statusmodule') == null) {
        CustomizableUI.createWidget({
          id: "statusmodule",
          type: "custom",
          tooltiptext: "Status",
          label: "Status text",
          removable: true,
          onBuild: function() {
            var mod_statusmodule = document.createXULElement('hbox');
            mod_statusmodule.setAttribute('id', 'statusmodule');
            var el_placeholder = document.createXULElement('label'); // Make a placeholder label for the customize
            el_placeholder.setAttribute('id', 'statusmoduleinittext');
            el_placeholder.setAttribute('style', '{background-color: var(--toolbar-bgcolor); color: var(--toolbar-color); border: none; height: 26px; width: 200px; display: block;}');
            el_placeholder.setAttribute('value', 'Status text');
            mod_statusmodule.insertBefore(el_placeholder, mod_statusmodule.firstChild);
            gBrowser._appendStatusPanel = function() {
              var gStatusModule = document.getElementById('statusmodule');
              if(gStatusModule == null) {
                this.selectedBrowser.insertAdjacentElement("afterend", StatusPanel.panel);
              } else {
                var gStatusPlaceholderLabel = document.getElementById('statusmoduleinittext');
                if(gStatusPlaceholderLabel !== null) {
                  gStatusPlaceholderLabel.setAttribute('value', '');
                }
                gStatusModule.insertBefore(StatusPanel.panel, gStatusModule.firstChild);
              }
            }
            return mod_statusmodule;
          }
        });
      }
      gBrowser._appendStatusPanel()
    } catch(e) { Components.utils.reportError(e); }
  }
}

/* initialization delay workaround */
document.addEventListener('DOMContentLoaded', AddStatusModule.init(), false);
/* Use the below code instead of the one above this line, if issues occur */
/*
setTimeout(function(){
  AddStatusModule.init();
},2000);
*/
