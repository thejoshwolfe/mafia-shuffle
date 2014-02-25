var characters = [
  "Yoda", "Luke Skywalker", "Princess Leia", "Thermal Detonator", "Chewbacca",
  "Han Solo", "Obi-Wan Kenibo", "Bothan Spy", "Admiral Ackbar", "Ewok",
  "Emperor", "Darth Vader", "Prode Droid", "Rancor", "Bounty Hunter", "Stormtrooper", "EV-9D9", "Imperial Guard",
];
var included = {};
var originalCharacterCount = characters.length;
loadState();

var resultDiv = document.getElementById("resultDiv");
document.getElementById("shuffleButton").addEventListener("click", function() {
  var includedCharacters = characters.filter(function(character) {
    return included[character];
  });
  shuffle(includedCharacters);
  resultDiv.innerHTML = '' +
    '<button id="clearButton">Clear</button>' +
    '<ul>' +
      includedCharacters.map(function(character) {
        return '<li>' +
          sanitizeHtml(character) +
        '</li>';
      }).join("") +
    '</ul>';
  document.getElementById("clearButton").addEventListener("click", function() {
    resultDiv.innerHTML = "";
  });
});

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var selectedIndex = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[selectedIndex];
    array[selectedIndex] = tmp;
  }
}
function sanitizeHtml(s) {
  return s.replace("&", "&amp;").replace("<", "&lt;");
}

generateSourceList();
function generateSourceList() {
  document.getElementById("sourceList").innerHTML = '' +
    characters.map(function(character, i) {
      return '<li>' +
        '<label>' +
          '<input type="checkbox" id="character_'+i+'"'+(included[character]?' checked="true"':'')+'>' +
          sanitizeHtml(character) +
        '</label>' +
        (i >= originalCharacterCount ? '<button id="remove_character_'+i+'">x</button>' : '') +
      '</li>';
    }).join("") +
    '<li>' +
      '<button id="unselectAllButton">Unselect All</button>' +
    '</li>';
  characters.forEach(function(character, i) {
    var checkbox = document.getElementById("character_" + i);
    checkbox.addEventListener("click", function() {
      // wait for the value to change
      setTimeout(function() {
        included[character] = checkbox.checked;
        saveState();
      }, 0);
    });
    if (i >= originalCharacterCount) {
      document.getElementById("remove_character_" + i).addEventListener("click", function() {
        characters.splice(i, 1);
        delete included[character];
        generateSourceList();
      });
    }
  });
  document.getElementById("unselectAllButton").addEventListener("click", function() {
    included = {};
    generateSourceList();
  });
  saveState();
}

var newCharacterTextbox = document.getElementById("newCharacterTextbox");
newCharacterTextbox.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    // Enter
    addNewCharacter();
  }
  if (event.keyCode === 27) {
    // Escape
    newCharacterTextbox.value = "";
  }
});
document.getElementById("addCharacterButton").addEventListener("click", addNewCharacter);
function addNewCharacter() {
  var text = newCharacterTextbox.value.trim();
  if (text !== "" && characters.indexOf(text) === -1) {
    characters.push(text);
    generateSourceList();
    newCharacterTextbox.value = "";
  }
  newCharacterTextbox.focus();
}

function saveState() {
  localStorage.mafiaCharacters = JSON.stringify({
    characters: characters,
    included: included,
  });
}
function loadState() {
  var stateJson = localStorage.mafiaCharacters;
  if (stateJson == null) return;
  var state = JSON.parse(stateJson);
  characters = state.characters;
  included = state.included;
}
