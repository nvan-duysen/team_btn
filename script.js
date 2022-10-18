const redirect = (id, old_id) => {
    old_page = document.getElementById(old_id);
    old_page.style.color = "white";

    const old_document_classes = document.getElementById(old_id + "_body").classList;

    old_document_classes.remove("show");
    old_document_classes.add("hide");

    new_page = document.getElementById(id);
    new_page.style.color = "#0096FF";

    const new_document_classes = document.getElementById(id + "_body").classList;

    new_document_classes.remove("hide");
    new_document_classes.add("show");

    if (window.innerWidth <= 426) {
        hideNavbar();
    }

    return id;
}

const route_container = document.getElementById("routes");

const routes = route_container.getElementsByClassName("route");

const logo = document.getElementById("logo");

let id_shown = "accueil";

for (let i = 0; i < routes.length; i++) {
    if (routes[i].id) {
        routes[i].addEventListener("click", function launch_redirect() { id_shown = redirect(routes[i].id, id_shown) }, false);
    }
}

logo.addEventListener("click", function launch_redirect() { id_shown = redirect("accueil", id_shown) }, false);

const burger = document.getElementById("burger");

const cross = document.getElementById("cross");

const showNavbar = () => {
    burger.style.display = "none";
    cross.style.display = "block";
    route_container.style.display = "flex";
}

const hideNavbar = () => {
    burger.style.display = "block";
    cross.style.display = "none";
    route_container.style.display = "none";
}

const test = document.querySelector("body");

const mediaQuery = window.matchMedia('(min-width: 426px)');

mediaQuery.addListener(handleSizeChange);

function handleSizeChange(e) {
    // Check if the media query is true
    if (e.matches) {
        burger.style.display = "";
        cross.style.display = "";
        route_container.style.display = "";
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains("to_left")) {
                entry.target.classList.add("slideLeft");
            }
            if (entry.target.classList.contains("to_right")) {
                entry.target.classList.add("slideRight");
            }
            if (entry.target.classList.contains("to_display")) {
                entry.target.classList.add("slideDisplay");
                entry.target.style.opacity = 1;
            }
        }
        else if (entry.target.classList.contains("to_display")) {
            entry.target.style.opacity = 0;
        }
    });
});

// Tell the observer which elements to track
const animations = document.querySelectorAll(".animation");

animations.forEach(animation => {
    observer.observe(animation);
});

const redirect_team = (anchor) => {
    id_shown = redirect("equipe", "accueil");

    const redirect_anchor = document.createElement("a");
    redirect_anchor.setAttribute("href", "#" + anchor);
    redirect_anchor.click();
}

const getUserMedia = (constraints) => {
    // if Promise-based API is available, use it
    if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    // otherwise try falling back to old, possibly prefixed API...
    const legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (legacyApi) {
        // ...and promisify it
        return new Promise(function (resolve, reject) {
            legacyApi.bind(navigator)(constraints, resolve, reject);
        });
    }
}

const getStream = (type) => {
    if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
        !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
        alert('User Media API not supported.');
        return;
    }
    const button = document.getElementById("button_video");

    button.innerHTML = "Vous avez cliqué.";

    const constraints = {};
    constraints[type] = true;


    getUserMedia(constraints)
        .then(function (stream) {
            let mediaControl = document.querySelector(type);

            if ('srcObject' in mediaControl) {
                mediaControl.srcObject = stream;
            } else if (navigator.mozGetUserMedia) {
                mediaControl.mozSrcObject = stream;
            } else {
                mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }

            mediaControl.play();
        })
        .catch(function (err) {
            alert('Error: ' + err);
        });
}

let divToAdd = "";

let divRealisations = "";

let id_count = 1;

let isEditing = false;

const handleChangeInput = (input) => {
    const select_joueur = document.getElementById("select_joueur");

    const id = select_joueur.options[select_joueur.selectedIndex].id;

    divRealisations = document.getElementById(id + "_data");

    if (divToAdd !== "") {
        divToAdd.innerHTML = input.value;
        console.log(divToAdd);
        return;
    }

    divToAdd = document.createElement("div");

    divToAdd.classList.add("realisation");

    divToAdd.innerHTML = input.value;

    divRealisations.appendChild(divToAdd);
}

const resetInput = () => {
    const inputTexte = document.getElementById("setRealisation");

    inputTexte.value = "";

    removeDiv();
}

const validateInput = () => {
    if (divToAdd.textContent === "") {
        return;
    }
    const select_joueur = document.getElementById("select_joueur");

    const id = select_joueur.options[select_joueur.selectedIndex].id;

    if (!isEditing) {
        divToAdd.id = id_count;

        divButtons = document.createElement("div");

        divButtons.id = "buttons_" + id_count;

        buttonEdit = document.createElement("button");
        buttonDelete = document.createElement("button");

        buttonEdit.setAttribute("onclick", "editInput(" + id_count + ")");
        buttonEdit.classList.add("button_crud");
        buttonEdit.innerHTML = "Modifier";

        buttonDelete.setAttribute("onclick", "deleteInput(" + id_count + ")");
        buttonEdit.classList.add("button_crud");
        buttonDelete.innerHTML = "Supprimer";

        divButtons.appendChild(buttonEdit);
        divButtons.appendChild(buttonDelete);

        divRealisations.appendChild(divButtons);

        id_count += 1;
    } else {
        isEditing = false;
    }

    divToAdd = "";

    resetInput();

    updateLocalStorage();
}

const editInput = (id) => {
    isEditing = true;

    divToAdd = document.getElementById(id);

    const inputTexte = document.getElementById("setRealisation");

    inputTexte.value = divToAdd.innerText;
}

const deleteInput = (id) => {
    divToAdd = document.getElementById(id);

    divButtons = document.getElementById("buttons_" + id);

    divRealisations = divToAdd.parentNode;

    divRealisations.removeChild(divButtons);

    id_count -= 1;

    removeDiv();

    updateLocalStorage();
}


const removeDiv = () => {
    try {
        divRealisations.removeChild(divToAdd);
        divToAdd = "";
    } catch (error) {
        console.log(error);
    }
}

const updateLocalStorage = () => {
    if (localStorage.getItem('html') !== null) {
        localStorage.removeItem("html");
    }
    const palmaresToStore = document.getElementById("tournois_body");
    localStorage.setItem("html", palmaresToStore.innerHTML);
}

const addFromLocalStorage = () => {
    if (localStorage.getItem('html') === null) {
        return;
    }
    const palmaresToChange = document.getElementById("tournois_body");
    palmaresToChange.innerHTML = localStorage.getItem("html");

}

addFromLocalStorage();