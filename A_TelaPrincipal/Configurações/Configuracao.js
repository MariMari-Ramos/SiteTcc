document.addEventListener('DOMContentLoaded',() =>{
const darkModeToggle = document.getElementById('darkModeToggle');


//Verfica se há preferencia de tema salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme){
document.documentElement.setAttribute('data-theme',savedTheme);
darkModeToggle.checked = savedTheme === 'dark';
}

darkModeToggle.addEventListener('change',()=>{

const theme = darkModeToggle.checked ?'dark' : 'light';
document.documentElement.setAttribute('data-theme',theme);
localStorage.setItem('theme',theme);
})


});