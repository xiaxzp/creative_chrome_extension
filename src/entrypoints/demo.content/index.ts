export default defineContentScript({
  matches: ['*://*.google.com.hk/*'],
  main() {
    console.log('Hello demo content.');
  },
});
