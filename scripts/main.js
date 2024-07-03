const handleHomeSearch = () => {
    let category = document.getElementById("category").value;
    let location = document.getElementById("location").value;

    window.location.href = `./jobs.html?category=${category}&location=${location}`
}

const openModal = (jobId) => {
    document.getElementById(jobId).style.display = 'flex';
}

const closeModal = (jobId) => {
    document.getElementById(jobId).style.display = 'none';
}
