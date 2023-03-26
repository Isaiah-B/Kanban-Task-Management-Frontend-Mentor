import { useEffect, useRef } from 'react';

// Fires callback when the ref assigned by this function is clicked
const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement | HTMLElement | HTMLFormElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Call callback if the clicked element is the same as the referenced element (modal wrapper)
      if (ref.current && ref.current.isSameNode(event.target as HTMLDivElement)) {
        callback();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (ref.current && event.key === 'Escape') {
        callback();
      }
    };

    // Provide 'true' param to prevent click event from bubbling up from
    // the clicked task to the modal background, immediately closing the modal
    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [ref]);

  return ref;
};

export default useClickOutside;
