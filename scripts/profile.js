const fetchUserData = () => {
    fetch(`${API_URL}/users/workers/${localStorage.getItem('user')}`)
    .then(r => r.json())
    .then(r => r.result)
    .then(user_data => {
        document.getElementById("user-name").innerText = user_data.name
        document.getElementById("user-email").innerHTML += user_data.email
        document.getElementById("user-phone").innerHTML += user_data.phone
        document.getElementById("user-location").innerHTML += user_data.city

        user_data.applications.slice(0,3).forEach(job => addApplicationCard(job));

        user_data.interests.forEach(interest => addTag("interests", interest))
        user_data.skills.forEach(skill => addTag("skills", skill))
        user_data.experiences.forEach(experience => addTag("experiences", experience))
    })
}

const addApplicationCard = (job_data) => {
    const cards_holder = document.querySelector(".application-cards")

    let new_card = document.createElement("div")
    new_card.className = "application-card"

    let card_image = document.createElement("img")
    card_image.src = job_data.image

    let card_title = document.createElement("p")
    card_title.className = "application-title"
    card_title.innerText = job_data.title

    let card_status = document.createElement("div")
    card_status.className = "application-status"

    let status_one = document.createElement("p")
    status_one.innerText = "Estado"
    let status_two = document.createElement("p")
    status_two.innerText = "Pendiente"

    card_status.appendChild(status_one)
    card_status.appendChild(status_two)

    new_card.appendChild(card_image)
    new_card.appendChild(card_title)
    new_card.appendChild(card_status)

    cards_holder.appendChild(new_card)
}

const addTag = (destination, value) => {
    let new_tag = document.createElement("span")
    new_tag.className = "tag"
    new_tag.innerText = value

    document.getElementById(destination).insertBefore(new_tag, document.querySelector(`#${destination} .add-attribute-button`))
}

const handleAddButton = (type) => {
    Swal.fire({
        title: "Añada el valor",
        input: "text",
        inputAttributes: {
          autocapitalize: "on"
        },
        showCancelButton: true,
        confirmButtonText: "Añadir",
        confirmButtonColor: "#57003e",
        backdrop: false,
        showLoaderOnConfirm: true,
        preConfirm: async (value) => {
            fetch(`${API_URL}/users/workers/${localStorage.getItem('user')}/add-attribute`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                    "type": `${type}`,
                    "value": `${value}`
                })
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
          addTag(`${type}s`, result.value)
        }
    });
}