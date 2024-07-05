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
    
    fetch("URL", {
        method: "POST",
        body: {
            "email": `${email}`,
            "password": `${password}`
        }
    })
    .then(r => {
        if (r.status == 200) {
            localStorage.setItem("user", JSON.stringify({
                email: email,
                password: password
            }))
        } else {
            Swal.fire({
                icon: "error",
                iconColor: "#B22222",
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

    let username = document.getElementById("username").value
    let name = document.getElementById("name").value
    let surname = document.getElementById("surname").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    
    fetch("URL", {
        method: "POST",
        body: {
            "username": `${username}`,
            "name": `${name}`,
            "surname": `${surname}`,
            "email": `${email}`,
            "password": `${password}`
        }
    })
    .then(r => {
        if (r.status == 200) {
            localStorage.setItem("user", JSON.stringify({
                email: email,
                password: password
            }))
        } else {
            Swal.fire({
                icon: "error",
                iconColor: "#B22222",
                title: "Oops...",
                text: "Se produjo un error al registrar, por favor intente mas tarde...",
                confirmButtonColor: "#57003e",
                backdrop: false
              });
        }
    })
}
