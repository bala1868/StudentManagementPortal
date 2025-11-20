// ==================== SCROLL TO MAP FUNCTION ====================
function scrollToMap() {
    const mapCard = document.querySelector('.contact-map-card');
    if (mapCard) {
        mapCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Add highlight animation
        mapCard.style.animation = 'highlightPulse 1s ease-out';
        setTimeout(() => {
            mapCard.style.animation = '';
        }, 1000);
    }
}

// Add this CSS for the highlight animation (can go in contact.css)
const style = document.createElement('style');
style.textContent = `
    @keyframes highlightPulse {
        0%, 100% {
            box-shadow: var(--shadow-md);
        }
        50% {
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.3), var(--shadow-xl);
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Make the Visit Us card clickable
document.addEventListener('DOMContentLoaded', function() {
    const visitUsCard = document.querySelector('.contact-info-card-compact');
    if (visitUsCard && visitUsCard.querySelector('.contact-icon-compact').textContent.includes('📍')) {
        visitUsCard.style.cursor = 'pointer';
        visitUsCard.addEventListener('click', scrollToMap);
    }
});