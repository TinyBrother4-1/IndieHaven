document.addEventListener('DOMContentLoaded', () => {
    NavigationModule.init();
    SearchModule.init();
    GamesModule.renderHomeGrids();
    UploadModule.initWizard();
    ProfileModule.render();
    CollectionsModule.render();
});