import Controller from '@/controller';
export default () => {
  const unmount = Controller?.subscribe((data) => {
    console.log('bg message', data);
  });
  return unmount;
};
