(function () {
    // Generate random phone number (Ukraine only in this example)
    // @todo: add other countries codes and let user to choose which one to display (only Ukrainian and Russians for example).
    const operators = [
        "066", // Vodafone
        "067", // Kievstar
        "093", // Life
        "063"  // Life
    ];

    function showMessage(msg, title) {
        const msgTitleElement       = document.createElement("div");
        const msgBodyElement        = document.createElement("div");
        const msgContainerElement   = document.createElement("div");
        const msgWrapperElement     = document.createElement("div");
        const msgCloseElement       = document.createElement("button");
        const msgOKElement          = document.createElement("button");

        msgTitleElement.innerHTML = title;
        msgBodyElement.innerHTML = msg;
        msgContainerElement.appendChild(msgTitleElement);
        msgContainerElement.appendChild(msgBodyElement);
        msgWrapperElement.appendChild(msgContainerElement);

        Object.assign(msgContainerElement.style, {
            position: "absolute",
            width: "66.6%",
            height: "66.6%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#abcdef",
        });

        Object.assign(msgWrapperElement.style, {
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundColor: "#fedcba",
        });

        const promiseToClose = new Promise((e, kind) => {
            // @todo: @google: @optimisation find-out is it need to remove event listeners?
            document.body.removeChild(msgWrapperElement);
            return Object.assign({}, e, {kind});
        });

        msgCloseElement   .addEventListener("click", e => promiseToClose.resolve(e, "close"));
        msgOKElement      .addEventListener("click", e => promiseToClose.resolve(e, "OK"));
        msgWrapperElement .addEventListener(
            "keypress",
            e => e.key === 13 && promiseToClose.resolve(e)
        );

        document.body.appendChild(msgWrapperElement);

        return promiseToClose;
    }

    function randomPhoneNumber() {
        return operators[Math.floor(Math.random() * operators.length)] + Math.floor(Math.random() * 9999999);
    }

    function renderOutputNumber(outputNumber) {
        document.body.innerHTML = `<h1> Please remember this part of the number:</h1> <h1>${outputNumber}</h1>`;
    }

    function renderDistractingThings() {
        document.body.innerHTML = `<img class="distract" src="img/crazy.gif" alt="Crazy gif bad that you don't see it."/>`;
    }

    let currentNumber, outputNumber, numberCounter = 0;

    // Subscribe to event when next move go
    const nextNumber = () => {
        currentNumber = currentNumber || randomPhoneNumber();
        outputNumber = currentNumber.toString().slice(0, numberCounter + 1);

        renderOutputNumber(outputNumber);
        console.table({
            "currentNumber": currentNumber,
            "outputNumber": outputNumber,
            "numberCounter": numberCounter
        });

        // If there is any current number use it, if not use random number (first time case).
        setTimeout(() => {
            // Hide number and show some distracting things (like cats or nude pictures for example)
            renderDistractingThings();
            setTimeout(() => {
                // We should check if the number is correct.
                // Let's do this!
                if (outputNumber.toString() === prompt("Please enter the last number that you saw:").toString()) {
                    // User has memorised the number, so we can open next digit
                    numberCounter = numberCounter <= currentNumber.length ? numberCounter + 1 : 0;
                    nextNumber();
                } else {
                    // User has failed, so we should start game again.
                    // @todo: Make sure that user will not see the same number twice or more times in a row.
                    showMessage(`You are wrong, the part of the number was: ${outputNumber}`);
                }
            }, Math.floor(Math.random() * 2244) + 3526); // @todo: magic numbers, move to constant please.
        }, Math.floor(Math.random() * 4222) + 2560); // @todo: magic numbers, move to constant please.
    };

    // Now subscribe to mouse down and key up events, so when user click inside the game field, the game will starts.
    document.body.onkeyup = nextNumber;
    document.body.onmousedown = nextNumber;
}());
