function Asset(path: string): string {
    if (!path) return '';

    if (path.startsWith('https') || path.startsWith('blob:')) {
        return path;
    }

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const cleanPath = path.replace(/^\/+/, '');

    return `${baseUrl}/${cleanPath}`;
}

export default Asset;