modelUIDs = [
        "1be61fc1-b6ab-4a06-812f-d1f225ee179d","aa7377e6-4cfc-4915-aebd-651df0e62038","f204aac5-ac1b-440a-ba5d-85f20f9ac076",
        "f9781092-7efd-4d0e-a897-d4daf8b412e1",
        "47478491-0e47-4270-9590-ffc7164df2b3",
        "f5b9c8bb-a310-4ab0-b405-ace25ed890b5" ,
        "1d19abf3-c06d-44ea-a9c3-9ac989bd6a22",
        "8e80c44c-7593-4d99-b110-3c14749bc5b3",
        "c6ae6232-a2f8-4f4f-801b-b0a2e4b96825",
        "47a469cf-2cd0-4206-b6db-777f63956e4a",
        "454372dc-2605-4143-917c-43c12c1fc36d",
        "230ce4e4-103e-42f0-9b7d-b8d3d1d6faf4",
        "6db017dd-e37b-480a-8d29-3cbd33be5019",
        "0d5a3249-7e31-458b-89a5-8037379fe6f7",
        "00f31b86-d8fa-48b3-80cd-d4cc19faf6ce",
        "a076e40b-2935-4005-9d29-90bb716f32d2",
        "337cedf7-c547-4719-bfc0-4833da0c254e",
        "6d245164-aaef-4339-9246-1fe2127cc6a3",
        "17828854-c048-4c84-b9b2-21058647dcb8",
]

async function startViewer(modelName, uid) {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();
        var endpointUriBeginning = 'ws://';

        if(conversionServiceURI.substring(0, 5).includes("https")){
                endpointUriBeginning = 'wss://'
        }

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: endpointUriBeginning + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: modelName,
                streamingMode: Communicator.StreamingMode.OnDemand,
                boundingPreviewMode: Communicator.BoundingPreviewMode.All,
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return [viewer, data];

}

async function fetchVersionNumber() {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        let res = await fetch(conversionServiceURI + '/api/hcVersion');
        var data = await res.json();
        versionNumer = data;
        
        return data

}



async function initializeViewer() {
        var model_uid = ""

        let result = await startViewer(Communicator.EmptyModelName, model_uid)
    
    
        viewer = result[0]
        var data = result[1]
    
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
        if (data.collection_id) {
          window.onbeforeunload = function () { $.get('/api/delete_collection?collection=' + [data.collection_id]); };
        }
}