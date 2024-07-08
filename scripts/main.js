const API_URL = "https://flessi-api.glitch.me"

window.addEventListener("load", () => {
    if (localStorage.getItem("user") != null) {
        document.querySelector(".header-user-profile").style.display = 'block'
        document.querySelector(".header-user-actions").style.display = 'none'
    }
})

const openModal = (jobId) => {
    document.getElementById(jobId).style.display = 'flex';
}

const closeModal = (jobId) => {
    document.getElementById(jobId).style.display = 'none';
}

const handleHomeSearch = () => {
    let category = document.getElementById("category").value;
    let location = document.getElementById("location").value;

    window.location.href = `./jobs.html?category=${category}&location=${location}`
}

const handleLogin = (e) => {
    e.preventDefault()

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    
    fetch(`${API_URL}/users/login`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "email": `${email}`,
            "password": `${password}`
        })
    })
    .then(async r => {
        if (r.status == 200) {
            let responseBody = await r.json()
            console.log(responseBody);

            localStorage.setItem("user", JSON.stringify({
                id: responseBody.id,
                email: email,
                password: password
            }))

            location.href = './jobs.html'
        } else {
            Swal.fire({
                icon: "error",
                iconColor: "#BB2124",
                title: "Oops...",
                text: "Usuario o contraseña incorrectos!",
                confirmButtonColor: "#57003e",
                backdrop: false
              });
        }
    })
}

const handleRegister = (e) => {
    e.preventDefault()

    let name = document.getElementById("name").value
    let surname = document.getElementById("surname").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let dni = document.getElementById("dni").value
    let phone = document.getElementById("phone").value
    let city = document.getElementById("city").value
    let address = document.getElementById("address").value
    
    fetch(`${API_URL}/users/register-worker`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "name": `${name}`,
            "surname": `${surname}`,
            "email": `${email}`,
            "password": `${password}`,
            "dni": `${dni}`,
            "phone": `${phone}`,
            "city": `${city}`,
            "address": `${address}`
        })
    })
    .then(r => {
        if (r.status == 200) {
            localStorage.setItem("user", JSON.stringify({
                email: email,
                password: password
            }))

            location.href = './jobs.html'
        } else {
            Swal.fire({
                icon: "error",
                iconColor: "#BB2124",
                title: "Oops...",
                text: "Se produjo un error al registrar, por favor intente mas tarde...",
                confirmButtonColor: "#57003e",
                backdrop: false
              });
        }
    })
}

const handleLogout = () => {
    localStorage.removeItem("user")

    location.href='./home.html'
}