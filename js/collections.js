const CollectionsModule = {
    render() {
        const container = document.getElementById('collectionsContainer');
        if (!container) return;
        container.innerHTML = `<p style="color: var(--text-secondary);">No custom collections created yet.</p>`;
    }
};