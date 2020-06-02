import { Tree } from "./tree.js";
import { knownFunctions } from "./knownFunctions.js";

export const moduleParams = {};

// The questionQueue is an Tree which contains
// the question ids in the order they should be displayed.
export const questionQueue = new Tree();

export function isFirstQuestion() {
  return questionQueue.isEmpty() || questionQueue.isFirst();
}

function numberOfInputs(element) {
  let resps = Array.from(element.querySelectorAll("input, textarea, select")).reduce((acc, current) => {
    //if (["submit", "button"].includes(current.type)) return acc;
    if (current.type == "submit") return acc;
    if (["radio", "checkbox"].includes(current.type)) {
      acc[current.name] = true;
    } else {
      acc[current.id] = true;
    }
    return acc;
  }, {});
  return Object.keys(resps).length;
}

function setFormValue(form, value, id) {
  if (numberOfInputs(form) == 1) {
    form.value = value;
  } else {
    if (!form.value) {
      form.value = {};
    }
    form.value[id] = value;
  }
}

// here are function that handle the
// user selection and attach the
// selected value to the form (question)
export function textBoxInput(event) {
  let inputElement = event.target;
  textboxinput(inputElement);
}

export function textboxinput(inputElement) {
  // what is going on here...
  // we are checking if we should click the checkbox/radio button..
  // first see if the parent is a div and the first child is a checkbox...
  if (inputElement.parentElement && inputElement.parentElement.tagName == "LABEL") {
    let rbCb = inputElement.parentElement.previousSibling;
    rbCb.checked = inputElement.value.length > 0;
    radioAndCheckboxUpdate(rbCb);
  }

  let value = handleXOR(inputElement);
  let id = inputElement.getAttribute("xor") ? inputElement.getAttribute("xor") : inputElement.id;
  value = value ? value : inputElement.value;

  setFormValue(inputElement.form, value, id);
}

export function numberInput(event) {
  let inputElement = event.target;
  numberInputUpdate(inputElement);
}

export function numberInputUpdate(inputElement) {
  // what is going on here..
  if ([...inputElement.parentElement.querySelectorAll("input[type=number]")].filter((x) => x != inputElement).length >= 1) {
    [...inputElement.parentElement.querySelectorAll("input[type=number]")]
      .filter((x) => x != inputElement)
      .map((x) => (x.value = ""));
  }

  let value = handleXOR(inputElement);
  let id = inputElement.hasAttribute("xor") ? inputElement.getAttribute("xor") : inputElement.id;

  setFormValue(inputElement.form, value, id);
}

// onInput/Change handler for radio/checkboxex
export function rbAndCbClick(event) {
  let inputElement = event.target;
  // when we programatically click, the input element is null.
  // however we call radioAndCheckboxUpdate directly..
  if (inputElement) {
    radioAndCheckboxUpdate(inputElement);
  }
}

export function radioAndCheckboxUpdate(inputElement) {
  if (!inputElement) return;
  clearSelection(inputElement);

  let selectedValue = {};
  if (inputElement.type == "checkbox") {
    // get all checkboxes with the same name attribute...
    selectedValue = Array.from(inputElement.form.querySelectorAll(`input[type="checkbox"][name=${inputElement.name}]`))
      .filter((x) => x.checked)
      .map((x) => x.value);
  } else {
    // we have a radio button..  just get the selected value...
    selectedValue = inputElement.value;
  }

  setFormValue(inputElement.form, selectedValue, inputElement.name);
}

function clearSelection(inputElement) {
  if (!inputElement.form || inputElement.type != "checkbox") return;
  let state = inputElement.checked;
  // WARNING.. we are not dealing with the unlikely case that
  //           there are 2 set of checkboxes in the question....

  let cb = inputElement.form.querySelectorAll("input[type='checkbox']");
  if (inputElement.value == 99) {
    // if you clicked the "Prefer not to answer" button, clear all
    // element except the input element...
    cb.forEach((element) => {
      element.checked = element == inputElement;
    });
  } else {
    // if you click any other button, leave the element checked as is
    // until you hit the "prefer not to answer button", which is cleared.
    cb.forEach((element) => {
      element.checked = element.value == 99 ? false : element.checked;
    });
  }
}

