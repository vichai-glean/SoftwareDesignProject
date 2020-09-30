//Global variables
const userType = "lecturer";

var selectedVertex = null;
const space = 4;
let selectedEdge = null;

const vertexRadius = 15;

let graph = new Graph(); //array of vertex objects, each having an array of adjacent vertices
let questionGraph = new Graph();

let clickedVertexIndex = -1;

//Question Setup
let questionType;
// let questionCode;
let questionCode = null;
let questionTitle = null;
let isCreate = false;
let questionLoaded = false;
let questionUse = "prac";

//Weighted
let weight = 0;
let weighted = false;

//Directed
let directed = false;

//Colored
let color = "0";
let colored = false;

//HTML DOM elements
const body = document.getElementById("body");

const lecturerDiv = document.getElementById("lecturerDiv");

const canvasDiv = document.getElementById("canvasDiv");

const vertexDiv = document.getElementById("vertexDiv");
const questionSetupDiv = document.getElementById("questionSetupDiv");

const addVertexDiv = document.getElementById("addVertexDiv");
const vertexColor = document.getElementById("vertexColor");
const vertexColorLabel = document.getElementById("vertexColorLabel");

const editVertexDiv = document.getElementById("editVertexDiv");
const editVertexColor = document.getElementById("editVertexColor");
const editVertexColorLabel = document.getElementById("editVertexColorLabel");

const rootDiv = document.getElementById("rootDiv");

const deleteVertexDiv = document.getElementById("deleteVertexDiv");

const edgeDiv = document.getElementById("edgeDiv");
const addEdgeDiv = document.getElementById("addEdgeDiv");
const edgeWeight = document.getElementById("edgeWeight");
const edgeWeightLabel = document.getElementById("edgeWeightLabel");

const updateEdgeDiv = document.getElementById("updateEdgeDiv");

const deleteEdgeDiv = document.getElementById("deleteEdgeDiv");

const createButton = document.getElementById("createButton");

//Bindings and event handlers
function addBindings() {
  //Question setup
  document.getElementById("questionTypeDD").onchange = setQuestionType;
  document.getElementById("directedCB").onchange = doDirected;
  document.getElementById("weightedCB").onchange = doWeighted;
  document.getElementById("questionUseRG").onchange = doSetQuestionUse;
  document.getElementById("setQuestionButton").onclick = doSetQuestion;

  //Vertices
  document.getElementById("addVertexButton").onclick = doAddVertex;
  document.getElementById("editVertexDD").onchange = editVertexSelected;
  document.getElementById("updateVertexButton").onclick = doUpdateVertex;
  document.getElementById("deleteVertexButton").onclick = doDeleteVertex;
  document.getElementById("setRootDD").onchange = setRoot;
  document.getElementById("clearRootButton").onclick = removeRootVertex;

  //Edges
  document.getElementById("addEdgeButton").onclick = doAddEdge;
  document.getElementById("updateEdgeDD").onchange = editEdgeSelected;
  document.getElementById("updateEdgeButton").onclick = doUpdateEdge;
  document.getElementById("deleteEdgeButton").onclick = doDeleteEdge;

  //Interface
  // document.getElementById("clearButton").onclick = doClear;
  document.getElementById("createButton").onclick = doCreate;
  window.addEventListener('keydown', handleKeyDown, false);
}

//Question setup
function setQuestionType() {
  let dropDown = document.getElementById("questionTypeDD");
  switch (dropDown.selectedIndex) {
    case 1:
      questionType = "bfs";
      break;
    case 2:
      questionType = "dfs";
      break;
    case 3:
      questionType = "mwst";
      break;
    case 4:
      questionType = "graphcolouring";
      break;
    case 5:
      questionType = "shortestpath";
      break;
  }

  setupInterface();
}

function doDirected() {
  let directedCB = document.getElementById('directedCB');

  if (directedCB.checked) {
    directed = true;
  } else if (!directedCB.checked) {
    directed = false;
  }

  setupInterface();
}

function doWeighted() {
  let weightedCB = document.getElementById('weightedCB');

  if (weightedCB.checked) {
    weighted = true;
  } else if (!weightedCB.checked) {
    weighted = false;
  }

  setupInterface();
}

function doSetQuestionUse() {
  let radioGroup = document.getElementsByName("questionUse")
  for (let i = 0; i < radioGroup.length; ++i) {
    if (radioGroup[i].checked) {
      questionUse = radioGroup[i].value;
    }
  }
}

