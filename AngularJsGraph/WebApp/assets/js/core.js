function init() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });

    var bigfont = "bold 13pt Helvetica, Arial, sans-serif";

    // Common text styling
    function textStyle() {
        return {
            margin: 6,
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: bigfont
        }
    }

    myDiagram =
      $(go.Diagram, "myDiagram",
        {
            initialAutoScale: go.Diagram.Uniform,
            "linkingTool.direction": go.LinkingTool.ForwardsOnly,
            initialContentAlignment: go.Spot.Center,
            layout: $(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 100 }),
            "undoManager.isEnabled": true
        });

    var defaultAdornment =
      $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
          $(go.Placeholder)),
        // the button to create a "next" node, at the top-right corner
        $("Button",
          {
              alignment: go.Spot.TopRight,
              click: addNodeAndLink
          },  // this function is defined below
          new go.Binding("visible", "", function (a) { return !a.diagram.isReadOnly; }).ofObject(),
          $(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })
        ),
        $("Button",
          {
              alignment: go.Spot.TopLeft,
              click: deleteNode
          },  // this function is defined below
          new go.Binding("visible", "", function (a) { return !a.diagram.isReadOnly; }).ofObject(),
          $(go.Shape, "MinusLine", { desiredSize: new go.Size(6, 6) })
        )
      );

    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { selectionAdornmentTemplate: defaultAdornment },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, "Circle",
          {
              fill: yellowgrad, stroke: "black",
              portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
              toEndSegmentLength: 20, fromEndSegmentLength: 20
          }),
        $(go.TextBlock, "Page",
          {
              margin: 6,
              font: bigfont,
              editable: true
          },
          new go.Binding("text", "text").makeTwoWay()));

    // clicking the button of a default node inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var diagram = adorn.diagram;
        diagram.startTransaction("Add State");
        // get the node data for which the user clicked the button
        var fromNode = adorn.adornedPart;
        var fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        var toData = { text: "new" };
        var p = fromNode.location;
        console.log(p.y + 300);
        toData.loc = p.x + 200 + " " + p.y;  // the "loc" property is a string, not a Point object
        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);
        // create a link data from the old node data to the new node data
        var linkdata = {};
        linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
        linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
        // and add the link data to the model
        model.addLinkData(linkdata);
        // select the new Node
        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);
        diagram.commitTransaction("Add State");
    }

    function deleteNode(e, obj) {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;

        var diagram = adorn.diagram;
        diagram.startTransaction("Deleting Node");

        // get the node data for which the user clicked the button
        var fromNode = adorn.adornedPart;
        var fromData = fromNode.data;
        
        // remove the nodeData from the model
        var model = diagram.model;
        model.removeNodeData(fromData);

        diagram.commitTransaction("Deleting Node");
    }

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        new go.Binding("points").makeTwoWay(),
        { curve: go.Link.Bezier, toShortLength: 15 },
        new go.Binding("curviness", "curviness"),
        $(go.Shape,  // the link shape
          { stroke: "#2F4F4F", strokeWidth: 2.5 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "kite", fill: "#2F4F4F", stroke: null, scale: 2 })
    );

    myDiagram.linkTemplateMap.add("Comment",
      $(go.Link, { selectable: false },
        $(go.Shape, { strokeWidth: 2, stroke: "darkgreen" })));


    //var palette =
    //  $(go.Palette, "palette",  // create a new Palette in the HTML DIV element "palette"
    //    {
    //        // share the template map with the Palette
    //        nodeTemplateMap: myDiagram.nodeTemplateMap,
    //        autoScale: go.Diagram.Uniform  // everything always fits in viewport
    //    });

    //palette.model.nodeDataArray = [
    //  { category: "Source" },
    //  {}, // default node
    //  { category: "DesiredEvent" },
    //  { category: "UndesiredEvent", reasonsList: [{}] },
    //  { category: "Comment" }
    //];

    // read in the JSON-format data from the "mySavedModel" element
    load();
    layout();
}

function layout() {
    myDiagram.layoutDiagram(true);
}

// Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}
function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}