function handleXOR(inputElement) {
  if (!inputElement.hasAttribute("xor")) {
    return inputElement.value;
  }

  let valueObj = {};
  valueObj[inputElement.id] = inputElement.value;
  let sibs = [...inputElement.parentElement.querySelectorAll("input")];
  sibs = sibs.filter(
    (x) => x.hasAttribute("xor") && x.getAttribute("xor") == inputElement.getAttribute("xor") && x.id != inputElement.id
  );

  sibs.forEach((x) => {
    x.value = "";
    valueObj[x.id] = x.value;
  });
  return valueObj;
}

export function nextClick(norp, store) {
  // Because next button does not have ID, modal will pass-in ID of question
  // norp needs to be next button element
  if (typeof norp == "string") {
    norp = document.getElementById(norp).querySelector(".next");
  }

  //handle the soft and hard edits...
  if (
    norp.parentElement.getAttribute("softedit") == "true" &&
    getSelected(norp.parentElement).filter((x) => x.type !== "hidden").length == 0
  ) {
    document.getElementById(
      "softModalFooter"
    ).innerHTML = `<button type="button" id="continueButton" class="btn btn-light" data-dismiss="modal">Continue Without Answering</button>
     <button type="button" class="btn btn-light" data-dismiss="modal">Answer the Question</button>`;
    let f1 = nextPage;
    f1 = f1.bind(f1, norp, store);
    document.getElementById("continueButton").onclick = f1;
    $("#softModal").modal("toggle");
  } else if (norp.getAttribute("data-target") == "#hardModal" && getSelected(norp.parentElement) == 0) {
    $("#hardModal").modal("toggle");
    return null;
  } else {
    nextPage(norp, store);
  }
}

let questRes = {};
let tempObj = {};

async function updateTreeInLocalForage() {
  let questName = moduleParams.questName;
  await localforage.setItem(questName + ".treeJSON", questionQueue);
}

function getNextQuestionId(currentFormElement) {
  // get the next question from the questionQueue
  // if it exists... otherwise get the next look at the
  // markdown and get the question follows.
  let nextQuestionNode = questionQueue.next();
  if (nextQuestionNode.done) {
    // We are at the end of the question queue...
    // get the next element from the markdown...
    let tmp = currentFormElement.nextElementSibling;
    // we are at a question that should be displayed add it to the queue and
    // make it the current node.
    questionQueue.add(tmp.id);
    nextQuestionNode = questionQueue.next();
  }

  return nextQuestionNode.value;
}

