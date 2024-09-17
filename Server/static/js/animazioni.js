function toggleMenu() {
    var menuContainer = document.getElementById('menuContainer');
    menuContainer.style.left = (menuContainer.style.left === '0px' || menuContainer.style.left === '') ? '-250px' : '0px';
}
