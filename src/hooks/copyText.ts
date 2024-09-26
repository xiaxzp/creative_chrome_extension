import type { ComputedRef, Ref } from 'vue';

export interface UseCopyCallback {
  onSuccess?: () => void
  onError?: () => void
}

function useCopyText(
  str: string | Ref<string | undefined> | ComputedRef<string | undefined>,
  callback?: UseCopyCallback,
) {
  const inExtensionPage
    = location.protocol.toLowerCase() === 'chrome-extension:';
  const supportClipboardApi
    = !inExtensionPage && Boolean(navigator && 'clipboard' in navigator);

  return async () => {
    const value = unref(str);

    if (typeof value !== 'string') {
      callback?.onError?.();
      return;
    }

    let textarea: HTMLTextAreaElement | undefined;
    try {
      if (supportClipboardApi) {
        await navigator.clipboard.writeText(value);
      }
      else {
        textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.readOnly = true;
        textarea.style.position = 'absolute';
        textarea.style.opacity = '0';
        textarea.style.left = '-1000vw';
        textarea.style.top = '-1000vh';
        document.body.appendChild(textarea);
        textarea.select();
        if (!document.execCommand('copy')) {
          throw new Error('Failed to copy!');
        }
      }
      callback?.onSuccess?.();
    }
    catch (err) {
      console.error(err);
      callback?.onError?.();
    }
    finally {
      textarea?.remove();
    }
  };
}

export default useCopyText;
