function displayImg(img) {
    let container = document.getElementById('viewer');

    if (container === null) {
        container = document.createElement('div');
        container.setAttribute('id', 'viewer');
        image = document.createElement('img');
        image.setAttribute('src', img.dataset.url);
        container.appendChild(image);
        document.body.appendChild(container);
        container.onclick = e => {
            container.classList.toggle('hidden');
        }
    } else {
        container.firstChild.setAttribute('src', img.dataset.url);
        container.classList.toggle('hidden');
    }
}

document.querySelectorAll('img[data-url]').forEach(img => {
    img.addEventListener('click', e => {
        displayImg(e.target);
    })
});
