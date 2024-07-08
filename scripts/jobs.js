const params = new URLSearchParams(window.location.search);

const fetchJobs = () => {
    let jobs_container = document.querySelector(".job-cards")
    let modals_container = document.querySelector(".modals")

    fetch(`${API_URL}/jobs`)
        .then(r => r.json())
        .then(r => r.results)
        .then(jobs => jobs.forEach(job => {
            insertJob(jobs_container, job)
            insertModal(modals_container, job)
        }))
        .then(() => handleURI("category"))
        .then(() => handleURI("location"))
}

const handleURI = (param) => {
    if (params.has(param)) {
        document.getElementById(param).value = params.get(param)
        handleSelectFilter(param)
    }
}

const insertJob = (container, job_data) => {
    const formatter = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Create job card
    let job = document.createElement("div")
    job.className = "job-card"
    job.addEventListener("click", () => openModal(job_data.id))

    // Add image
    let job_img = document.createElement("img")
    job_img.setAttribute("src", job_data.image)
    job.appendChild(job_img)

    //Add section a
    let section_a = document.createElement("div")
    section_a.className = "section-a"

    let job_category = document.createElement("div")
    job_category.className = "category"
    job_category.innerText = job_data.category
    section_a.appendChild(job_category)

    let job_location = document.createElement("div")
    job_location.className = "location"
    job_location.innerText = job_data.city
    section_a.appendChild(job_location)

    job.appendChild(section_a)

    // Add section b
    let section_b = document.createElement("div")
    section_b.className = "section-b"

    let job_name = document.createElement("h3")
    job_name.innerText = job_data.title
    section_b.appendChild(job_name)

    let job_rate = document.createElement("div")
    job_rate.className = "rate"
    job_rate.innerText = `$${job_data.amountPerHour}/h`
    section_b.appendChild(job_rate)

    job.appendChild(section_b)

    // Add section c
    let section_c = document.createElement("div")
    section_c.className = "section-c"

    let job_shift = document.createElement("div")
    job_shift.className = "time"
    job_shift.innerText = `${job_data.startTime.split('T')[0]} ${formatter.format(new Date(job_data.startTime))} - ${formatter.format(new Date(job_data.endTime))}`
    section_c.appendChild(job_shift)

    let job_pay = document.createElement("div")
    job_pay.className = "pay"
    job_pay.innerText = `$${job_data.amountToPay}`
    section_c.appendChild(job_pay)

    job.appendChild(section_c)

    // Add job to jobs container
    container.appendChild(job)
}

const insertModal = (container, job_data) => {
    // Create modal
    let modal = document.createElement("div")
    modal.id = job_data.id
    modal.className = "modal"

    // Add modal content
    let modal_content = document.createElement("div")
    modal_content.className = "modal-content"

    // Add modal title
    let modal_title = document.createElement("div")
    modal_title.className = "modal-title"

    let modal_title_h2 = document.createElement("h2")
    modal_title_h2.innerText = job_data.title
    modal_title.appendChild(modal_title_h2)

    let modal_title_close = document.createElement("span")
    modal_title_close.className = "close"
    modal_title_close.innerHTML = "&times;"
    modal_title_close.addEventListener("click", () => closeModal(job_data.id))
    modal_title.appendChild(modal_title_close)

    modal_content.appendChild(modal_title)

    // Add modal form
    let modal_form = document.createElement("div")
    modal_form.className = "modal-form"

    let description = document.createElement("p")
    description.className = "description"
    description.innerText = job_data.description
    modal_form.appendChild(description)

    let tags = document.createElement("div")
    tags.className = "tags"
    job_data.requirements.forEach(t => {
        let tag = document.createElement("span")
        tag.className = "tag"
        tag.innerText = t
        tags.appendChild(tag)
    })
    modal_form.appendChild(tags)

    let apply_button = document.createElement("button")
    apply_button.className = "apply-button"
    apply_button.innerText = "Aplicar"
    apply_button.setAttribute("jobid", job_data.id)
    apply_button.addEventListener("click", () => handleApply(apply_button))
    modal_form.appendChild(apply_button)

    modal_content.appendChild(modal_form)

    modal.appendChild(modal_content)

    container.appendChild(modal)
}

