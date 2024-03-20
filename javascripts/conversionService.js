modelUIDs = [
       "e2a49aae-f9d3-4d90-b0f3-3b69c637f8ed",
       "504901e8-4161-48a7-9d64-41d43347f852",
        "45646083-d0b3-4b70-969e-bc743238a0c9",
        "3d298a06-7c00-4a21-b90e-34ff21b55ed1",
        "9a293aea-e835-438e-a75e-8aa0e48600f0",
        "68f51574-40a7-4072-a48c-297793110510",
        "1fb347d0-b0c1-4e1e-9e6a-ac780c049260",
        "7979d581-af5d-4d9c-b8ce-9334fd58cf8f",
        "dbe39358-50aa-4470-a3e6-a70daa01e385",
        "25625a91-676d-492f-997b-cdaac8efd32f",
        "5fde8a5e-69d5-423e-99c4-0041b49d20cd",
        "9b4d7299-f512-4639-ae83-7bc70b56a06c",
        "3b73fe82-2def-4eb3-a03c-60ae64869602",
        "349114ff-38f3-45fe-9882-f7f2ae7c56e5",
        "8a5cf08b-559f-4e47-96f2-4b3619bfaa43",
        "417fdd5d-9cdd-460a-acca-60c97a7397bb",
        "097763f3-8def-4f73-9d06-6c315aeddc58",
        "509f9076-4ebd-4aef-a90f-3a884307b721",
        "31f6d934-6e3c-4280-aa67-523a33eba286"
]

async function startViewer(modelName) {
        var viewer;
        let sessioninfo = await caasClient.getStreamingSession();
        await caasClient.enableStreamAccess(sessioninfo.sessionid, modelUIDs);

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: sessioninfo.endpointUri,
                model: modelName,
                streamingMode: Communicator.StreamingMode.OnDemand,
                boundingPreviewMode: Communicator.BoundingPreviewMode.All,
                enginePath: `https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer@20${versionNumer}`,
                rendererType: 0
        });

        viewer.start();

        return viewer; 

}

async function fetchVersionNumber() {
        let data = await caasClient.getHCVersion();
        versionNumer = data;        
        return data
}
  
async function initializeViewer() {
        var model_uid = ""

        let result = await startViewer("_empty")
    
    
        viewer = result
    
        const uiConfig = {
          containerId: "content",
          screenConfiguration: Sample.screenConfiguration,
        }
        const ui = new Communicator.Ui.Desktop.DesktopUi(viewer, uiConfig);
    
        viewer.setCallbacks({
          sceneReady: function () {
            snapToView(0)
            viewer.model.setEnableAutomaticUnitScaling(false)
            $(".dropdown").css('display', 'inline-block');
            viewer.getView().setProjectionMode(Communicator.Projection.Perspective);
            document.getElementById("dropdown").style.opacity = 0.5
            document.getElementById('dropdown').style.pointerEvents = 'none'
            document.getElementById("modelBrowserWindow").style.visibility = 'hidden'
            viewer.selectionManager.setNodeSelectionColor(Communicator.Color.createFromFloat(0, 144, 208));
            viewer.view.setPointSize(1, Communicator.PointSizeUnit.ScreenPixels)
            viewer.view.setBackfacesVisible(true)
    
            var op = viewer.operatorManager.getOperator(Communicator.OperatorId.Orbit)
            op.setOrbitFallbackMode(Communicator.OrbitFallbackMode.CameraTarget)
    
            var op = viewer.operatorManager.getOperator(Communicator.OperatorId.Zoom)
            op.setDollyZoomEnabled(true)
          },
          modelStructureReady: function () {
            viewer.model.loadSubtreeFromXmlFile(viewer.model.getRootNode(), "xml/combined.xml")
            document.getElementById("dropdown").style.opacity = 1
            document.getElementById('dropdown').style.pointerEvents = 'auto'
            viewer.view.setAmbientOcclusionEnabled(true);
            viewer.view.setDisplayIncompleteFrames(true);
    
          },
        });
    
        ;
        window.onresize = function () { viewer.resizeCanvas(); };
        // if (data.collection_id) {
        //   window.onbeforeunload = function () { $.get('/api/delete_collection?collection=' + [data.collection_id]); };
        // }
}