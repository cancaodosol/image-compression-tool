const version = 'v1.0.2';

const h1 = document.querySelector('h1');
const div = document.createElement('span');
div.style.fontSize = '0.4em';
div.style.marginLeft = '4px';
div.textContent = `${version}`;

h1.appendChild(div);
