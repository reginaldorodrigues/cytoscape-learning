function initCytoscape() {

    cy = cytoscape({

        container: document.getElementById('cy'),

        //style: cytoscape.stylesheet()
            //.selector('edge')
            //    .css({
            //        'target-arrow-shape': 'triangle'
        //    }),
        
        elements: [
          { // node n1
              group: 'nodes', // 'nodes' for a node, 'edges' for an edge
              // NB the group field can be automatically inferred for you

              // NB: id fields must be strings or numbers
              data: { // element data (put dev data here)
                  id: 'n1', // mandatory for each element, assigned automatically on undefined
                  parent: 'nparent', // indicates the compound node parent id; not defined => no parent
              },

              // scratchpad data (usually temp or nonserialisable data)
              scratch: {
                  foo: 'bar'
              },

              position: { // the model position of the node (optional on init, mandatory after)
                  x: 100,
                  y: 100
              },

              selected: true, // whether the element is selected (default false)

              selectable: true, // whether the selection state is mutable (default true)

              locked: false, // when locked a node's position is immutable (default false)

              grabbable: true, // whether the node can be grabbed and moved by the user

              classes: 'foo bar' // a space separated list of class names that the element has
          },

          { // node n2
              data: { id: 'n2', test: 'test' },
              renderedPosition: { x: 200, y: 200 } // can alternatively specify position in rendered on-screen pixels
          },

          { // node n3
              data: { id: 'n3', parent: 'nparent' },
              position: { x: 123, y: 234 }
          },

          { // node n3
              data: { id: 'n4', parent: 'nparent' },
              position: { x: 110, y: 170}
          },

          { // node n3
              data: { id: 'n5', parent: 'nparent' },
              position: { x: 180, y: 80 }
          },

          { // node n3
              data: { id: 'n6', parent: 'nparent' },
              position: { x: 230, y: 240 }
          },

          { // node n3
              data: { id: 'n7', parent: 'nparent' },
              position: { x: 160, y: 260 }
          },

          //{ // node nparent
          //    data: { id: 'nparent', position: { x: 200, y: 100 } }
          //},

          //{ // edge e1
          //    data: {
          //        id: 'e1',
          //        // inferred as an edge because `source` and `target` are specified:
          //        source: 'n1', // the source node id (edge comes from this node)
          //        target: 'n2'  // the target node id (edge goes to this node)
          //    }
          //},
          //{
          //    data: {
          //        id: 'e2',
          //        source: 'n2',
          //        target: 'n3'
          //    }
          //}
        ],

        layout: {
            name: 'preset'
        },

        // so we can see the ids
        style: [
          {
              selector: 'node',
              style: {
                  'content': 'data(id)',
                  'background-color': 'white',
                  'border-color': 'black',
                  'border-width': 1
              }
          },
          {
              selector: 'node:selected',
              style: {
                  'background-color': 'white',
                  'border-color': 'red',
                  'border-width': 1
              }
          },
          {
              selector: 'edge',
              style: {
                  'target-arrow-shape': 'triangle',
                  'target-arrow-color': 'black',
                  'line-color': 'black',
              }
          }
        ]

    });

    cy.zoom(2);
    cy.center();
    

    var nodeFromId = 0;
    var edgeIdIncrement = 1;

    cy.on('click', 'node', function (evt) {
        console.log(evt.cyTarget.id());

        var nodeId = evt.cyTarget.id();

        if (nodeFromId != 0) {
            cy.add({
                data: {
                    id: 'e' + edgeIdIncrement,
                    source: nodeFromId,
                    target: nodeId
                }
            });

            edgeIdIncrement++;
            nodeFromId = 0;
        }
        else {
            //get the first node clicked
            nodeFromId = nodeId;
        }
    });

    $('.removeBtn').click(function () {
        cy.remove("node:selected");
    });
};

