import Controller from '@/controller';
export default () => {
  const unmount = Controller?.subscribe((data) => {
    console.log('content message', data);
  });
  return unmount;
};
