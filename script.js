const form = document.getElementById("form")
const btnAddForm = document.getElementById("sidebar-button")
const sidebarBody = document.getElementById("sidebar-body")
const blur1 = document.getElementById("blur")
const btnRemForm = document.getElementById("ri-close-line")
const formExp = document.getElementById("form-exp")
const addExp = document.getElementById("add-exp")
const save = document.getElementById("save")
const addEmpZone = document.querySelectorAll(".icon-btn")
const salleEmploye = document.querySelectorAll(".salle-employe")


const button = document.createElement('i')
button.id = 'ri-close-large-fill'
button.className = 'ri-close-large-fill'


let allEmploye = []
const zoneAcc = {
    reception: { roles: ["receptionniste", "manager", "nettoyage"], capacity: 3 },
    conferance: { roles: ["manager", "nettoyage"], capacity: 3 },
    serveurs: { roles: ["technicien IT", "manager", "nettoyage"], capacity: 4 },
    securite: { roles: ["agent De Securite", "manager", "nettoyage"], capacity: 2 },
    archives: { roles: ["manager"], capacity: 1 },
    personnel: { roles: ["manager", "nettoyage", "receptionniste", "technicien IT", "agent De Securite"], capacity: 10 }
}
function addForm() {
    form.style.display = "flex"
}
function remForm() {
    form.style.display = "none"
}
function remDsp() {
    blur1.style.display = "none"
}

function createFormExp() {
    const divFormExp = document.createElement("div")
    divFormExp.classList = "divFormExp"
    const closeFormExp = document.createElement("i")
    closeFormExp.classList = "ri-close-circle-fill"
    closeFormExp.onclick = function () {
        this.parentElement.remove()
    }
    const entrepriseNom = document.createElement("input")
    entrepriseNom.classList = "form-input"
    entrepriseNom.type = "text"
    entrepriseNom.placeholder = "Entreprise"
    entrepriseNom.id = "entreprise"
    const position = document.createElement("input")
    position.classList = "form-input"
    position.id = "position"
    position.type = "text"
    position.placeholder = "Position"
    const period = document.createElement("input")
    period.classList = "form-input"
    period.id = "period"
    period.type = "text"
    period.placeholder = "Period"
    divFormExp.appendChild(closeFormExp)
    divFormExp.appendChild(entrepriseNom)
    divFormExp.appendChild(position)
    divFormExp.appendChild(period)
    formExp.appendChild(divFormExp)

}
function getExp() {
    const divFormExp = document.querySelectorAll(".divFormExp")
    const experiences = []
    divFormExp.forEach(block => {
        const entreprise = block.querySelector("#entreprise").value
        const position = block.querySelector("#position").value
        const period = block.querySelector("#period").value
        experiences.push({ Entreprise: entreprise, Position: position, Period: period })
    })
    return experiences
}
function stockExp() {
    const employe = {
        id: Date.now(),
        nom: document.getElementById("nom").value,
        role: document.getElementById("role").value,
        phone: document.getElementById("phone").value,
        photo: document.getElementById("photo").value,
        email: document.getElementById("email").value,
        zone: null,
        exp: getExp()
    }
    if (employe.photo == "") {
        employe.photo = "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg"
    }
    allEmploye.push(employe)
}

addEmpZone.forEach(select => {
    select.addEventListener("click", e => {
        blur1.style.display = "flex"
        console.log(e)
        // console.log(select)
    })

})
createEmploye()
function createEmploye() {
    sidebarBody.innerHTML = ''
    const unsEmp = allEmploye.filter(e => e.zone === null);

    if (unsEmp.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Aucun employé non assigné";
        p.style.color = "#c6c6c6ff";
        sidebarBody.appendChild(p);
        return;
    }

    unsEmp.forEach(divEm => {
        const div = document.createElement("div");
        div.className = "div-em";
        div.dataset.empId = divEm.id;
        console.log(div.dataset.empId)
        const img = document.createElement("img");
        img.src = divEm.photo;
        img.className = "img-em";

        const divIn = document.createElement("div");
        divIn.className = "div-In";

        const pNom = document.createElement("p");
        pNom.className = "p-em";
        pNom.textContent = divEm.nom;

        const prole = document.createElement("p");
        prole.className = "p-role";
        prole.textContent = divEm.role;

        const deleteEmp = document.createElement("i");
        deleteEmp.className = "ri-close-circle-line";
        deleteEmp.addEventListener("click", () => {
            const idIndex = allEmploye.findIndex(emp => emp.id === divEm.id);
            allEmploye.splice(idIndex, 1);
            createEmploye();
            removeEmployeeFromAllRooms(divEm.id);

        });

        div.appendChild(img);
        divIn.appendChild(pNom);
        divIn.appendChild(prole);
        div.appendChild(divIn);
        div.appendChild(deleteEmp);

        sidebarBody.appendChild(div);
    });
}

function getRoomContainer(roomName) {
    const btn = document.querySelector(`.icon-btn[data-salle="${roomName}"]`);
    if (!btn) return null;
    const inside = btn.closest(".salle-inside");
    if (!inside) return null;
    return inside.querySelector(".salle-employe");
}

