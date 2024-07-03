const fetchJobs = () => {
    let jobs_container = document.querySelector(".job-cards")
    let modals_container = document.querySelector(".modals")

    fetch('../temp/jobs.json')
        .then(r => r.json())
        .then(jobs => jobs.forEach(job => {
            insertJob(jobs_container, job)
            insertModal(modals_container, job)
        }))
}

const insertJob = (container, job_data) => {
    const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });

    // Create job card
    let job = document.createElement("div")
    job.className = "job-card"
    job.addEventListener("click", () => openModal(job_data.id))

    // Add image
    let job_img = document.createElement("img")
    job_img.setAttribute("src", job_data.img)
    job.appendChild(job_img)

    // Add category
    let job_category = document.createElement("div")
    job_category.className = "job-category"
    job_category.innerText = job_data.category
    job.appendChild(job_category)

    // Add title
    let job_title = document.createElement("div")
    job_title.className = "job-title"

    let job_title_h3 = document.createElement("h3")
    job_title_h3.innerText = job_data.name
    job_title.appendChild(job_title_h3)

    let job_title_rate = document.createElement("div")
    job_title_rate.className = "job-money"
    job_title_rate.innerText = `$${job_data.rate}/h`
    job_title.appendChild(job_title_rate)

    job.appendChild(job_title)

    // Add details
    let job_details = document.createElement("div")
    job_details.className = "job-details"

    let job_details_shift = document.createElement("div")
    job_details_shift.innerText = `${formatter.format(new Date(job_data.start))} - ${formatter.format(new Date(job_data.end))}`
    job_details.appendChild(job_details_shift)

    let job_details_pay = document.createElement("div")
    job_details_pay.className = "job-money"
    job_details_pay.innerText = `$${job_data.pay}`
    job_details.appendChild(job_details_pay)

    job.appendChild(job_details)

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
    modal_title_h2.innerText = job_data.name
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
    job_data.tags.forEach(t => {
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