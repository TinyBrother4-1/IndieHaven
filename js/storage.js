const Storage = {
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('indiehaven_favorites')) || [];
        } catch {
            return [];
        }
    },
    saveFavorites(favorites) {
        localStorage.setItem('indiehaven_favorites', JSON.stringify(favorites));
    }
};
