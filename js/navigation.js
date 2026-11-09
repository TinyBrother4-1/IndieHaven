const NavigationModule = {
    init() {
        const toggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('appSidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }
};
