document.addEventListener('DOMContentLoaded', function() {
    // Foco automático nos campos
    document.querySelectorAll('.codigo-inputs input').forEach((input, idx, arr) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && idx < arr.length - 1) {
                arr[idx + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === "Backspace" && !this.value && idx > 0) {
                arr[idx - 1].focus();
            }
        });
    });
});