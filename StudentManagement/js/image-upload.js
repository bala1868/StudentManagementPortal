// ==================== IMAGE UPLOAD HANDLER ====================

// Convert image file to Base64 string
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            reject(new Error('Please select a valid image file'));
            return;
        }

        // Check file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            reject(new Error('Image size should be less than 2MB'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

// Handle image upload and preview
async function handleImageUpload(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    
    if (!file) {
        return;
    }

    try {
        // Show loading state
        previewContainer.style.display = 'block';
        previewImage.src = '';
        previewImage.alt = 'Loading...';
        
        // Convert image to Base64
        const base64Image = await convertImageToBase64(file);
        
        // Display preview
        previewImage.src = base64Image;
        previewImage.alt = 'Student Photo Preview';
        removeButton.style.display = 'inline-block';
        
        // Store Base64 in hidden input (will be used when saving)
        photoUrlInput.value = base64Image;
        
        console.log('✅ Image uploaded and converted to Base64');
        
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        alert(error.message || 'Failed to upload image. Please try again.');
        
        // Reset file input
        event.target.value = '';
        previewContainer.style.display = 'none';
    }
}

// Remove uploaded image
function removeUploadedImage() {
    const fileInput = document.getElementById('studentPhotoFile');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    
    // Reset all image-related fields
    fileInput.value = '';
    photoUrlInput.value = '';
    previewImage.src = '';
    removeButton.style.display = 'none';
    previewContainer.style.display = 'none';
    
    console.log('🗑️ Uploaded image removed');
}

// Initialize image upload functionality
function initializeImageUpload() {
    const fileInput = document.getElementById('studentPhotoFile');
    const removeButton = document.getElementById('removeImageBtn');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
    
    if (removeButton) {
        removeButton.addEventListener('click', removeUploadedImage);
    }
    
    console.log('📸 Image upload functionality initialized');
}

// Load existing image for editing
function loadExistingImage(imageUrl) {
    if (!imageUrl || imageUrl === 'https://i.pravatar.cc/150?img=1') {
        return;
    }
    
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    
    // Display existing image
    previewContainer.style.display = 'block';
    previewImage.src = imageUrl;
    previewImage.alt = 'Current Student Photo';
    removeButton.style.display = 'inline-block';
    photoUrlInput.value = imageUrl;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeImageUpload();
});