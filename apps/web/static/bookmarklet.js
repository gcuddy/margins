const base_url = `http://127.0.0.1:5173`;
const endpoint = `/add`;

const html = document.documentElement.outerHTML;
const url = document.location.href;

console.log(html);
console.log(url);

const response = fetch(base_url + endpoint, {
    method: "POST",
    body: JSON.stringify({
       html,
       url
    })
}).then(response => response.json()).then(data => {
    console.log({data})
});