const handleSelectFilter = (filter) => {
    let value = document.getElementById(filter).value

    document.querySelectorAll(".job-card")
        .forEach(j => {
            if (value != 'Todos' && j.getElementsByClassName(filter)[0].innerText != value) {
                j.style.display = "none"
            }
        })
}

const handleInputFilter = (filter) => {
    let value = document.getElementById(filter).value

    document.querySelectorAll(".job-card")
        .forEach(j => {
            let card_value
            switch (filter) {
                case 'pay':
                    card_value = j.getElementsByClassName(filter)[0].innerText.slice(1)
                    break;            
                case 'date':
                    card_value = j.getElementsByClassName('time')[0].innerText.split(' ')[0]
                    break;
                case 'time':
                    card_value = j.getElementsByClassName(filter)[0].innerText.split(' ')[1]
                    break;
            }

            if (card_value != value) {
                j.style.display = "none"
            }
        })
}

const cleanFilters = () => {
    document.getElementById("category").value = "Todos"
    document.getElementById("location").value = "Todos"
    document.getElementById("date").value = null
    document.getElementById("time").value = null
    document.getElementById("pay").value = null

    document.querySelectorAll(".job-card")
        .forEach(j => j.style.display = "flex")
}

const handleApply = (button) => {
    fetch(`${API_URL}/jobs/apply`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "workerId": `${localStorage.getItem('user')}`,
            "jobId": `${button.getAttribute("jobid")}`
        })
    })
    .then(r => {
        if (r.status == 200) {
            Swal.fire({
                icon: "success",
                iconColor: "#22BB33",
                title: "Aplicacion Realizada!",
                confirmButtonColor: "#57003e",
                backdrop: false
              });

            closeModal(button.getAttribute("jobid"))
        } else {
            Swal.fire({
                icon: "error",
                iconColor: "#BB2124",
                title: "Oops...",
                text: "Se produjo un error al aplicar!",
                confirmButtonColor: "#57003e",
                backdrop: false
              });
        }
    })
}

const handleCreateJob = (e) => {
    e.preventDefault()

    const category = document.getElementById("job-category").value
    const current_date = new Date().toISOString().split('T')[0]

    const images = {
        "Administración": "1DuW2HC2TEm80im1ct3QmKBUC_Cz81HzK",
        "Atención al Cliente": "1NFpUwXDSpGxJZOVXusSkMGfV-64fUbV5",
        "Construcción": "1miXHEz_xzIU_VzrUmyX3-dknve1xUeDq",
        "Hotelería": "1ML7BaDwkuVp6nGUEH19J0YHBN7z8z9KW",
        "Gastronomía": "1XvNaLWcHZQo_GjQp-c-_dEf9s9LUgLoj",
        "Ventas": "1u4y-QtEQF32t9TjUi6iJuCLzN4KKJ1Iq",
    }

    fetch(`${API_URL}/jobs/create-offer`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "companyID": `${localStorage.getItem("user")}`,
            "title": `${document.getElementById("job-title").value}`,
            "description": `${document.getElementById("job-description").value}`,
            "category": `${category}`,
            "image": `https://drive.google.com/thumbnail?id=${images[category]}`,
            "startTime": `${current_date}T${document.getElementById("job-start-time").value}:00`,
            "endTime": `${current_date}T${document.getElementById("job-end-time").value}:00`,
            "address": `${document.getElementById("job-address").value}`,
            "city": `${document.getElementById("job-city").value}`,
            "amountToPay": `${document.getElementById("job-price").value}`,
            "amountPerHour": `${document.getElementById("job-total").value}`,
            "requirements": Array.from(document.querySelectorAll(".new-requirement")).map(n => n.innerText),
        })
    })
    .then(r => {
        if (r.status == 200) {
            closeModal("new-job-modal")
            window.location.reload();
        }
    })
}

const handleAddRequirement = () => {
    let new_requirement = document.getElementById("job-requirement").value

    if (new_requirement != "") {
        let span = document.createElement("span")
        span.className = "new-requirement"
        span.innerText = new_requirement
        document.getElementById("job-requirements").appendChild(span)
        document.getElementById("job-requirement").value = null
    }
}