const Storage = {
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('tiny_arcade_favorites')) || [];
        } catch {
            return [];
        }
    },
    saveFavorites(favorites) {
        localStorage.setItem('tiny_arcade_favorites', JSON.stringify(favorites));
    }
};
