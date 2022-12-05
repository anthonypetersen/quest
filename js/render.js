import { moduleParams, questions, queue } from "./quest.js";

export function startModule() {

    if(questions.stack.length > 0) {
        if(queue.isEmpty()) {
            queue.add(questions.first().params.id);
        }

        let questionToRender = queue.currentNode.value;

        displayQuestion(questionToRender);
    }
}

function nextQuestion() {
    
    // set answers
    // store (save)


    if(queue.next().done) {
        let currentQuestion = questions.find(queue.currentNode.value);
        let nextQuestion = questions.getNext(currentQuestion);
        queue.add(nextQuestion.params.id);
        queue.next();
    }

    // update tree
    
    let questionToRender = queue.currentNode.value;
    displayQuestion(questionToRender);
}

function previousQuestion() {

    // clear answers
    // store (remove)

    queue.previous();


    // update tree

    let questionToRender = queue.currentNode.value;
    displayQuestion(questionToRender);
}

function submitQuestionnaire() {

}

function displayQuestion(questionId) {

    let question = questions.find(questionId);

    document.getElementById("active-question").innerHTML = renderQuestion(question);
    document.getElementById("buttons").innerHTML = renderButtons(question);
    addListeners();
}

function renderButtons(question) {
    return `
        <div class="row">
            <div class="col-md-3 col-sm-12">
                ${question === questions.first() ? '' : `<input type='submit' id='previousButton' class='previous w-100' value='PREVIOUS'></input>`}
            </div>
            <div class="col-md-6 col-sm-12">
           
            </div>
            <div class=" col-md-3 col-sm-12">
                ${question === questions.last() ? '' : `<input type='submit' id='nextButton' class='next w-100' value='NEXT'></input>`}
            </div>
        </div>
    `;
}

function addListeners() {

    let previousButton = document.getElementById("previousButton");
    let nextButton = document.getElementById("nextButton");

    if(previousButton) previousButton.addEventListener("click", previousQuestion);
    if(nextButton) nextButton.addEventListener("click", nextQuestion);
}

