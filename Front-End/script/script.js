import { genererWorks } from "./genererWorks.js";

let works = await fetch('http://localhost:5678/api/works');
works = await works.json();

genererWorks(works);