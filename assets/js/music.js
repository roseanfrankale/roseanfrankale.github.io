document.addEventListener('DOMContentLoaded', () => {
    // YouTube API Key
    const YOUTUBE_API_KEY = 'AIzaSyBYnz372VZgs_mKqBREa9X-aCPf9oqbRBs';

    // Unified Video Configuration - Single source of truth
    const VAULT_CONFIG = [
        // Music Videos
        { id: 'GiK9DDAXKJE', type: 'music-videos' },
        { id: 'gbtkkudUFlU', type: 'music-videos' },
        { id: '42I5WpeGZec', type: 'music-videos' },
        
        // Studio Sessions
        { id: 'KvW4oQEYy6o', type: 'studio' },
        { id: 'ZDA9oJFBl7c', type: 'studio' },
        { id: 'FC1TDk5npiY', type: 'studio' },
        { id: '9LL6P55kJsA', type: 'studio' },
        { id: 'eqiF9f2E3TE', type: 'studio' },
    ];

    // Batch fetch YouTube metadata for all configured videos
    const fetchYouTubeMetadata = async (videoIds) => {
        if (!videoIds.length) return {};
        
        try {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.warn('YouTube API error:', data.error);
                return {};
            }

            const metadata = {};
            if (data.items) {
                data.items.forEach((item) => {
                    metadata[item.id] = {
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails?.maxres?.url || 
                                   item.snippet.thumbnails?.high?.url ||
                                   `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`
                    };
                });
            }
            return metadata;
        } catch (error) {
            console.warn('Failed to fetch YouTube metadata:', error);
            return {};
        }
    };

    // Get label for video type
    const getLabelForType = (type) => {
        const labels = {
            'music-videos': 'Music Video',
            'studio': 'Studio Session',
            'live': 'Live Performance'
        };
        return labels[type] || 'Video';
    };

    // Create a vault card element
    const createVaultCard = ({ videoId, title, thumbnailUrl, type }) => {
        const card = document.createElement('div');
        card.className = 'rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl video-trigger cursor-pointer';
        card.setAttribute('data-vault-item', '');
        card.setAttribute('data-vault-type', type);
        card.setAttribute('data-video-id', videoId);

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'aspect-square bg-black/40';

        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = title;
        img.className = 'w-full h-full object-cover opacity-70';
        img.loading = 'lazy';

        mediaWrapper.appendChild(img);

        const body = document.createElement('div');
        body.className = 'px-4 py-3 flex items-center justify-between';

        const textWrap = document.createElement('div');

        const labelEl = document.createElement('p');
        labelEl.className = 'text-accent text-[10px] uppercase tracking-[0.3em]';
        labelEl.textContent = getLabelForType(type);

        const titleEl = document.createElement('h3');
        titleEl.className = 'text-white text-sm font-bold uppercase';
        titleEl.textContent = title;

        textWrap.appendChild(labelEl);
        textWrap.appendChild(titleEl);
        body.appendChild(textWrap);

        card.appendChild(mediaWrapper);
        card.appendChild(body);

        return card;
    };
        img.alt = title;
        img.className = 'w-full h-full object-cover opacity-70';
        img.loading = 'lazy';

        mediaWrapper.appendChild(img);

        const body = document.createElement('div');
        body.className = 'px-4 py-3 flex items-center justify-between';

        const textWrap = document.createElement('div');

        const labelEl = document.createElement('p');
        labelEl.className = 'text-accent text-[10px] uppercase tracking-[0.3em]';
        labelEl.textContent = label;

        const titleEl = document.createElement('h3');
        titleEl.className = 'text-white text-sm font-bold uppercase';
        titleEl.textContent = title;

        textWrap.appendChild(labelEl);
        textWrap.appendChild(titleEl);
        body.appendChild(textWrap);

        card.appendChild(mediaWrapper);
        card.appendChild(body);

        return card;
    };

    const getVaultTypeFromTitle = (title, videoId) => {
        // Music video IDs (hardcoded to avoid title matching issues)
        const musicVideoIds = ['GiK9DDAXKJE', 'gbtkkudUFlU', '42I5WpeGZec'];
        // Studio video IDs
        const studioVideoIds = ['KvW4oQEYy6o', 'ZDA9oJFBl7c', 'FC1TDk5npiY', '9LL6P55kJsA', 'eqiF9f2E3TE'];
        
        if (videoId && musicVideoIds.includes(videoId)) {
            return { type: 'music-videos', label: 'Music Video' };
        }
        
        if (videoId && studioVideoIds.includes(videoId)) {
            return { type: 'studio', label: 'Studio Session' };
        }
        
        const lowerTitle = (title || '').toLowerCase();
        if (
            lowerTitle.includes('group therapy') ||
            lowerTitle.includes('heart to heart') ||
            lowerTitle.includes('my obsession')
        ) {
            return { type: 'music-videos', label: 'Music Video' };
        }
        if (lowerTitle.includes('studio') || lowerTitle.includes('session') || lowerTitle.includes('recording')) {
            return { type: 'studio', label: 'Studio Session' };
        }
        return { type: 'live', label: 'Live Performance' };
    };

    const fetchPlaylistItems = async (id) => {
        const items = [];
        let pageToken = '';

        try {
            do {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
                );
                const data = await response.json();

                if (data.error) {
                    console.warn('YouTube playlist API error:', data.error);
                    break;
                }

                const batch = (data.items || []).map((item) => {
                    const snippet = item.snippet || {};
                    const videoId = snippet.resourceId?.videoId;
                    const title = snippet.title || 'Untitled Video';
                    const thumbnails = snippet.thumbnails || {};
                    const thumbnailUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '';
                    return { videoId, title, thumbnailUrl };
                }).filter((item) => item.videoId);

                items.push(...batch);
                pageToken = data.nextPageToken || '';
            } while (pageToken);
        } catch (error) {
            console.warn('YouTube playlist request failed:', error);
        }

        return items;
    };

    const renderVaultItems = () => {
        if (!allPlaylistItems.length) return;

        vaultContainer.innerHTML = '';
        const itemsToShow = allPlaylistItems.slice(0, itemsDisplayed);

        itemsToShow.forEach((item) => {
            const type = item.type || 'live';
            // Get proper label based on type
            let label = 'Live Performance';
            if (type === 'music-videos') {
                label = 'Music Video';
            } else if (type === 'studio') {
                label = 'Studio Session';
            }
            
            const card = createVaultCard({
                videoId: item.videoId,
                title: item.title,
                thumbnailUrl: item.thumbnailUrl,
                type: type,
                label: label,
            });
            vaultContainer.appendChild(card);
        });

        updateLoadMoreButton();
    };

    const updateLoadMoreButton = () => {
        const loadMoreContainer = document.getElementById('load-more-container');
        if (!loadMoreContainer) return;

        if (itemsDisplayed >= allPlaylistItems.length) {
            loadMoreContainer.classList.add('hidden');
        } else {
            loadMoreContainer.classList.remove('hidden');
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const loadPlaylistVideos = async () => {
        if (!vaultContainer) return;
        
        // Fetch live performance videos from playlists and add them dynamically
        allPlaylistItems = [];
        
        if (playlistId) {
            try {
                const playlistItems = await fetchPlaylistItems(playlistId);
                const playlistItemsTagged = playlistItems.map((item) => {
                    const typeInfo = getVaultTypeFromTitle(item.title, item.videoId);
                    return {
                        ...item,
                        type: typeInfo.type,
                    };
                });
                
                allPlaylistItems = allPlaylistItems.concat(playlistItemsTagged);
            } catch (error) {
                console.warn('Failed to fetch main playlist:', error);
            }
        }

        // Fetch additional live performance playlist
        if (additionalPlaylistId) {
            try {
                const livePerformanceItems = await fetchPlaylistItems(additionalPlaylistId);
                const taggedLiveItems = livePerformanceItems.map((item) => ({
                    ...item,
                    type: 'live',
                }));

                // Shuffle live items for variety
                const shuffledLiveItems = shuffleArray(taggedLiveItems);
                allPlaylistItems = allPlaylistItems.concat(shuffledLiveItems);
            } catch (error) {
                console.warn('Failed to fetch live playlist:', error);
            }
        }

        if (allPlaylistItems.length > 0) {
            renderVaultItems();
        }
        
        playlistLoaded = true;
        
        // Fetch titles for ALL vault items (including hardcoded HTML ones)
        fetchVideoTitles();
    };

    // Video Modal Logic
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const closeBtn = document.getElementById('close-modal');
    const getTriggers = () => document.querySelectorAll('.video-trigger');
    let triggers = getTriggers();

    // Vault filter logic
    const vaultFilterButtons = document.querySelectorAll('[data-vault-filter]');
    const getVaultItems = () => document.querySelectorAll('[data-vault-item]');
    let vaultItems = getVaultItems();
    let activeFilter = null;

    const setVaultFilter = (filter) => {
        activeFilter = filter;
        vaultItems.forEach((item) => {
            const type = item.getAttribute('data-vault-type');
            if (!filter || type === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        vaultFilterButtons.forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-vault-filter') === filter);
        });
    };

    const refreshVaultItems = () => {
        vaultItems = getVaultItems();
        if (activeFilter) {
            const hasActive = Array.from(vaultItems).some((item) => item.getAttribute('data-vault-type') === activeFilter);
            if (!hasActive) {
                const fallbackFilters = ['live', 'music-videos', 'studio'];
                const fallback = fallbackFilters.find((filter) =>
                    Array.from(vaultItems).some((item) => item.getAttribute('data-vault-type') === filter)
                );
                if (fallback) activeFilter = fallback;
            }
        }
        setVaultFilter(activeFilter);
    };

    const bindVideoTriggers = () => {
        triggers = getTriggers();
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const videoId = trigger.getAttribute('data-video-id');
                if (videoId) openModal(videoId);
            });
        });
    };

    if (vaultFilterButtons.length) {
        vaultFilterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-vault-filter');
                if (filter) setVaultFilter(filter);
            });
        });
    }

    // Function to open modal
    const openModal = (videoId) => {
        // Update iframe source with autoplay
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        player.src = ""; // Stop video
        document.body.style.overflow = ''; // Unlock scroll
    };

    const initializeVault = async () => {
        // Bind existing HTML hardcoded videos first
        refreshVaultItems();
        bindVideoTriggers();
        
        // Then load API videos
        await loadPlaylistVideos();

        refreshVaultItems();
        bindVideoTriggers();

        // Attach Load More button handler after vault is initialized
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                itemsDisplayed += 4;
                renderVaultItems();
                refreshVaultItems();
                bindVideoTriggers();
            });
        }
    };

    initializeVault();

    // Close listeners
    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});