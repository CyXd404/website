import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 'k':
            e.preventDefault();
            navigate('/contact');
            break;
          case 'p':
            e.preventDefault();
            navigate('/projects');
            break;
          case 'e':
            e.preventDefault();
            navigate('/experience');
            break;
        }
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          showShortcutsModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const showShortcutsModal = () => {
    const shortcuts = [
      { keys: 'Ctrl/Cmd + H', action: 'Go to Home' },
      { keys: 'Ctrl/Cmd + K', action: 'Go to Contact' },
      { keys: 'Ctrl/Cmd + P', action: 'Go to Projects' },
      { keys: 'Ctrl/Cmd + E', action: 'Go to Experience' },
      { keys: '?', action: 'Show this help' }
    ];

    const message = shortcuts
      .map(s => `${s.keys}: ${s.action}`)
      .join('\n');

    alert(`Keyboard Shortcuts:\n\n${message}`);
  };
};
