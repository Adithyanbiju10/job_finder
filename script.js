// ===== JOB DATABASE =====
const jobs = [
    { title: "Customer Support", company: "Tech Corp", type: "Remote", desc: "Work from home answering chats.", suitable: ["blind", "physical"] },
    { title: "Audio Editor", company: "Podcast Inc", type: "Remote", desc: "Edit audio files using software.", suitable: ["blind"] },
    { title: "Sign Language Interpreter", company: "Global Services", type: "On-Site", desc: "Interpret for meetings.", suitable: ["deaf"] },
    { title: "Data Entry Clerk", company: "Admin Solutions", type: "Remote", desc: "Enter data into spreadsheets.", suitable: ["blind", "deaf", "physical"] },
    { title: "Wheelchair Accessible Office Admin", company: "City Office", type: "On-Site", desc: "Front desk job, wheelchair accessible.", suitable: ["physical"] },
    { title: "Braille Transcriber", company: "EduBooks", type: "Remote", desc: "Convert books to Braille format.", suitable: ["blind"] },
    { title: "IT Support Specialist", company: "Tech Solutions", type: "On-Site", desc: "Help employees with computer issues.", suitable: ["physical", "other"] },
    { title: "Captioning Specialist", company: "VideoHub", type: "Remote", desc: "Add captions to video content.", suitable: ["deaf"] },
    { title: "Accessibility Tester", company: "WebA11y", type: "Remote", desc: "Test websites for accessibility compliance.", suitable: ["blind", "physical", "other"] },
    { title: "Mobility Equipment Technician", company: "MedEquip", type: "On-Site", desc: "Repair and maintain wheelchairs and other devices.", suitable: ["physical"] },
    { title: "Telemarketer", company: "SalesPro", type: "Remote", desc: "Make phone calls to potential customers.", suitable: ["blind", "deaf", "physical"] },
    { title: "Online Tutor", company: "EduConnect", type: "Remote", desc: "Teach students online in various subjects.", suitable: ["blind", "physical", "other"] },
    { title: "Receptionist", company: "OfficePlus", type: "On-Site", desc: "Greet visitors and answer phone calls.", suitable: ["physical"] },
    { title: "Content Writer", company: "MediaHouse", type: "Remote", desc: "Write articles and blog posts.", suitable: ["blind", "physical", "other"] },
    { title: "Sign Language Tutor", company: "DeafConnect", type: "Remote", desc: "Teach sign language to students.", suitable: ["deaf"] }
];

// ===== SLIDESHOW FUNCTIONALITY =====
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Function to show slides automatically
function showSlides() {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Increment slide index
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Add active class to current slide and dot
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

// Function for manual slide navigation
function currentSlide(n) {
    slideIndex = n - 1; // Set to the clicked slide
    showSlides();
    
    // Reset auto-rotation timer when manually changing slides
    clearInterval(slideInterval);
    slideInterval = setInterval(showSlides, 5000);
}

// Add click events to dots for manual navigation
dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const slideNum = parseInt(this.getAttribute('data-slide'));
        currentSlide(slideNum);
    });
});

// Start slideshow - automatically changes every 5 seconds
slideInterval = setInterval(showSlides, 5000);

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ===== JOB SEARCH FUNCTIONALITY =====
const disabilitySelect = document.getElementById('disability-select');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const voiceBtn = document.getElementById('voice-btn');
const jobList = document.getElementById('job-list');

// Voice mode state
let isVoiceMode = false;

// Handle disability selection
disabilitySelect.addEventListener('change', function() {
    const selectedDisability = this.value;
    
    // Show/hide voice button based on selection
    if (selectedDisability === 'blind') {
        voiceBtn.style.display = 'inline-block';
        enableVoiceMode();
    } else {
        voiceBtn.style.display = 'none';
        disableVoiceMode();
    }
    
    // Filter and display jobs
    filterJobs();
});

// Enable voice mode for blind users
function enableVoiceMode() {
    isVoiceMode = true;
    document.body.classList.add('voice-mode');
    speak("Voice mode activated. Please click the microphone button and speak to search for jobs.");
}

// Disable voice mode
function disableVoiceMode() {
    isVoiceMode = false;
    document.body.classList.remove('voice-mode');
}

// Search button click
searchBtn.addEventListener('click', filterJobs);

// Enter key in search input
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        filterJobs();
    }
});

// Filter jobs based on selection and search
function filterJobs() {
    const disability = disabilitySelect.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter jobs
    const filteredJobs = jobs.filter(job => {
        const matchesDisability = job.suitable.includes(disability) || disability === 'other' || disability === '';
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                             job.company.toLowerCase().includes(searchTerm) ||
                             job.desc.toLowerCase().includes(searchTerm);
        return matchesDisability && matchesSearch;
    });
    
    // Display results
    displayJobs(filteredJobs);
    
    // Voice feedback
    if (isVoiceMode) {
        if (filteredJobs.length > 0) {
            speak(`Found ${filteredJobs.length} jobs for you.`);
        } else {
            speak("No jobs found matching your criteria.");
        }
    }
}

// Display jobs in the container
function displayJobs(jobsToDisplay) {
    jobList.innerHTML = '';
    
    if (jobsToDisplay.length === 0) {
        jobList.innerHTML = '<p class="placeholder-text">No jobs found matching your criteria. Try a different search.</p>';
        return;
    }
    
    jobsToDisplay.forEach((job, index) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.setAttribute('role', 'article');
        jobCard.setAttribute('tabindex', '0');
        
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Type:</strong> ${job.type}</p>
            <p>${job.desc}</p>
            <div class="tags">
                ${job.suitable.map(tag => `<span>${capitalizeFirst(tag)}</span>`).join('')}
            </div>
        `;
        
        // Add click event for voice feedback
        jobCard.addEventListener('click', () => {
            if (isVoiceMode) {
                speak(`${job.title} at ${job.company}. ${job.desc}`);
            }
        });
        
        jobList.appendChild(jobCard);
    });
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ===== VOICE SEARCH FUNCTIONALITY =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
        voiceBtn.style.background = '#e74c3c';
    };
    
    recognition.onend = function() {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Click to Speak';
        voiceBtn.style.background = '';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        filterJobs();
        
        if (isVoiceMode) {
            speak(`Searching for ${transcript}`);
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        speak("Sorry, I couldn't understand. Please try again.");
    };
    
    // Voice button click handler
    voiceBtn.addEventListener('click', () => {
        try {
            recognition.start();
        } catch (e) {
            console.error('Recognition already started:', e);
        }
    });
} else {
    // Speech recognition not supported
    voiceBtn.title = 'Speech recognition not supported in this browser';
    voiceBtn.style.cursor = 'not-allowed';
}

// ===== TEXT-TO-SPEECH FUNCTION =====
function speak(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
}

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (name && email && message) {
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        
        if (isVoiceMode) {
            speak("Thank you for your message. We will respond within 24 hours.");
        }
    } else {
        alert('Please fill in all fields.');
        
        if (isVoiceMode) {
            speak("Please fill in all the required fields.");
        }
    }
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===== ACCESSIBILITY FEATURES =====
// Announce page load for screen readers
window.addEventListener('load', () => {
    if (isVoiceMode) {
        speak("AbilityJobs page loaded. Use the dropdown to select your disability type.");
    }
});

// Keyboard navigation for job cards
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('job-card')) {
        e.target.click();
    }
});
