document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    container.addEventListener('mouseover', function() {
        container.classList.add('hover');
    });
    
    container.addEventListener('mouseout', function() {
        container.classList.remove('hover');
    });
});
