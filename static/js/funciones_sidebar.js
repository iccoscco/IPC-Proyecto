document.querySelectorAll('.submenu-btn').forEach(button => {
  button.addEventListener('click', () => {
      const submenu = button.parentElement;
      submenu.classList.toggle('active');
  });
});