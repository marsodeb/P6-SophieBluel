const api = "http://localhost:5678/api/";
const works = api + "works";
const categories = api + "categories";

const fetchWorks = await fetch(works);
const repWorks = await fetchWorks.json();

const fetchCateg = await fetch(categories);
const repCateg = await fetchCateg.json();


export { api, works, categories, repWorks, repCateg };