//Vertices
function doAddVertex() {
  let valueText = document.getElementById("vertexValue");
  let colorText = document.getElementById("vertexColor");

  if (valueText.value.length != 0) {
    let value = valueText.value;
    let x = Math.random() * 450 + 50;
    let y = Math.random() * 350 + 50;
    if (colored) {
      if (colorText.value.length != 0) {
        color = colorText.value;

        graph.addVertex(value, x, y, color);

        populateDropDowns();
        redraw();

        console.log(graph.getAdjacenyMatrix());
      } else {
        alert("Please enter a value for the color");
      }
    } else {
      graph.addVertex(value, x, y, color);

      populateDropDowns();
      redraw();
    }
  } else {
    alert("Please enter a value for the vertex");
  }


}

function editVertexSelected() {
  let dropDown = document.getElementById("editVertexDD");
  let vertexID = dropDown.options[dropDown.selectedIndex].value;

  document.getElementById("editvertexValue").value = graph.getVertex(vertexID).getVertexVal();
  document.getElementById("editvertexColor").value = graph.getVertex(vertexID).getColor();
}

function doUpdateVertex() {
  let dropDown = document.getElementById("editVertexDD");

  let newValue = document.getElementById("editvertexValue").value;
  let newColor = document.getElementById("editvertexColor").value;
  console.log(newValue, newColor);
  // let newDist = document.getElementById("editdistFromRoot").textContent;

  if (dropDown.selectedIndex != 0) {
    let vertexID = dropDown.options[dropDown.selectedIndex].value;

    graph.updateVertexVal(vertexID, newValue);

    if (colored) {
      graph.updateVertexColor(vertexID, newColor);

    }
    // graph.getVertex(vertexID).setDistance(newDist);

    populateDropDowns();
    redraw();
  } else {
    if (clickedVertexIndex != -1) {
      graph.getVertex(clickedVertexIndex).setVertexVal(newValue);
      if (colored) {
        graph.getVertex(clickedVertexIndex).setColor(newColor);
      }
      // graph.getVertex(vertexID).setDistance(newDist);

      populateDropDowns();
      redraw();

    } else {
      alert("Please select a vertex to edit");
    }
  }
}

function doDeleteVertex() {
  let dropDown = document.getElementById("deleteVertexDD");

  if (dropDown.selectedIndex != 0) {
    let vertexID = dropDown.options[dropDown.selectedIndex].value;
    graph.removeVertex(vertexID);

    populateDropDowns();
    redraw();
  } else {
    alert("Please select a vertex to delete");
  }
}

function setRoot() {
  let dropDown = document.getElementById("setRootDD");

  if (dropDown.selectedIndex != 0) {
    let vertexID = dropDown.options[dropDown.selectedIndex].value;
    graph.setSourceNode(vertexID);

    populateDropDowns();
    redraw();
  } else {
    alert("Please select a vertex to set as the root");
  }
}

function removeRootVertex() {
  graph.setSourceNode(-1);
  redraw();
}

//Edges
function findEdgeIndex(edgesArray, first, second) {
  for (let i = 0; i < edgesArray.length; ++i) {
    if ((edgesArray[i].getVertexOne().getVertexID() == first && edgesArray[i].getVertexTwo().getVertexID() == second) || (edgesArray[i].getVertexOne().getVertexID() == second && edgesArray[i].getVertexTwo().getVertexID() == first)) {
      return i;
    }
  }
}

