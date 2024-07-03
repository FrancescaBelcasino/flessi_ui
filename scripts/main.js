const handleHomeSearch = () => {
    let category = document.getElementById("category").value;
    let location = document.getElementById("location").value;

    window.location.href = `./jobs.html?category=${category}&location=${location}`
}