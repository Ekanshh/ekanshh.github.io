/**
 * Personal Portfolio Website - Main JavaScript
 * Author: Ekansh Sharma
 * 
 * Table of Contents:
 * 1. Page Navigation
 * 2. Video Controls
 * 3. Image Modal Functionality
 * 4. Navbar Behavior
 */

/* =============================================================================
   1. PAGE NAVIGATION
   ============================================================================= */

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Generate IDs for all headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach(heading => {
        // Skip if ID already exists
        if (heading.id) return;

        // Generate ID from heading text
        const id = heading.textContent
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')  // Remove special characters
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens

        // Handle duplicates
        let uniqueId = id;
        let counter = 1;
        while (document.getElementById(uniqueId)) {
            uniqueId = `${id}-${counter}`;
            counter++;
        }

        heading.id = uniqueId;

        // Add copy link to headings
        addCopyLink(heading);
    });

    // Initialize other functionality
    try {
        highlightCurrentPage();
        initVideoControls();
        initializeNavbarScroll();
        initImageModal();
        initMobileMenu();
    } catch (error) {
        console.error('Error in other functionality:', error);
    }
});

/**
 * Highlight the current page in navigation menu
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'home.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize mobile hamburger menu functionality
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');

    if (!hamburger || !sidebar || !sidebarOverlay) return;

    // Toggle sidebar on hamburger click
    hamburger.addEventListener('click', function () {
        toggleSidebar();
    });

    // Close sidebar on overlay click
    sidebarOverlay.addEventListener('click', function () {
        closeSidebar();
    });

    // Close sidebar when clicking a link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            closeSidebar();
        });
    });

    // Close sidebar on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    function toggleSidebar() {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');

        // Prevent body scroll when sidebar is open
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeSidebar() {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}


/* =============================================================================
   2. VIDEO CONTROLS
   ============================================================================= */

/**
 * Initialize video controls and autoplay functionality
 */
function initVideoControls() {
    const allVideos = document.querySelectorAll('video');

    allVideos.forEach(video => {
        // Set default playback speed to 1.5x for all videos
        video.playbackRate = 1.5;

        // Ensure video is muted for autoplay to work
        video.muted = true;

        // Try to autoplay the video
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);

                // Add click handler as fallback for autoplay restrictions
                video.addEventListener('click', function () {
                    video.play().catch(e => console.log('Play failed:', e));
                });
            });
        }
    });
}

/* =============================================================================
   3. IMAGE MODAL FUNCTIONALITY
   ============================================================================= */

/**
 * Initialize image modal for clickable images
 */
function initImageModal() {
    // Add click handlers to all images with clickable-image class
    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', function () {
            openImageModal(this.src, this.alt);
        });
    });
}

/**
 * Open image in modal overlay
 * @param {string} imageSrc - Source URL of the image
 * @param {string} imageAlt - Alt text for the image
 */
function openImageModal(imageSrc, imageAlt) {
    // Remove existing modal if present
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.display = 'flex';

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-content';
    modalImg.src = imageSrc;
    modalImg.alt = imageAlt;

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';

    // Assemble modal
    modal.appendChild(modalImg);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    // Close modal handlers
    closeBtn.addEventListener('click', closeImageModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

/**
 * Close the image modal
 */
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
    }
}

/* =============================================================================
   4. NAVBAR BEHAVIOR
   ============================================================================= */

/**
 * Add copy link to a heading
 * @param {HTMLElement} heading - The heading element
 */
function addCopyLink(heading) {
    // Create copy link
    const copyLink = document.createElement('a');
    copyLink.href = `#${heading.id}`;
    copyLink.className = 'copy-link';
    copyLink.innerHTML = '⚓';
    copyLink.title = 'Copy link to this section';

    // Add click handler to copy URL
    copyLink.addEventListener('click', function (e) {
        e.preventDefault();

        // Create the full URL
        const url = window.location.origin + window.location.pathname + '#' + heading.id;

        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Show feedback
            const originalText = copyLink.innerHTML;
            copyLink.innerHTML = '✅';
            copyLink.title = 'Link copied!';

            setTimeout(() => {
                copyLink.innerHTML = originalText;
                copyLink.title = 'Copy link to this section';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback: select the URL
            copyLink.innerHTML = '❌';
            copyLink.title = 'Click to copy manually';
        });
    });

    // Add the link to the heading
    heading.appendChild(copyLink);
}

/**
 * Initialize navbar background change on scroll
 */
function initializeNavbarScroll() {
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');

        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
} 