/* ==========================================
   CampusConnect - Authentication JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initRoleSelector();
    initPasswordToggle();
    initPasswordStrength();
    initMultiStepForm();
    initFormValidation();
    initSocialLogin();
});

// ===== Role Selector =====
function initRoleSelector() {
    const roleBtns = document.querySelectorAll('.role-btn');
    
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Add animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
}

// ===== Password Toggle =====
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}

// ===== Password Strength =====
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthFill) return;
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculateStrength(password);
        
        strengthFill.style.width = strength.width;
        strengthFill.className = `strength-fill ${strength.class}`;
        
        if (strengthText) {
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        }
    });
    
    function calculateStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (password.length === 0) {
            return { width: '0%', class: '', text: 'Password strength', color: 'var(--text-tertiary)' };
        }
        
        if (score <= 2) {
            return { width: '33%', class: 'weak', text: 'Weak - Add more characters', color: 'var(--error)' };
        }
        
        if (score <= 4) {
            return { width: '66%', class: 'medium', text: 'Medium - Getting better', color: 'var(--warning)' };
        }
        
        return { width: '100%', class: 'strong', text: 'Strong - Great password!', color: 'var(--success)' };
    }
}

// ===== Multi-Step Form =====
function initMultiStepForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');
    
    let currentStep = 1;
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length) {
                    goToStep(currentStep + 1);
                }
            }
        });
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    function goToStep(step) {
        // Hide current step
        steps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.add('completed');
        
        // Show new step
        currentStep = step;
        steps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.remove('completed');
        
        // Remove completed from future steps
        for (let i = currentStep; i < progressSteps.length; i++) {
            progressSteps[i].classList.remove('completed', 'active');
        }
        
        // Animation
        const activeStep = steps[currentStep - 1];
        activeStep.style.opacity = '0';
        activeStep.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            activeStep.style.transition = 'all 0.3s ease';
            activeStep.style.opacity = '1';
            activeStep.style.transform = 'translateX(0)';
        }, 50);
    }
    
    function validateStep(step) {
        const currentStepEl = steps[step - 1];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const wrapper = input.closest('.input-wrapper') || input.closest('.form-group');
            
            if (!input.value.trim()) {
                isValid = false;
                wrapper?.classList.add('error');
                shakeElement(wrapper);
            } else {
                wrapper?.classList.remove('error');
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    wrapper?.classList.add('error');
                    showFieldError(input, 'Please enter a valid email address');
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(input.value.replace(/\D/g, ''))) {
                    isValid = false;
                    wrapper?.classList.add('error');
                    showFieldError(input, 'Please enter a valid 10-digit phone number');
                }
            }
        });
        
        // Password match validation on step 3
        if (step === 3) {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                const wrapper = confirmPassword.closest('.input-wrapper');
                wrapper?.classList.add('error');
                showFieldError(confirmPassword, 'Passwords do not match');
            }
            
            // Check password strength
            if (password && password.value.length < 8) {
                isValid = false;
                const wrapper = password.closest('.input-wrapper');
                wrapper?.classList.add('error');
                showFieldError(password, 'Password must be at least 8 characters');
            }
            
            // Terms checkbox
            const terms = document.getElementById('terms');
            if (terms && !terms.checked) {
                isValid = false;
                showToast('Please accept the terms and conditions', 'error');
            }
        }
        
        if (!isValid) {
            showToast('Please fill all required fields correctly', 'error');
        }
        
        return isValid;
    }
    
    function shakeElement(element) {
        if (!element) return;
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    function showFieldError(input, message) {
        const group = input.closest('.form-group');
        let errorEl = group?.querySelector('.field-error');
        
        if (!errorEl && group) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.style.cssText = 'color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;';
            group.appendChild(errorEl);
        }
        
        if (errorEl) {
            errorEl.textContent = message;
        }
        
        // Remove error on input
        input.addEventListener('input', () => {
            const wrapper = input.closest('.input-wrapper') || group;
            wrapper?.classList.remove('error');
            errorEl?.remove();
        }, { once: true });
    }
}

// ===== Form Validation =====
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('.role-btn.active')?.dataset.role || 'student';
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner small"></span> Signing in...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Demo validation
            if (email && password) {
                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    email,
                    role,
                    name: email.split('@')[0],
                    isLoggedIn: true
                }));
                
                showToast('Login successful! Redirecting...', 'success');
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            showToast('Invalid email or password', 'error');
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner small"></span> Creating account...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            const userData = {
                firstName: document.getElementById('firstName')?.value,
                lastName: document.getElementById('lastName')?.value,
                email: document.getElementById('email')?.value,
                college: document.getElementById('college')?.value,
                department: document.getElementById('department')?.value,
                year: document.getElementById('year')?.value
            };
            
            localStorage.setItem('registeredUser', JSON.stringify(userData));
            
            showToast('Account created successfully!', 'success');
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
            submitBtn.classList.add('btn-success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            showToast('Registration failed. Please try again.', 'error');
        }
    }
}

// ===== Social Login =====
function initSocialLogin() {
    const googleBtn = document.querySelector('.social-btn.google');
    const microsoftBtn = document.querySelector('.social-btn.microsoft');
    
    googleBtn?.addEventListener('click', () => {
        showToast('Google login coming soon!', 'info');
    });
    
    microsoftBtn?.addEventListener('click', () => {
        showToast('Microsoft login coming soon!', 'info');
    });
}

// ===== Toast Helper =====
function showToast(message, type = 'info') {
    // Check if global showToast exists
    if (window.CampusConnect?.showToast) {
        window.CampusConnect.showToast(message, type);
        return;
    }
    
    // Fallback implementation
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        margin-top: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.innerHTML = `
        <div style="width: 8px; height: 100%; background: ${colors[type]}; border-radius: 4px; position: absolute; left: 0; top: 0; bottom: 0;"></div>
        <span style="margin-left: 0.5rem;">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);