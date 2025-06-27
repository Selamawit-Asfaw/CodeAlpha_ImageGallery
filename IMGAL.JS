document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        document.querySelector('.preloader').classList.add('fade-out');
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    });

    // Sample image data
    const imageData = [
        { id: 1, src: 'download (1).jpg', category: 'nature', caption: 'Mountain Sunrise', likes: 24 },
        { id: 2, src: 'istockphoto-1048358188-612x612.jpg', category: 'architecture', caption: 'Modern Skyscraper', likes: 18 },
        { id: 3, src: 'download.jpg', category: 'people', caption: 'Portrait Session', likes: 32 },
        { id: 4, src: 'download (5).jpg', category: 'abstract', caption: 'Colorful Patterns', likes: 15 },
        { id: 5, src: 'download (2).jpg', category: 'animals', caption: 'Wildlife Photography', likes: 29 },
        { id: 6, src: 'download (3).jpg', category: 'nature', caption: 'Forest Pathway', likes: 21 },
        { id: 7, src: 'images.jpg', category: 'architecture', caption: 'Historical Landmark', likes: 14 },
        { id: 8, src: 'download (4).jpg', category: 'people', caption: 'Urban Portrait', likes: 27 },
        { id: 9, src: 'images.jpg', category: 'abstract', caption: 'Geometric Design', likes: 19 },
        { id: 10, src: 'download (6).jpg', category: 'animals', caption: 'Wildlife Close-up', likes: 36 }
    ];

    // DOM Elements
    const gallery = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const likeCount = document.querySelector('.like-count');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const downloadBtn = document.querySelector('.download-btn');

    // Variables
    let currentImageIndex = 0;
    let filteredImages = [...imageData];
    let displayedImages = 8;
    let currentView = 'grid';
    let currentFilter = 'all';

    // Initialize gallery
    function initGallery() {
        renderGallery(filteredImages.slice(0, displayedImages));
        setupEventListeners();
    }

    // Render gallery items
    function renderGallery(images) {
        gallery.innerHTML = '';
        
        images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${currentView}-item`;
            galleryItem.dataset.category = image.category;
            galleryItem.dataset.index = index;
            
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.caption}" class="gallery-img">
                <div class="gallery-caption">
                    <h3>${image.caption}</h3>
                    <p>${image.likes} <i class="far fa-heart"></i></p>
                </div>
                <span class="gallery-category">${image.category}</span>
            `;
            
            // Add animation delay
            galleryItem.style.animationDelay = `${index * 0.1}s`;
            
            gallery.appendChild(galleryItem);
        });
    }

    // Filter images by category
    function filterImages(category) {
        currentFilter = category;
        if (category === 'all') {
            filteredImages = [...imageData];
        } else {
            filteredImages = imageData.filter(image => image.category === category);
        }
        displayedImages = 8;
        renderGallery(filteredImages.slice(0, displayedImages));
        
        // Reset load more button if needed
        if (filteredImages.length <= displayedImages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    // Search images
    function searchImages(query) {
        const searchTerm = query.toLowerCase();
        filteredImages = imageData.filter(image => 
            image.caption.toLowerCase().includes(searchTerm) || 
            image.category.toLowerCase().includes(searchTerm)
        );
        displayedImages = 8;
        renderGallery(filteredImages.slice(0, displayedImages));
        
        if (filteredImages.length <= displayedImages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    // Change view mode
    function changeViewMode(view) {
        currentView = view;
        gallery.className = `gallery ${view}-view`;
        renderGallery(filteredImages.slice(0, displayedImages));
    }

    // Load more images
    function loadMoreImages() {
        displayedImages += 4;
        renderGallery(filteredImages.slice(0, displayedImages));
        
        if (displayedImages >= filteredImages.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const image = filteredImages[index];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.caption;
        likeCount.textContent = image.likes;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        if (direction === 'prev') {
            currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        } else {
            currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        }
        
        const image = filteredImages[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.caption;
        likeCount.textContent = image.likes;
    }

    // Like image
    function likeImage() {
        const currentImage = filteredImages[currentImageIndex];
        currentImage.likes++;
        likeCount.textContent = currentImage.likes;
        
        // Update the corresponding gallery item
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems[currentImageIndex]) {
            const likeElement = galleryItems[currentImageIndex].querySelector('.gallery-caption p');
            if (likeElement) {
                likeElement.textContent = `${currentImage.likes} ♥`;
            }
        }
    }

    // Download image
    function downloadImage() {
        const link = document.createElement('a');
        link.href = filteredImages[currentImageIndex].src;
        link.download = `image-${filteredImages[currentImageIndex].id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterImages(button.dataset.filter);
            });
        });

        // View buttons
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                changeViewMode(button.dataset.view);
            });
        });

        // Search functionality
        searchBtn.addEventListener('click', () => {
            searchImages(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchImages(searchInput.value);
            }
        });

        // Load more button
        loadMoreBtn.addEventListener('click', loadMoreImages);

        // Gallery item click (delegated)
        gallery.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.dataset.index);
                openLightbox(index);
            }
        });

        // Lightbox controls
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('prev');
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('next');
        });

        // Like button
        likeCount.addEventListener('click', likeImage);

        // Download button
        downloadBtn.addEventListener('click', downloadImage);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            
            if (e.key === 'Escape') {
                lightbox.classList.remove('show');
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        });

        // Close when clicking outside image in lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Initialize the gallery
    initGallery();
});