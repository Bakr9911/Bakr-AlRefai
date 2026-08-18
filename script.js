document.addEventListener('DOMContentLoaded', () => {
    const roleButtons = document.querySelectorAll('.role-btn');

    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedRole = button.getAttribute('data-role');

            // 1. Filter general elements (Certificates, skills, volunteering cards, hobby cards, etc.)
            filterElements('[data-role]', selectedRole);

            // 2. Filter and display the unique About Me text for the role
            updateAboutText(selectedRole);

            // 3. Reset and reorder experience cards dynamically
            reorderExperienceCards(selectedRole);
            
            // 4. Reorder whole sections based on active role view rules
            reorderSections(selectedRole);

            // 5. Trigger smooth fade-in animation for visible sections
            animateVisibleSections();
        });
    });

    function filterElements(selector, role) {
        const items = document.querySelectorAll(selector);
        
        items.forEach(item => {
            if (item.classList.contains('role-btn') || 
                item.classList.contains('about-card') || 
                item.classList.contains('dynamic-section')) return;

            const rolesAttr = item.getAttribute('data-role');
            if (!rolesAttr) return;

            const rolesList = rolesAttr.split(' ');

            if (role === 'all' || rolesList.includes(role)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    function updateAboutText(role) {
        const aboutCards = document.querySelectorAll('.about-card');

        aboutCards.forEach(card => {
            const rolesAttr = card.getAttribute('data-role');
            if (!rolesAttr) return;

            const rolesList = rolesAttr.split(' ');

            if (role === 'all') {
                if (rolesList.includes('all')) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            } else {
                if (rolesList.includes(role)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }

    function reorderExperienceCards(role) {
        const container = document.querySelector('.experience-container');
        if (!container) return;

        const cards = Array.from(container.querySelectorAll('.experience-card'));

        if (role === 'all') {
            cards.forEach(card => card.classList.remove('hidden'));
            return;
        }

        const matchingCards = [];

        cards.forEach(card => {
            const rolesAttr = card.getAttribute('data-role');
            if (!rolesAttr) return;

            const rolesList = rolesAttr.split(' ');

            if (rolesList.includes(role)) {
                matchingCards.push(card);
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        matchingCards.forEach(card => container.prepend(card));
    }

    function reorderSections(role) {
        const container = document.querySelector('.sections-container');
        if (!container) return;

        const sections = Array.from(container.querySelectorAll('.dynamic-section'));

        sections.sort((a, b) => {
            const orderA = parseInt(a.getAttribute(`data-order-${role}`) || a.getAttribute('data-order-all') || 99);
            const orderB = parseInt(b.getAttribute(`data-order-${role}`) || b.getAttribute('data-order-all') || 99);
            return orderA - orderB;
        });

        sections.forEach(section => container.appendChild(section));
    }

    function animateVisibleSections() {
        const visibleSections = document.querySelectorAll('.dynamic-section:not(.hidden)');
        visibleSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
});