// norp == next or previous button (which ever is clicked...)
async function nextPage(norp, store) {
  // The root is defined as null, so if the question is not the same as the
  // current value in the questionQueue. Add it.  Only the root should be effected.
  // NOTE: if the root has no children, add the current question to the queue
  // and call next().

  let questionElement = norp.form;
  if (questionQueue.isEmpty()) {
    console.log("==> the tree is empty... add first element", questionElement, questionElement.id);
    questionQueue.add(questionElement.id);
    questionQueue.next();
  }
  let questName = moduleParams.questName;

  tempObj[questionElement.id] = questionElement.value;
  questRes = tempObj;
  if (store && questionElement.value) {
    let formData = {};
    formData[`${questName}.${questionElement.id}`] = questionElement.value;
    store(formData);
  } else {
    let tmp = await localforage
      .getItem(questName)
      .then((allResponses) => {
        // if their is not an object in LF create one that we will add later...
        if (!allResponses) {
          allResponses = {};
        }
        // set the value for the questionId...
        allResponses[questionElement.id] = questionElement.value;

        return allResponses;
      })
      .then((allResponses) => {
        // allResposes really should be defined at this point. If it wasn't
        // previously in LF, the previous block should have created it...
        localforage.setItem(questName, allResponses, () => {
          console.log("... Response stored in LF");
        });
      });

    //       let tempObj = {};
    //   tempObj = await localforage.getItem(questName);
    //   if (tempObj[norp.parentElement.id]) {
    //     tempObj[norp.parentElement.id] = norp.parentElement.value;
    //   } else {
    //     tempObj[norp.parentElement.id] = {};
    //     tempObj[norp.parentElement.id] = norp.parentElement.value;
    //   }
    //   localforage.setItem(questName, tempObj);
    // } else {
    //   localforage.setItem(questName, questRes);
    // }
  }

  // check if we need to add questions to the question queue
  checkForSkips(questionElement);

  if (checkValid(questionElement) == false) {
    return null;
  }

  let nextQuestionId = getNextQuestionId(questionElement);
  // get the actual HTML element.
  let nextElement = document.getElementById(nextQuestionId.value);

  // before we add the next question to the queue...
  // check for the displayif status...
  while (nextElement.hasAttribute("displayif")) {
    // not sure what to do if the next element is is not a question ...
    if (nextElement.classList.contains("question")) {
      let display = parse(nextElement.getAttribute("displayif"));
      console.log(nextElement.getAttribute("displayif"), display);
      if (display) break;

      questionQueue.pop();
      nextQuestionId = getNextQuestionId(nextElement);
      nextElement = document.getElementById(nextQuestionId.value);
    } else {
      console.log(" ============= next element is not a question...  not sure what went wrong...");
      console.trace();
    }
  }

  [...nextElement.querySelectorAll("span[forid]")].map((x) => {
    let elm = document.getElementById(x.getAttribute("forid"));
    if (elm.tagName == "LABEL") {
      x.innerHTML = elm.innerHTML;
    } else {
      x.innerHTML = elm.value != "" ? elm.value : x.getAttribute("optional");
    }
  });

  Array.from(nextElement.querySelectorAll("input[data-max-validation-dependency]")).map(
    (x) => (x.max = document.getElementById(x.dataset.maxValidationDependency).value)
  );
  Array.from(nextElement.querySelectorAll("input[data-min-validation-dependency]")).map(
    (x) => (x.min = document.getElementById(x.dataset.minValidationDependency).value)
  );

  // check all responses for next question
  [...nextElement.children]
    .filter((x) => x.hasAttribute("displayif"))
    .map((elm) => {
      let f = parse(elm.getAttribute("displayif"));

      elm.style.display = f ? "run-in" : "none";
    });

  // check min/max for variable substitution in validation
  function exchangeValue(element, attrName) {
    let attr = element.getAttribute(attrName);
    if (attr) {
      let isnum = /^[\d\.]+$/.test(attr);
      if (!isnum) {
        element.setAttribute(attrName, document.getElementById(attr).value);
      }
    }
    return element;
  }
  [...nextElement.children]
    .filter((x) => x.hasAttribute("min") || x.hasAttribute("max"))
    .map((element) => exchangeValue(element, "min"))
    .map((element) => exchangeValue(element, "max"));

  // hide the current question and move to the next...
  questionElement.classList.remove("active");
  nextElement.classList.add("active");

  // FINALLY...  update the tree in localForage...
  // First let's try NOT waiting for the function to return.
  updateTreeInLocalForage();

  questionQueue.ptree();
  return nextElement;
}

export async function previousClicked(norp, retrieve) {
  // get the previousElement...
  let pv = questionQueue.previous();
  let prevElement = document.getElementById(pv.value.value);
  norp.form.classList.remove("active");
  prevElement.classList.add("active");

  if (retrieve) {
    const response = await retrieve();
    console.log(response);
  } else localforage.removeItem(norp.form.id);

  updateTreeInLocalForage();
  return prevElement;
}

// this function just adds questions to the
// question queue.  It always returns null;
function checkForSkips(questionElement) {
  // get selected responses
  let selectedElements = getSelected(questionElement);

  let numSelected = selectedElements.filter((x) => x.type != "hidden").length;
  // if there are NO non-hidden responses ...
  if (numSelected == 0) {
    // there may be either a noResponse, a default response
    // or both or neither...

    // sort array so that noResponse comes first..
    // noResponse has a classlist length of 1/default =0
    let classSort = function (a, b) {
      return b.length - a.length;
    };
    selectedElements.sort(classSort);
  } else {
    // something was selected... remove the no response hidden tag..
    selectedElements = selectedElements.filter((x) => !x.classList.contains("noresponse"));
  }

  // if there is a skipTo attribute, add them to the beginning of the queue...
  // add the selected responses to the question queue
  selectedElements = selectedElements.filter((x) => x.hasAttribute("skipTo"));

  // make an array of the Elements, not the input elments...
  var ids = selectedElements.map((x) => x.getAttribute("skipTo"));
  //selectedElements = ids.map((x) => document.getElementById(x));

  // add all the ids for the selected elements with the skipTo attribute to the question queue
  //var ids = selectedElements.map(x => x.id);
  //questionQueue.addChildren(ids);

  // add all the selected elements with the skipTo attribute to the question queue
  if (ids.length > 0) {
    questionQueue.add(ids);
  }

  return null;
}

