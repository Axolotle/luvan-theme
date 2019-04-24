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

document.getElementById('toggle').addEventListener('click', function () {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('is-active'))
        this.setAttribute('aria-expanded', 'false');
    else
        this.setAttribute('aria-expanded', 'true');
    menu.classList.toggle('is-active');
});


document.querySelectorAll('audio').forEach(audio => {
    let player = new Player(audio);
});

document.getElementById('cross').addEventListener('click', function () {
    document.querySelector('aside').classList.toggle('hidden');
    document.querySelector('main').classList.toggle('enlarged');
});