function doAddEdge() {
  let firstDropDown = document.getElementById("vertex1DD");
  let secondDropDown = document.getElementById("vertex2DD");

  let firstID = firstDropDown.options[firstDropDown.selectedIndex].value;
  let secondID = secondDropDown.options[secondDropDown.selectedIndex].value;

  let edgeWeight = document.getElementById("edgeWeight");

  function checkExists(first, second) {
    for (let i = 0; i < graph.edges.length; ++i) {
      if ((graph.edges[i].getVertexOne().getVertexID() == first && graph.edges[i].getVertexTwo().getVertexID() == second) || (graph.edges[i].getVertexOne().getVertexID() == second && graph.edges[i].getVertexTwo().getVertexID() == first)) {
        return true;
      }
    }
  }

  if (!checkExists(firstID, secondID)) {
    if (firstDropDown.selectedIndex != secondDropDown.selectedIndex) {
      if (firstDropDown.selectedIndex != 0) {
        if (secondDropDown.selectedIndex != 0) {
          weight = 1;
          if (weighted) {
            if (edgeWeight.value.length != 0) {

              weight = parseInt(edgeWeight.value);
              if (directed) {
                graph.addDirectedEdge(firstID, secondID, weight);
              } else {
                graph.addEdge(firstID, secondID, weight);
              }

              populateDropDowns();
              redraw();
            } else {
              alert("Please enter a weight for the edge")
            }
          } else {
            if (directed) {
              graph.addDirectedEdge(firstID, secondID, weight);
            } else {
              graph.addEdge(firstID, secondID, weight);
            }
            populateDropDowns();
            redraw();
          }
        } else {
          alert("Please select the second vertex");
        }
      } else {
        alert("Please select the first vertex");
      }
    } else {
      alert("Please select different vertices");
    }
  } else {
    alert("This edge already exists");
  }
}

function editEdgeSelected() {
  let dropDown = document.getElementById("updateEdgeDD");

  let weight;

  console.log(graph.directedEdges[dropDown.selectedIndex - 1]);
  console.log(graph.edges[dropDown.selectedIndex - 1]);

  if (directed) {
    weight = graph.directedEdges[dropDown.selectedIndex - 1].getWeightEdge();
  } else if (!directed) {
    weight = graph.edges[dropDown.selectedIndex - 1].getWeightEdge();
  }

  document.getElementById("editWeight").value = weight;
}

function doUpdateEdge() {
  let dropDown = document.getElementById("updateEdgeDD");

  let newWeight = document.getElementById("editWeight").value;

  if (dropDown.selectedIndex != 0) {
    if (directed) {
      graph.directedEdges[dropDown.selectedIndex - 1].setWeightEdge(newWeight);
    } else if (!directed) {
      graph.edges[dropDown.selectedIndex - 1].setWeightEdge(newWeight);
    }
    populateDropDowns();
    redraw();
  } else {
    alert("Please select an edge to edit");
  }
}

function doDeleteEdge() {
  let dropDown = document.getElementById("deleteEdgeDD");

  if (dropDown.selectedIndex != 0) {

    let selected = dropDown.options[dropDown.selectedIndex].textContent;

    let splitted = selected.split(" ");

    let edgeVertex1ID = splitted[1];
    let edgeVertex2ID = splitted[6];

    if (directed) {
      graph.removeDirectedEdge(edgeVertex1ID, edgeVertex2ID);
    } else {
      graph.removeEdge(edgeVertex1ID, edgeVertex2ID);
    }

    populateDropDowns();
    redraw();

  } else {
    alert("Please select an edge to delete");
  }
}

//Interface
function redraw() {
  graphics.fillStyle = "white";
  graphics.fillRect(0, 0, canvas.width, canvas.height);
  drawEdges();
  drawVertices();
}

function clearDropDown(DDB) {
  while (DDB.options.length > 1) {
    DDB.remove(1);
  }
}