function checkValid(questionElement) {
  return questionElement.checkValidity();
}

function getSelected(questionElement) {
  // look for radio boxes, checkboxes, and  hidden elements
  // for checked items.  Return all checked items.
  // If nothing is checked, an empty array should be returned.
  // var rv = [
  //   ...questionElement.querySelectorAll(
  //     "input[type='radio'],input[type='checkbox'],input[type='hidden'],input[type='number']"
  //   )
  // ];

  var rv1 = [...questionElement.querySelectorAll("input[type='radio'],input[type='checkbox']")];

  var rv2 = [
    ...questionElement.querySelectorAll(
      "input[type='number'], input[type='text'], input[type='date'], input[type='email'], input[type='tel'], textarea, option"
    ),
  ];

  var rv3 = [...questionElement.querySelectorAll("input[type='hidden']")];

  rv1 = rv1.filter((x) => x.checked);
  rv2 = rv2.filter((x) => x.value.length > 0);
  rv3 = rv3.filter((x) => x.checked);

  // rv = rv.filter(x =>
  //   x.type == "radio" || x.type == "checkbox" || x.type == "hidden"
  //     ? x.checked
  //     : x.value.length > 0
  // );

  // we may need to guarentee that the hidden comes last.
  rv1 = rv1.concat(rv2);
  return rv1.concat(rv3);
}

// create a blank object for collecting
// the questionnaire results...
const res = {};
// on submit of the question(a <form> tag)
// call this function...
function getResults(element) {
  // clear old results or create a blank object in the results to
  // hold these results...
  res[element.id] = {};
  // when we add to the tmpRes object, only the correct
  // object in the results are touched...
  let tmpRes = res[element.id];

  let allResponses = [...element.querySelectorAll(".response")];
  // get all the checkboxes
  cb = allResponses.filter((x) => x.type == "checkbox").map((x) => (tmpRes[x.value] = x.checked));

  // get all the text and radio elements...
  rd = allResponses
    .filter((x) => (x.type == "radio" && x.checked) || ["text", "date", "email", "number", "tel"].includes(x.type))
    .map((x) => (tmpRes[x.name] = x.value));
}

// x is the questionnaire text

function parse(txt) {
  //https://stackoverflow.com/questions/6323417/regex-to-extract-all-matches-from-string-using-regexp-exec
  var re = /[\(\),]/g;
  var stack = [];
  var lastMatch = 0;

  for (const match of txt.matchAll(re)) {
    stack.push(match.input.substr(lastMatch, match.index - lastMatch));
    stack.push(match.input.charAt(match.index));
    lastMatch = match.index + 1;
  }
  // remove all blanks...
  stack = stack.filter((x) => x != "");

  while (stack.indexOf(")") > 0) {
    let callEnd = stack.indexOf(")");
    if (stack[callEnd - 4] == "(" && stack[callEnd - 2] == "," && stack[callEnd - 5] in knownFunctions) {
      // it might hurt performance, but for debugging
      // expliciting setting the variables are helpful...
      let fun = stack[callEnd - 5];
      let arg1 = stack[callEnd - 3];
      // arg1 one should be a id or a boolean...
      // either from a element in the document or
      // from the currently undefined last module...
      if (typeof arg1 === "string") {
        let element = document.getElementById(arg1);
        if (element != null) {
          arg1 = document.getElementById(arg1).value;
        } else {
          //look up by name
          let temp1 = [...document.getElementsByName(arg1)].filter((x) => x.checked)[0];
          arg1 = temp1 ? temp1.value : arg1;
          // ***** if it's neither... look in the previous module *****
          if (!temp1) {
            temp1 = moduleParams.previousResults[arg1];
            arg1 = temp1 ? temp1.value : arg1;
          }
        }
      }
      let arg2 = stack[callEnd - 1];
      let tmpValue = knownFunctions[fun](arg1, arg2);
      // replace from callEnd-5 to callEnd with  the results...
      // splice start at callEnd-5, remove 6, add the calculated value...
      stack.splice(callEnd - 5, 6, tmpValue);
    } else {
      console.log(stack);
      throw { Message: "Bad Displayif Function", Stack: stack };
    }
  }
  return stack[0];
}
