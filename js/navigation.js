const NavigationModule = {
    init() {
        const toggle = document.getElementById('mobileMenuToggle');
        const drawer = document.getElementById('mobileDrawer');
        if (toggle && drawer) {
            toggle.addEventListener('click', () => {
                drawer.classList.toggle('hidden');
            });
        }
        
        const badge = document.getElementById('favBadge');
        if (badge) {
            badge.innerText = Storage.getFavorites().length;
        }
    }
};