function insertEmployeeToRoom(employee, roomName) {
    const roomBody = getRoomContainer(roomName);
    if (!roomBody) return;
    const exists = roomBody.querySelector(`.div-em[data-emp-id="${employee.id}"], .div-em[data-empid="${employee.id}"], .div-em[data-empId="${employee.id}"]`);
    if (exists) return;

    const div = document.createElement("div");
    div.className = "div-em-room";
    div.dataset.empId = employee.id;

    const img = document.createElement("img");
    img.src = employee.photo;
    img.className = "img-em";

    const divInfo = document.createElement("div")
    divInfo.classList = "div-info"

    const removeFromRoom = document.createElement("i");
    removeFromRoom.className = "ri-delete-bin-line";
    removeFromRoom.style.cursor = "pointer";
    removeFromRoom.addEventListener("click", () => {
        const realEmp = allEmploye.find(e => e.id === employee.id);
        if (realEmp) {
            realEmp.zone = null;
            div.remove();
            createEmploye();
        }
    });

    div.appendChild(img);
    div.appendChild(removeFromRoom);

    roomBody.appendChild(divInfo);
    roomBody.appendChild(div);
    renderAllInfos(employee, divInfo)
}

function renderAssignedToRooms() {
    allEmploye.forEach(e => {
        if (e.zone) insertEmployeeToRoom(e, e.zone);
    });
}
function renderAllInfos(divEm, divInfo) {
    const img = document.createElement("img");
    img.src = divEm.photo;
    img.className = "img-em";

    const divIn = document.createElement("div");
    divIn.className = "div-In";
    const divExp = document.createElement("div");
    divExp.className = "div-In";

    const pNom = document.createElement("p");
    pNom.className = "p-em";
    pNom.textContent = divEm.nom;

    const prole = document.createElement("p");
    prole.className = "p-role";
    prole.textContent = divEm.role;
    const pEmail = document.createElement("p");
    pEmail.className = "p-role";
    pEmail.textContent = divEm.email;
    const pPhone = document.createElement("p");
    pPhone.className = "p-role";
    pPhone.textContent = divEm.phone;
     divEm.exp.forEach(e => {
        const entreprise = document.createElement("p");
        entreprise.className = "p-role";
        entreprise.textContent = e.Entreprise;
        const position = document.createElement("p");
        position.className = "p-role";
        position.textContent = e.Position;
        const period = document.createElement("p");
        period.className = "p-role";
        period.textContent = e.period;
        divExp.appendChild(entreprise)
        divExp.appendChild(position)
        divExp.appendChild(period)
    })
    
    divInfo.appendChild(img)
    divInfo.appendChild(pNom)
    divInfo.appendChild(prole)
    divInfo.appendChild(pEmail)
    divInfo.appendChild(pPhone)
    divInfo.appendChild(divExp)
    
}
function openAssignPopup(roomName) {
    blur1.innerHTML = '';
    blur1.style.display = 'flex';

    const selectEmp = document.createElement("div");
    selectEmp.className = "select-emp";

    const closeBtn = button.cloneNode(true);
    closeBtn.addEventListener("click", remDsp);
    selectEmp.appendChild(closeBtn);
    const eligible = allEmploye.filter(user => user.zone === null && zoneAcc[roomName].roles?.includes(user.role));

    if (!eligible.length) {
        const p = document.createElement("p");
        p.className = "p-vide";
        p.textContent = " Aucun employé disponible pour cette salle";
        const divDisp = document.createElement("div");
        divDisp.className = "div-dis";
        divDisp.appendChild(p);
        selectEmp.appendChild(divDisp);
        blur1.appendChild(selectEmp);
        return;
    }

    eligible.forEach(emp => {
        const divDisp = document.createElement("div");
        divDisp.className = "div-disp";
        divDisp.dataset.empId = emp.id;

        const img = document.createElement("img");
        img.src = emp.photo;
        img.className = "img-em";

        const pNom = document.createElement("p");
        pNom.className = "p-em2";
        pNom.textContent = emp.nom;

        const prole = document.createElement("p");
        prole.className = "p-role2";
        prole.textContent = emp.role;

        divDisp.appendChild(img);
        divDisp.appendChild(pNom);
        divDisp.appendChild(prole);
        selectEmp.appendChild(divDisp);
        divDisp.addEventListener("click", () => {
            const realEmp = allEmploye.find(e => e.id === emp.id);
            if (!realEmp) return;
            if (realEmp.zone !== null) return;

            realEmp.zone = roomName;
            divDisp.remove();
            createEmploye();
            insertEmployeeToRoom(realEmp, roomName);
        });
    });

    blur1.appendChild(selectEmp);
}
save.addEventListener("click", event => {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const role = document.getElementById("role").value;
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const nameReg = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,30}$/;
    const phoneReg = /^(06|07)[0-9]{8}$/;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];

    if (!nameReg.test(nom)) errors.push("Le nom est invalide !");
    if (!role) errors.push("Veuillez choisir un rôle !");
    if (!phoneReg.test(phone)) errors.push("Le numéro de téléphone est invalide !");
    if (!emailReg.test(email)) errors.push("L'email est invalide !");
    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    stockExp();
    createEmploye();
    renderAssignedToRooms();
    const formIn = document.querySelector('.form-in');
    formIn.reset();
    document.querySelectorAll('.divFormExp').forEach(d => d.remove());

    remForm();
});

btnAddForm.addEventListener("click", addForm);
btnRemForm.addEventListener("click", remForm);
addExp.addEventListener("click", createFormExp);

addEmpZone.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const roomName = btn.dataset.salle;
        openAssignPopup(roomName);
    });
});

blur1.addEventListener("click", (e) => {
    if (e.target === blur1) remDsp();
});

createEmploye();
renderAssignedToRooms();
