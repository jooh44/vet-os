export const AUDIO_STORE_DB_NAME = 'vetos-audio-store';
export const AUDIO_STORE_STORE_NAME = 'audios';

export async function saveAudioToStore(id: string, blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUDIO_STORE_DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(AUDIO_STORE_STORE_NAME)) {
                db.createObjectStore(AUDIO_STORE_STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(AUDIO_STORE_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(AUDIO_STORE_STORE_NAME);
            store.put(blob, id);

            transaction.oncomplete = () => {
                db.close();
                resolve();
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function getAudioFromStore(id: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUDIO_STORE_DB_NAME, 1);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            // Check if store exists (might not if first load)
            if (!db.objectStoreNames.contains(AUDIO_STORE_STORE_NAME)) {
                resolve(null);
                return;
            }

            const transaction = db.transaction(AUDIO_STORE_STORE_NAME, 'readonly');
            const store = transaction.objectStore(AUDIO_STORE_STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                resolve(getRequest.result as Blob || null);
                db.close();
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        };

        request.onerror = () => {
            // If DB doesn't exist, just return null
            resolve(null);
        };
    });
}

export async function deleteAudioFromStore(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUDIO_STORE_DB_NAME, 1);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(AUDIO_STORE_STORE_NAME)) {
                resolve();
                return;
            }
            const transaction = db.transaction(AUDIO_STORE_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(AUDIO_STORE_STORE_NAME);
            store.delete(id);

            transaction.oncomplete = () => {
                db.close();
                resolve();
            };
        };
    });
}
