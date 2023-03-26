import { useEffect, useRef } from 'react';

// Add 'submitted' classname to referenced form element when its
// submit button is clicked
function useValidateForm() {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton?.addEventListener('click', () => { ref.current?.classList.add('submitted'); });
  }, [ref]);

  return ref;
}

export default useValidateForm;
