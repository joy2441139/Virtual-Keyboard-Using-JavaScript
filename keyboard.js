const Keyboard = {
    element: {
        main: null,
        keyContainer: null,
        keys: []
    },
    
    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capslock: false
    },

    init(){
        //create main elements
        this.element.main = document.createElement("div");
        this.element.keyContainer = document.createElement("div");

        //setup main elements
        this.element.main.classList.add("keyboard", "keyboard--hidden");
        this.element.keyContainer.classList.add("keys");
        this.element.keyContainer.appendChild(this._createKeys());

        this.element.keys = this.element.keyContainer.querySelectorAll(".key");

        //add to DOM
        this.element.main.appendChild(this.element.keyContainer);
        document.body.appendChild(this.element.main);

        //automatically use keyboard for element use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", ()=>{
                this.open(element.value, currentValue=>{
                    element.value = currentValue;
                });
            });
            
        });
            
    },

    _createKeys(){
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];
        //create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class = "material-icons">${icon_name} </i>`;
        };

        keyLayout.forEach(key =>{
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace","p","enter","?"].indexOf(key) !== -1;

            //add attributes/classes
            keyElement.setAttribute("type","button");
            keyElement.classList.add("key");

            switch (key){
                case "backspace" :
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", ()=>{
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });
                    break;

                    case "caps" :
                    keyElement.classList.add("key--wide", "key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", ()=>{
                        this._toggleCapslock();
                        keyElement.classList.toggle("key--active", this.properties.capslock);
                    });
                    break;

                    case "enter" :
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", ()=>{
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;

                    case "space" :
                    keyElement.classList.add("key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", ()=>{
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;

                    case "done" :
                    keyElement.classList.add("key--wide", "key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", ()=>{
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                    default :
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", ()=>{
                        this.properties.value += this.properties.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }

        });

        return fragment;
    },

    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == "function"){
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapslock(){
        this.properties.capslock = !this.properties.capslock;

        for(const key of this.element.keys){
            if(key.childElementCount === 0){
                key.textContent = this.properties.capslock? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose){
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.element.main.classList.remove("keyboard--hidden");
    },

    close(){
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.element.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function(){
    Keyboard.init();

});