function populateDropDowns() {
  const deleteVertexDD = document.getElementById("deleteVertexDD");
  const deleteEdgeDD = document.getElementById("deleteEdgeDD");
  const vertex1DD = document.getElementById("vertex1DD");
  const vertex2DD = document.getElementById("vertex2DD");
  const updateVertexDD = document.getElementById("editVertexDD");
  const editEdgeDD = document.getElementById("updateEdgeDD");
  const setRootDD = document.getElementById("setRootDD");

  clearDropDown(vertex1DD);
  clearDropDown(vertex2DD);
  clearDropDown(deleteVertexDD);
  clearDropDown(deleteEdgeDD);
  clearDropDown(updateVertexDD);
  clearDropDown(editEdgeDD);
  clearDropDown(setRootDD);

  //Add vertices to delete vertex and add edge drop downs
  function addVertexOption(DDB, value, ID, color) {
    let opt = document.createElement("option");
    opt.textContent = "Vertex " + ID.toString() + ": " + value;
    if (colored) {
      opt.textContent = "Vertex " + ID.toString() + ": " + value + " (Color: " + color.toString() + ")";
    }
    opt.value = ID;
    DDB.options.add(opt);
  }

  for (let i = 0; i < graph.getNumberVertices(); ++i) {
    addVertexOption(vertex1DD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(vertex2DD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(deleteVertexDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(updateVertexDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(setRootDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
  }

  //Add edges to delete edge drop downs
  function addEdgeOption(DDB, v1, v2, weight) {
    let opt = document.createElement("option");
    if (weighted) {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " <---" + weight + "---> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    } else {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " <-------> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    }
    DDB.options.add(opt);
  }

  function addDirectedEdgeOption(DDB, v1, v2, weight) {
    let opt = document.createElement("option");
    if (weighted) {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " ||---" + weight + "---> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    } else {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " ||-------> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    }
    DDB.options.add(opt);
  }

  for (let i = 0; i < graph.edges.length; ++i) {
    addEdgeOption(deleteEdgeDD, graph.edges[i].getVertexOne(), graph.edges[i].getVertexTwo(), graph.edges[i].getWeightEdge());
    addEdgeOption(editEdgeDD, graph.edges[i].getVertexOne(), graph.edges[i].getVertexTwo(), graph.edges[i].getWeightEdge());
  }

  for (let i = 0; i < graph.directedEdges.length; ++i) {
    addDirectedEdgeOption(deleteEdgeDD, graph.directedEdges[i].getVertexOne(), graph.directedEdges[i].getVertexTwo(), graph.directedEdges[i].getWeightEdge());
    addDirectedEdgeOption(editEdgeDD, graph.directedEdges[i].getVertexOne(), graph.directedEdges[i].getVertexTwo(), graph.directedEdges[i].getWeightEdge());

  }
}

// function doClear() {
//   graphics.fillStyle = "white";
//   graphics.fillRect(0, 0, canvas.width, canvas.height);
//
//   //Enable question setup stuff
//   document.getElementById("questionSetupDiv").style.display = "initial";
//   document.getElementById("edgeDiv").style.display = "none";
//   document.getElementById("addVertexDiv").style.display = "none";
//   document.getElementById("editVertexDiv").style.display = "none";
//   document.getElementById("deleteVertexDiv").style.display = "none";
//
//   setupInterface(questionType);
//
//   //Reset variables
//
//   graph = new Graph(); //array of vertex objects, each having an array of adjacent vertices
//   questionGraph = new Graph();
//
//   clickedVertexIndex = -1;
//
//   selectedVertex = null;
//
//   questionType;
//   questionCode = null;
//   isCreate = false;
//   questionLoaded = false;
//
//   weight = 0;
//   weighted = true;
//
//   directed = true;
//
//   color = "0";
//   colored = true;
//
//   //Clear dropdowns
//   populateDropDowns();
// }

function drawVertices() {
  for (let i = 0; i < graph.vertices.length; ++i) {
    graphics.save();
    graph.getVertex(i).drawVertex();
    graphics.restore();
  }
}

function drawEdges() {
  for (let i = 0; i < graph.edges.length; ++i) {
    graphics.save();
    graph.edges[i].drawEdge();
    graphics.restore();
  }


  for (let i = 0; i < graph.directedEdges.length; ++i) {
    graphics.save();
    graph.directedEdges[i].drawEdge();
    graphics.restore();
  }
}

function setupInterface() {
  //Clear page to add only what is needed
  if (body != null) {
    while (body.firstChild) {
      body.firstChild.remove();
    }
    body.appendChild(lecturerDiv);
  }

  if (lecturerDiv != null) {
    while (lecturerDiv.firstChild) {
      lecturerDiv.firstChild.remove();
    }
    lecturerDiv.appendChild(canvasDiv);
    lecturerDiv.appendChild(vertexDiv);
    lecturerDiv.appendChild(edgeDiv);
  }

  //Clear vertex div to add only what is needed
  if (vertexDiv != null) {
    while (vertexDiv.firstChild) {
      vertexDiv.firstChild.remove();
    }
    vertexDiv.appendChild(questionSetupDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(addVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(editVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(rootDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(deleteVertexDiv);
  }

  //Clear edge div to add only what is needed
  if (edgeDiv != null) {
    while (edgeDiv.firstChild) {
      edgeDiv.firstChild.remove();
    }
    edgeDiv.appendChild(addEdgeDiv);
    edgeDiv.appendChild(updateEdgeDiv);
    edgeDiv.appendChild(deleteEdgeDiv);
    edgeDiv.appendChild(createButton);
  }



  // switch (questionType) {
  //   case "bfs":
  //     colored = false;
  //     break;
  //   case "dfs":
  //     colored = false;
  //     break;
  //   case "mwst":
  //     colored = false;
  //     break;
  //   case "graphcolouring":
  //     colored = true;
  //     break;
  //   case "shortestpath":
  //     colored = false;
  //     break;
  // }

  if (colored) { //Only need to change colors - no root/edges

  } else if (!colored) { //Only need to add/delete edges and change root, no colors

  }
}

// function setupInterface() {
//   switch (questionType) {
//     case "bfs":
//       //Directed
//       document.getElementById("directedCB").style.display = "initial";
//       document.getElementById("directedCBLabel").style.display = "initial";

//       //Colored
//       colored = false;

//       //Weighted
//       document.getElementById("weightedCB").style.display = "initial";
//       document.getElementById("weightedCBLabel").style.display = "initial";

//       // document.getElementById("distFromRoot").style.display = "none";
//       // document.getElementById("distFromRootLabel").style.display = "none";
//       document.getElementById("editdistFromRoot").style.display = "none";
//       document.getElementById("editdistFromRootLabel").style.display = "none";

//       break;
//     case "dfs":
//       //Directed
//       document.getElementById("directedCB").style.display = "initial";
//       document.getElementById("directedCBLabel").style.display = "initial";

//       //Colored
//       colored = false;

//       //Weighted
//       document.getElementById("weightedCB").style.display = "initial";
//       document.getElementById("weightedCBLabel").style.display = "initial";

//       // document.getElementById("distFromRoot").style.display = "none";
//       // document.getElementById("distFromRootLabel").style.display = "none";
//       document.getElementById("editdistFromRoot").style.display = "none";
//       document.getElementById("editdistFromRootLabel").style.display = "none";

//       break;
//     case "mwst":
//       //Directed
//       document.getElementById("directedCB").style.display = "initial";
//       document.getElementById("directedCBLabel").style.display = "initial";

//       //Colored
//       colored = false;

//       //Weighted
//       document.getElementById("weightedCB").style.display = "initial";
//       document.getElementById("weightedCBLabel").style.display = "initial";
//       document.getElementById("weightedCB").checked = true;
//       weighted = true;

//       // document.getElementById("distFromRoot").style.display = "initial";
//       // document.getElementById("distFromRootLabel").style.display = "initial";
//       document.getElementById("editdistFromRoot").style.display = "initial";
//       document.getElementById("editdistFromRootLabel").style.display = "initial";

//       break;
//     case "graphcolouring":
//       //Directed
//       document.getElementById("directedCB").style.display = "none";
//       document.getElementById("directedCBLabel").style.display = "none";
//       directed = false;

//       //Colored
//       colored = true;

//       //Weighted
//       document.getElementById("weightedCB").style.display = "none";
//       document.getElementById("weightedCBLabel").style.display = "none";
//       weighted = false;

//       // document.getElementById("distFromRoot").style.display = "none";
//       // document.getElementById("distFromRootLabel").style.display = "none";
//       document.getElementById("editdistFromRoot").style.display = "none";
//       document.getElementById("editdistFromRootLabel").style.display = "none";

//       break;
//     case "shortestpath":
//       //Directed
//       document.getElementById("directedCB").style.display = "initial";
//       document.getElementById("directedCBLabel").style.display = "initial";

//       //Colored
//       colored = false;

//       //Weighted
//       document.getElementById("weightedCB").style.display = "initial";
//       document.getElementById("weightedCBLabel").style.display = "initial";
//       document.getElementById("weightedCB").checked = true;
//       weighted = true;

//       // document.getElementById("distFromRoot").style.display = "initial";
//       // document.getElementById("distFromRootLabel").style.display = "initial";
//       document.getElementById("editdistFromRoot").style.display = "initial";
//       document.getElementById("editdistFromRootLabel").style.display = "initial";

//       break;
//   }

//   if (colored) {
//     document.getElementById("vertexColor").style.display = "initial";
//     document.getElementById("vertexColorLabel").style.display = "initial";
//     document.getElementById("editvertexColor").style.display = "initial";
//     document.getElementById("editvertexColorLabel").style.display = "initial";
//   } else if (!colored) {
//     document.getElementById("vertexColor").style.display = "none";
//     document.getElementById("vertexColorLabel").style.display = "none";
//     document.getElementById("editvertexColor").style.display = "none";
//     document.getElementById("editvertexColorLabel").style.display = "none";
//   }

//   if (weighted) {
//     document.getElementById("edgeWeight").style.display = "initial";
//     document.getElementById("edgeWeightLabel").style.display = "initial";
//     document.getElementById("updateEdgeDiv").style.display = "initial";
//   } else if (!weighted) {
//     document.getElementById("edgeWeight").style.display = "none";
//     document.getElementById("edgeWeightLabel").style.display = "none";
//     document.getElementById("updateEdgeDiv").style.display = "none";
//   }
// }

function doSetQuestion() {
  let dropDown = document.getElementById("questionTypeDD");
  let qCode = document.getElementById("questionCodeLecturer");
  let qTitle = document.getElementById("questionTitle");

  isCreate = false;

  if (dropDown.selectedIndex != 0 && qTitle.value.length != 0) {
    switch (dropDown.selectedIndex) {
      case 1:
        questionType = "bfs";
        break;
      case 2:
        questionType = "dfs";
        break;
      case 3:
        questionType = "mwst";
        break;
      case 4:
        questionType = "graphcolouring";
        break;
      case 5:
        questionType = "shortestpath";
        break;
    }
    setupInterface();

    questionTitle = qTitle.value;

    alert("Question setup completed");

  } else {
    alert("Please select a question type and enter a title");
  }
}

//When lecturer submits graph
function doCreate() {
  //Jesse_new
  if (questionTitle != null) {
    //Jesse_new1
    // if question type is == to bfs/dfs/shortestpath then dont allow them to
    // create the graph if you can't visit every node from the source node
    var is_a_valid_graph = true;
    if ((questionType == "bfs" || questionType == "dfs" || questionType == "shortestpath") && graph.getSourceNode() == -1) {
      is_a_valid_graph = false;
    }
    else if (questionType == "bfs" || questionType == "dfs" || questionType == "shortestpath") {
      // check if can visit every node in graph
      is_a_valid_graph = graph.canVisitEachNodeFromSource();
    }

    if (is_a_valid_graph) {
      try {
        // var data = {
        //   id: questionCode,
        //   graph: graph.convertGraphToString(questionCode, questionType, questionUse)
        // }; //create object to pass into database , youll just put like id instead of name and the graph string instead of GFB

        //Jesse_new
        // isCreate = true;
        // console.log("isWeighted:",graph.isWeighted(),
        //   "isDirected:",graph.isDirected(),graph.getAdjacenyMatrix());

        // ref.push(data);
        //Jesse_new

        // alert("Saving graph...");

        //Save graph as text file
        var stringed = graph.convertGraphToString(questionCode, questionType, questionUse);
        var blob = new Blob([stringed], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "Graph_" + questionType + "_" + questionTitle + ".txt");

        //Save canvas as png
        var link = document.getElementById('link');
        link.setAttribute('download', 'Graph_' + questionType + "_" + questionTitle + '.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();

      } catch (err) {
        alert("Error occured while trying to submit lecturer question graph");
      }
    }
    //Jesse_new1
    else {
      alert("You must select a source node and you must be able to visit every node from the source node when creating a graph with question type bfs, dfs, or shortestpath.");
    }
  } else {
    alert("Confirm/enter question title and details.");
  }
}

//Jesse_new
// function gotData(data) {
//   if (isCreate) {
//     questionCode = null;
//   } else {
//     var data = data.val();
//     var keys = Object.keys(data);
//     var foundQuestionGraph = false;
//     for (var i = 0; i < keys.length; i++) {
//       var k = keys[i];
//       if (data[k].id === questionCode) {
//         foundQuestionGraph = true;
//         break;
//       }
//     }
//     if (foundQuestionGraph) {
//       alert("Question code already exists, please choose a new one.");
//       questionCode = null;
//     } else {
//       alert("Question Type: " + questionType + "\nQuestion Code: " + questionCode);
//     }
//   }
// }

//Jesse_new
// function errorData(err) {
//   alert("An error has occured while trying to validify the question code. Please try again.");
// }

//Jesse_new
// function validifyQuestionCode(questionCode) {
//   //fetch data, scan if question code has been used
//   ref.on("value", gotData, errorData);
// }
