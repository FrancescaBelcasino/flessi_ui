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