const form = document.querySelector('form');
const list = document.querySelector('.list');
const inputLink = document.querySelector('#input');
const dropdownBtn = document.querySelector('.bi-list');
const dropdownContent = document.querySelector('.dropdownContent')
const baseURL = 'https://api.shrtco.de/v2/shorten?url=';

const links = [];
const shortLinks = [];

if (JSON.parse(sessionStorage.getItem('fullLinks'))) {
    JSON.parse(sessionStorage.getItem('fullLinks')).forEach(el => links.push(el));
    JSON.parse(sessionStorage.getItem('shortLinks')).forEach(el => shortLinks.push(el))
}

const createCopyCard = function (orginalLink, shortenedLink) {
    const li = document.createElement('li');
    const fullLinkSpan = document.createElement('span');
    const div = document.createElement('div')
    const shortLinkSpan = document.createElement('span');
    const copyLinkButton = document.createElement('button');
    fullLinkSpan.classList.add('fullLink');
    fullLinkSpan.innerText = orginalLink
    li.append(fullLinkSpan);
    shortLinkSpan.classList.add('shortLink');
    shortLinkSpan.innerText = shortenedLink;
    div.append(shortLinkSpan);
    copyLinkButton.classList.add('copyBtn', 'hoveredBtn');
    copyLinkButton.innerText = 'Copy';
    div.append(copyLinkButton);
    li.append(div);
    list.append(li);
}

const start = () => {
    const len = links.length;
    for (let i = 0; i < len; i++) {
        createCopyCard(links[i], shortLinks[i]);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const link = form.elements.input.value;
    let shortLink = '';
    await axios.get(baseURL + link.trim())
        .then(res => {
            shortLink = res.data.result.full_short_link;
            links.push(link)
            shortLinks.push(shortLink)
            sessionStorage.setItem('fullLinks', JSON.stringify(links));
            sessionStorage.setItem('shortLinks', JSON.stringify(shortLinks));
            createCopyCard(link, shortLink)
        })
        .catch(e => {
            const errorCode = e.response.data.error_code;
            if (errorCode == 1) {
                form.classList.add('invalid');
            }
        })
})

list.addEventListener('click', e => {
    // Check out Event Delgation
    if (e.target.nodeName === 'BUTTON') {
        const btn = e.target;
        btn.classList.remove('hoveredBtn')
        btn.classList.add('activatedBtn')
        btn.innerText = 'Copied!';
        const shortLink = btn.parentElement.querySelector('.shortLink')
        navigator.clipboard.writeText(shortLink.innerText);
    }
});

inputLink.onblur = (() => {
    if (form.elements.input.value.trim() == '') {
        form.classList.add('invalid');
    }
})

inputLink.addEventListener('click', () => {
    form.classList.remove('invalid');
})

dropdownBtn.addEventListener('click', () => {
    dropdownContent.classList.toggle('open')
})

start()