function renderQuestion(question) {


    // replace #currentYear...
    let questText = question.params.text.replace(/#currentYear/g, new Date().getFullYear());
    // replace previous results $u
    // replace user profile variables...
    /*
    questText = questText.replace(/\{\$u:(\w+)}/g, (all, varid) => {
        return `<span name='${varid}'>${previousResults[varid]}</span>`;
    });
    */
    // replace {$id} with span tag
    questText = questText.replace(/\{\$(\w+):?([a-zA-Z0-9 ,.!?"-]*)\}/g, fID);
    function fID(fullmatch, forId, optional) {
        if (optional == undefined) {
            optional = "";
        } else {
            optional = optional;
        }
        return `<span forId='${forId}' optional='${optional}'>${forId}</span>`;
    }
    //adding displayif with nested questions. nested display if uses !| to |!
    questText = questText.replace(/!\|(displayif=.+?)\|(.*?)\|!/g, fDisplayIf);
    function fDisplayIf(containsGroup, condition, text) {
        text = text.replace(/\|(?:__\|){2,}(?:([^\|\<]+[^\|]+)\|)?/g, fNum);
        text = text.replace(/\|popup\|([\S][^|]+[\S])\|(?:([\S][^|]+[\S])\|)?([\S][^|]+[\S])\|/g, fPopover);
        text = text.replace(/\|@\|(?:([^\|\<]+[^\|]+)\|)?/g, fEmail);
        text = text.replace(/\|date\|(?:([^\|\<]+[^\|]+)\|)?/g, fDate);
        text = text.replace(/\|tel\|(?:([^\|\<]+[^\|]+)\|)?/g, fPhone);
        text = text.replace(/\|SSN\|(?:([^\|\<]+[^\|]+)\|)?/g, fSSN);
        text = text.replace(/\|state\|(?:([^\|\<]+[^\|]+)\|)?/g, fState);
        text = text.replace(/\((\d*)(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+\))?)?\)(.*?)(?=(?:\(\d)|\n|<br>|$)/g, fRadio);
        text = text.replace(/\[(\d*)(\*)?(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+?\))?)?\]\s*(.*?)\s*(?=(?:\[\d)|\n|<br>|$)/g, fCheck);
        text = text.replace(/\[text\s?box(?:\s*:\s*(\w+))?\]/g, fTextBox);
        text = text.replace(/\|(?:__\|)(?:([^\s<][^|<]+[^\s<])\|)?\s*(.*?)/g, fText);
        text = text.replace(/\|___\|((\w+)\|)?/g, fTextArea);
        text = text.replace(/\|time\|(?:([^\|\<]+[^\|]+)\|)?/g, fTime);
        text = text.replace(
            /#YNP/g,
            `(1) Yes
         (0) No
         (99) Prefer not to answer`
        );
        text = questText.replace(
            /#YN/g,
            `(1) Yes
         (0) No`
        );
        return `<span class='displayif' ${condition}>${text}</span>`;
    }

    //replace |popup|buttonText|Title|text| with a popover
    questText = questText.replace(
        /\|popup\|([\S][^|]+[\S])\|(?:([\S][^|]+[\S])\|)?([\S][^|]+[\S])\|/g,
        fPopover
    );
    function fPopover(fullmatch, buttonText, title, popText) {
        title = title ? title : "";
        popText = popText.replace(/"/g, "&quot;")
        return `<a tabindex="0" class="popover-dismiss btn btn" role="button" data-toggle="popover" data-trigger="focus" title="${title}" data-content="${popText}">${buttonText}</a>`;
    }

    // replace |@| with an email input
    questText = questText.replace(/\|@\|(?:([^\|\<]+[^\|]+)\|)?/g, fEmail);
    function fEmail(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "email");
        return `<input type='email' ${options} placeholder="user@example.com"></input>`;
    }

    // replace |date| with a date input
    questText = questText.replace(/\|date\|(?:([^\|\<]+[^\|]+)\|)?/g, fDate);
    function fDate(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "date");
        return `<input type='date' ${options}></input>`;
    }

    // replace |tel| with phone input

    questText = questText.replace(/\|tel\|(?:([^\|\<]+[^\|]+)\|)?/g, fPhone);
    function fPhone(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "tel");
        return `<input type='tel' ${options} pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}" maxlength="12" placeholder='###-###-####'></input>`;
    }

    // replace |SSN| with SSN input
    questText = questText.replace(/\|SSN\|(?:([^\|\<]+[^\|]+)\|)?/g, fSSN);
    function fSSN(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "SSN");
        return `<input type='text' ${options} id="SSN" class="SSN" inputmode="numeric" maxlength="11" pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{4}"   placeholder="_ _ _-_ _-_ _ _ _"></input>`;
    }



    // replace |SSNsm| with SSN input
    questText = questText.replace(/\|SSNsm\|(?:([^\|\<]+[^\|]+)\|)?/g, fSSNsm);
    function fSSNsm(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "SSNsm");
        return `<input type='text' ${options} class="SSNsm" inputmode="numeric" maxlength="4" pattern='[0-9]{4}'placeholder="_ _ _ _"></input>`;
    }

    // replace |state| with state dropdown
    questText = questText.replace(/\|state\|(?:([^\|\<]+[^\|]+)\|)?/g, fState);
    function fState(fullmatch, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "state");
        return `<select ${options}>
        <option value='' disabled selected>Choose a state: </option>
        <option value='AL'>Alabama</option>
        <option value='AK'>Alaska</option>
        <option value='AZ'>Arizona</option>
        <option value='AR'>Arkansas</option>
        <option value='CA'>California</option>
        <option value='CO'>Colorado</option>
        <option value='CT'>Connecticut</option>
        <option value='DE'>Delaware</option>
        <option value='DC'>District Of Columbia</option>
        <option value='FL'>Florida</option>
        <option value='GA'>Georgia</option>
        <option value='HI'>Hawaii</option>
        <option value='ID'>Idaho</option>
        <option value='IL'>Illinois</option>
        <option value='IN'>Indiana</option>
        <option value='IA'>Iowa</option>
        <option value='KS'>Kansas</option>
        <option value='KY'>Kentucky</option>
        <option value='LA'>Louisiana</option>
        <option value='ME'>Maine</option>
        <option value='MD'>Maryland</option>
        <option value='MA'>Massachusetts</option>
        <option value='MI'>Michigan</option>
        <option value='MN'>Minnesota</option>
        <option value='MS'>Mississippi</option>
        <option value='MO'>Missouri</option>
        <option value='MT'>Montana</option>
        <option value='NE'>Nebraska</option>
        <option value='NV'>Nevada</option>
        <option value='NH'>New Hampshire</option>
        <option value='NJ'>New Jersey</option>
        <option value='NM'>New Mexico</option>
        <option value='NY'>New York</option>
        <option value='NC'>North Carolina</option>
        <option value='ND'>North Dakota</option>
        <option value='OH'>Ohio</option>
        <option value='OK'>Oklahoma</option>
        <option value='OR'>Oregon</option>
        <option value='PA'>Pennsylvania</option>
        <option value='RI'>Rhode Island</option>
        <option value='SC'>South Carolina</option>
        <option value='SD'>South Dakota</option>
        <option value='TN'>Tennessee</option>
        <option value='TX'>Texas</option>
        <option value='UT'>Utah</option>
        <option value='VT'>Vermont</option>
        <option value='VA'>Virginia</option>
        <option value='WA'>Washington</option>
        <option value='WV'>West Virginia</option>
        <option value='WI'>Wisconsin</option>
        <option value='WY'>Wyoming</option>
      </select>`;
    }


    function guaranteeIdSet(options, inputType = "inp") {
        if (options == undefined) {
            options = "";
        }
        options = options.trim();
        let elementId = options.match(/id=([^\s]+)/);
        if (!elementId) {
            elementId = `${question.params.id}_${inputType}`;
            options = `${options} id=${elementId}`;
        } else {
            elementId = elementId[1];
        }
        return { options: options, elementId: elementId };
    }

    // replace |image|URL|height,width| with a html img tag...
    questText = questText.replace(
        /\|image\|(.*?)\|(?:([0-9]+),([0-9]+)\|)?/g,
        "<img src=https://$1 height=$2 width=$3>"
    );

    //regex to test if there are input as a part of radio or checkboxes
    //    /(\[|\()(\d*)(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+?\))?)?(\)|\])\s*(.*?\|_.*?\|)\s*(?=(?:\[\d)|\n|<br>|$)/g
    var radioCheckboxAndInput = false;
    if (questText.match(/(\[|\()(\d*)(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+?\))?)?(\)|\])\s*(.*?\|_.*?\|)/g)) {
        radioCheckboxAndInput = true;
        question.params.args.asText = question.params.args.asText + " radioCheckboxAndInput";
    }
    // replace (XX) with a radio button...
    questText = questText.replace(/<br>/g, "<br>\n");
    questText = questText.replace(
        /\((\d*)(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+\))?)?\)(.*?)(?=(?:\(\d*)\)|\n|<br>|$)/g,
        fRadio
    );
    function fRadio(containsGroup, value, name, labelID, condition, label) {
        let displayIf = "";
        if (condition == undefined) {
            displayIf = "";
        } else {
            displayIf = `${condition}`;
        }
        let elVar = "";
        if (name == undefined) {
            elVar = question.params.id;
        } else {
            elVar = name;
        }
        if (labelID == undefined) {
            labelID = `${elVar}_${value}_label`;
        }
        return `<div class='response' style='margin-top:15px' ${displayIf}><input type='radio' name='${elVar}' value='${value}' id='${elVar}_${value}'></input><label id='${labelID}' style='font-weight: normal; padding-left:5px;' for='${elVar}_${value}'>${label}</label></div>`;
    }


    // replace [XX] with checkbox
    questText = questText.replace(
        /\[(\d*)(\*)?(?:\:(\w+))?(?:\|(\w+))?(?:,(displayif=.+?\))?)?\]\s*(.*?)\s*(?=(?:\[\d)|\n|<br>|$)/g,
        fCheck
    );
    function fCheck(containsGroup, value, noneOfTheOthers, name, labelID, condition, label) {
        let displayIf = "";
        let clearValues = noneOfTheOthers ? "data-reset=true" : "";
        if (condition == undefined) {
            displayIf = "";
        } else {
            displayIf = `${condition}`;
        }
        let elVar = "";
        if (name == undefined) {
            elVar = question.params.id;
        } else {
            elVar = name;
        }
        if (labelID == undefined) {
            labelID = `${elVar}_${value}_label`;
        }
        return `<div class='response' style='margin-top:15px' ${displayIf}><input type='checkbox' name='${elVar}' value='${value}' id='${elVar}_${value}' ${clearValues}></input><label id='${labelID}' style='font-weight: normal; padding-left:5px;' for='${elVar}_${value}'>${label}</label></div>`;
    }

    // replace |time| with a time input
    questText = questText.replace(/\|time\|(?:([^\|\<]+[^\|]+)\|)?/g, fTime);
    function fTime(x, opts) {
        const { options, elementId } = guaranteeIdSet(opts, "time");
        return `<input type='time' ${options}>`;
    }

    // replace |__|__|  with a number box...
    questText = questText.replace(
        /\|(?:__\|){2,}(?:([^\|\<]+[^\|]+)\|)?/g,
        fNum
    );
    function fNum(fullmatch, opts) {

        let value = questText.startsWith('<br>') ? questText.split('<br>')[0] : ''

        // make sure that the element id is set...
        let { options, elementId } = guaranteeIdSet(opts, "num");
        let maxRegex = /max(?![(a-z])/g;
        let minRegex = /min(?![(a-z])/g;

        //let maxReplace = evalueateCondition("isDefined(AGE,5)");
        //instead of replacing max and min with data-min and data-max, they need to be added, as the up down buttons are needed for input type number
        let optionList = options.split(" ");
        for (let i = 0; i < optionList.length; i++) {
            let o = optionList[i];
            if (minRegex.test(o)) {

                // let minReplace = o.replace("min=", "");
                // let existingVal = o;
                // if (isNaN(parseInt(minReplace))){   //if the max min values are a method then evaluate it 
                //   let renderedVal = "min="+evaluateCondition(minReplace);
                //   options = options.replace(existingVal, renderedVal);
                //   o=renderedVal;
                // }
                o = o.replace(minRegex, "data-min");
                options = options + " " + o;
            }
            if (maxRegex.test(o)) {
                // let maxReplace = o.replace("max=", "");
                // let existingVal = o;
                // if (isNaN(parseInt(maxReplace))){ //if the max min values are a method then evaluate it 
                //   let renderedVal = "max="+evaluateCondition(maxReplace);
                //   options = options.replace(existingVal, renderedVal);
                //   o=renderedVal;
                // }

                o = o.replace(maxRegex, "data-max");
                options = options + " " + o;
            }
        }
        if (radioCheckboxAndInput) {
            options = options + " disabled ";
        }
        //onkeypress forces whole numbers
        return `<input type='number' aria-label='${value}' step='any' onkeypress='return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57' name='${question.params.id}' ${options} ></input>`;
    }

    // replace |__| or [text box:xxx] with an input box...
    questText = questText.replace(/\[text\s?box(?:\s*:\s*(\w+))?\]/g, fTextBox);
    function fTextBox(fullmatch, options) {
        let id = options ? options : `${question.params.id}_text`;
        return `|__|id=${id} name=${question.params.id}|`;
    }


    questText = questText.replace(
        // /\|(?:__\|)(?:([^\s<][^|<]+[^\s<])\|)?\s*(.*)?/g,
        /(.*)?\|(?:__\|)(?:([^\s<][^|<]+[^\s<])\|)?(.*)?/g,
        fText
    );

    function fText(fullmatch, value1, opts, value2) {
        let { options, elementId } = guaranteeIdSet(opts, "txt");

        if (radioCheckboxAndInput) {
            options = options + " disabled ";
        }

        if (value1 && value1.includes('div')) return `${value1}<input type='text' aria-label='${value1.split('>').pop()}'name='${question.params.id}' ${options}></input>${value2}`

        if (value1 && value2) return `<span>${value1}</span><input type='text' aria-label='${value1} ${value2}' name='${question.params.id}' ${options}></input><span>${value2}</span>`;
        if (value1) return `<span>${value1}</span><input type='text' aria-label='${value1}' name='${question.params.id}' ${options}></input>`;
        if (value2) return `<input type='text' aria-label='${value2}' name='${question.params.id}' ${options}></input><span>${value2}</span>`;

        return `<input type='text' aria-label='${questText.split('<br>')[0]}' name='${question.params.id}' ${options}></input>`;
    }

    // replace |___| with a textarea...
    questText = questText.replace(/\|___\|((\w+)\|)?/g, fTextArea);
    function fTextArea(x1, y1, z1) {
        let elId = "";
        if (z1 == undefined) {
            elId = question.id + "_ta";
        } else {
            elId = z1;
        }
        let options = "";
        if (radioCheckboxAndInput) {
            options = options + " disabled ";
        }
        return `<textarea id='${elId}' ${options} style="resize:auto;"></textarea>`;
    }

    // replace #YNP with Yes No input
    questText = questText.replace(
        /#YNP/g, `<div class='response' style='margin-top:15px'><input type='radio' id="${question.params.id}_1" name="${question.params.id}" value="yes"></input><label for='${question.params.id}_1'>Yes</label></div><div class='response' style='margin-top:15px'><input type='radio' id="${question.params.id}_0" name="${question.params.id}" value="no"></input><label for='${question.params.id}_0'>No</label></div><div class='response' style='margin-top:15px'><input type='radio' id="${question.params.id}_99" name="${question.params.id}" value="prefer not to answer"></input><label for='${question.params.id}_99'>Prefer not to answer</label></div>`
        // `(1) Yes
        //  (0) No
        //  (99) Prefer not to answer`
    );

    // replace #YN with Yes No input
    questText = questText.replace(
        /#YN/g, `<div class='response' style='margin-top:15px'><input type='radio' id="${question.params.id}_1" name="${question.params.id}" value="yes"></input><label for='${question.params.id}_1'>Yes</label></div><div class='response' style='margin-top:15px'><input type='radio' id="${question.params.id}_0" name="${question.params.id}" value="no"></input><label for='${question.params.id}_0'>No</label></div>`
        // `(1) Yes
        //  (0) No`
    );
    // replace [a-zXX] with a checkbox box...
    // handle CB/radio + TEXT + TEXTBOX + ARROW + Text...
    questText = questText.replace(
        /([\[\(])(\w+)(?::(\w+))?(?:\|([^\|]+?))?[\]\)]([^<\n]+)?(<(?:input|textarea).*?<\/(?:input|textarea)>)(?:\s*->\s*(\w+))/g,
        cb1
    );
    function cb1(
        completeMatch,
        bracket,
        cbValue,
        cbName,
        cbArgs,
        labelText,
        textBox,
        skipToId
    ) {
        let inputType = bracket == "[" ? "checkbox" : "radio";
        cbArgs = cbArgs ? cbArgs : "";

        // first look in the args for the name [v|name=lala], if not there,
        // look for cbName [v:name], otherwise use the question id.
        let name = cbArgs.match(/name=['"]?(\w+)['"]?/);
        if (!name) {
            name = cbName ? `name="${cbName}"` : `name="${question.params.id}"`;
        }

        let id = cbArgs.match(/id=['"]?(\w+)/);
        // if the user does supply the id in the cbArgs, we add it to.
        // otherwise it is in the cbArgs...
        let forceId = "";
        if (id) {
            id = id[1];
        } else {
            id = cbName ? cbName : `${question.params.id}_${cbValue}`;
            forceId = `id=${id}`;
        }

        let skipTo = skipToId ? `skipTo=${skipToId}` : "";
        let value = cbValue ? `value=${cbValue}` : "";
        let rv = `<div class='response' style='margin-top:15px'><input type='${inputType}' ${forceId} ${name} ${value} ${cbArgs} ${skipTo}></input><label for='${id}'>${labelText}${textBox}</label></div>`;
        return rv;
    }
    // SAME thing but this time with a textarea...


    //displayif with just texts
    questText = questText.replace(/\|(displayif=.+?)\|(.*?)\|/g, fDisplayIf);
    function fDisplayIf(containsGroup, condition, text) {
        return `<span class='displayif' ${condition}>${text}</span>`;
    }

    // replace next question  < -> > with hidden...
    questText = questText.replace(
        /<\s*(?:\|if\s*=\s*([^|]+)\|)?\s*->\s*([A-Z_][A-Z0-9_#]*)\s*>/g,
        fHidden
    );
    function fHidden(containsGroup, ifArgs, skipTo) {
        ifArgs = ifArgs == undefined ? "" : ` if=${ifArgs}`;
        return `<input type='hidden'${ifArgs} id='${question.params.id}_skipto_${skipTo}' name='${question.params.id}' skipTo=${skipTo} checked>`;
    }

    // replace next question  < #NR -> > with hidden...
    questText = questText.replace(
        /<\s*#NR\s*->\s*([A-Z_][A-Z0-9_#]*)\s*>/g,
        "<input type='hidden' class='noresponse' id='" +
        question.params.id +
        "_NR' name='" +
        question.params.id +
        "' skipTo=$1 checked>"
    );

    // handle skips
    questText = questText.replace(
        /<input ([^>]*?)><\/input><label([^>]*?)>(.*?)\s*->\s*([^>]*?)<\/label>/g,
        "<input $1 skipTo='$4'></input><label $2>$3</label>"
    );
    questText = questText.replace(
        /<textarea ([^>]*)><\/textarea>\s*->\s*([^\s<]+)/g,
        "<textarea $1 skipTo=$2></textarea>"
    );
    questText = questText.replace(/<\/div><br>/g, "</div>");

    questText = questText.replace(/\r?\n/g, "<br>")
    
    return questText;
}