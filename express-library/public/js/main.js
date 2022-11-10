document.addEventListener("DOMContentLoaded", (event) => {
    const deleteLinks = document.querySelectorAll('.js-delete');
    deleteLinks.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            fetch('http://localhost:5000/api/books/' + this.id, {
                method: 'DELETE',
            })
                .then(res => {
                    if (res.status === 201) location.reload()
                })
                .catch(error => {
                    throw error
                })
        })
    })
});